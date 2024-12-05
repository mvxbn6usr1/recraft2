import { useState, useEffect, useCallback } from 'react';
import { ImageIcon, Trash2, Info, Download, Copy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageModal } from '@/components/ui/image-modal';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { imageStorage } from '@/lib/image-storage';
import { styleStorage } from '@/lib/style-storage';
import type { ToolType } from '@/types/recraft';
import type { RecraftGenerateParams } from '@/types/recraft';
import type { ImageData } from '@/lib/image-storage';

interface ImageGalleryProps {
  loading: boolean;
  onImageAction: (imageId: string, tool: ToolType) => void;
  processingImageId: string | null;
  onUseAsInput?: (params: Partial<RecraftGenerateParams>) => void;
}

export function ImageGallery({ loading: globalLoading, onImageAction, processingImageId, onUseAsInput }: ImageGalleryProps) {
  const [storedImages, setStoredImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [selectedMetadata, setSelectedMetadata] = useState<ImageData | null>(null);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [customStyleName, setCustomStyleName] = useState<string | null>(null);

  useEffect(() => {
    if (selectedMetadata?.metadata.style_id) {
      styleStorage.getStyle(selectedMetadata.metadata.style_id)
        .then(style => {
          if (style) {
            setCustomStyleName(style.name);
          }
        })
        .catch(console.error);
    } else {
      setCustomStyleName(null);
    }
  }, [selectedMetadata]);

  const loadStoredImages = useCallback(async () => {
    setLoading(true);
    try {
      const images = await imageStorage.getImages();
      setStoredImages(images);
    } catch (error) {
      console.error('Failed to load images:', error);
      setLoadError('Failed to load images. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredImages();
  }, [loadStoredImages]);

  useEffect(() => {
    if (!globalLoading) {
      loadStoredImages();
    }
  }, [globalLoading, loadStoredImages]);

  const deleteImage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await imageStorage.deleteImage(id);
      await loadStoredImages();
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const handleImageClick = (image: ImageData) => {
    if (image.id === processingImageId) {
      return;
    }
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleInfoClick = (image: ImageData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMetadata(image);
    setMetadataOpen(true);
  };

  const handleImageAction = (tool: ToolType) => {
    if (selectedImage) {
      onImageAction(selectedImage.id, tool);
      setModalOpen(false);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const handleUseAsInput = () => {
    if (selectedMetadata?.metadata) {
      const params: Partial<RecraftGenerateParams> = {
        prompt: selectedMetadata.metadata.prompt,
        style: selectedMetadata.metadata.style,
        style_id: selectedMetadata.metadata.style_id,
        substyle: selectedMetadata.metadata.substyle,
        model: selectedMetadata.metadata.model,
        size: selectedMetadata.metadata.size,
        controls: selectedMetadata.metadata.controls
      };
      onUseAsInput?.(params);
      setMetadataOpen(false);
    }
  };

  if (loadError) {
    return (
      <div className="flex-1 flex items-center justify-center text-destructive">
        <p>Error: {loadError}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Loading tile */}
            {(loading || globalLoading) && (
              <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted animate-pulse flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground animate-pulse" />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="h-4 w-24 bg-muted-foreground/20 rounded animate-pulse" />
                </div>
              </div>
            )}
            
            {/* Image grid */}
            {storedImages.map((image) => (
              <div
                key={image.id}
                className={`group relative aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer ${
                  image.id === processingImageId ? 'opacity-50' : ''
                }`}
                onClick={() => handleImageClick(image)}
              >
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
                
                <img
                  src={image.url}
                  alt={image.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', image.url);
                    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23ccc"/><text x="50%" y="50%" text-anchor="middle" fill="%23666">Error</text></svg>';
                  }}
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                
                {/* Image title and metadata */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-sm font-medium text-white truncate">
                    {image.title || 'Untitled image'}
                  </h3>
                </div>

                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-white/10 hover:bg-white/20"
                    onClick={(e) => handleInfoClick(image, e)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-white/10 hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(image.url);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  {image.id !== processingImageId && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="bg-white/10 hover:bg-red-500/80"
                      onClick={(e) => deleteImage(image.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Original/Variant indicator */}
                {image.metadata?.originalImageId && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-white/10 rounded text-xs text-white">
                    Variant
                  </div>
                )}
              </div>
            ))}
          </div>
          {storedImages.length === 0 && !loading && !globalLoading && (
            <div className="h-[80vh] flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium">No images generated yet</h3>
              <p className="text-sm">Use the sidebar to generate your first image</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Image action modal */}
      {selectedImage && (
        <ImageModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          imageUrl={selectedImage.url}
          title={selectedImage.title}
          onActionClick={handleImageAction}
        />
      )}

      {/* Metadata modal */}
      <Dialog open={metadataOpen} onOpenChange={setMetadataOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image Metadata</DialogTitle>
            <DialogDescription>
              Details and settings used to create this image
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedMetadata?.metadata.prompt && (
              <div className="space-y-2">
                <h4 className="font-medium">Prompt</h4>
                <div className="flex items-start space-x-2">
                  <p className="flex-1 text-sm text-muted-foreground">
                    {selectedMetadata.metadata.prompt}
                  </p>
                  <TooltipProvider>
                    <Tooltip open={showCopyTooltip}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedMetadata.metadata.prompt || '');
                            setShowCopyTooltip(true);
                            setTimeout(() => setShowCopyTooltip(false), 1000);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copied!</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            )}
            
            {(selectedMetadata?.metadata.style || selectedMetadata?.metadata.style_id) && (
              <div>
                <h4 className="font-medium">Style</h4>
                <p className="text-sm text-muted-foreground">
                  {customStyleName || selectedMetadata.metadata.style?.replace('_', ' ')}
                </p>
              </div>
            )}
            
            {selectedMetadata?.metadata.substyle && !selectedMetadata?.metadata.style_id && (
              <div>
                <h4 className="font-medium">Substyle</h4>
                <p className="text-sm text-muted-foreground">{selectedMetadata.metadata.substyle}</p>
              </div>
            )}
            
            {selectedMetadata?.metadata.tool && (
              <div>
                <h4 className="font-medium">Processing</h4>
                <p className="text-sm text-muted-foreground capitalize">{selectedMetadata.metadata.tool}</p>
              </div>
            )}

            {selectedMetadata?.metadata.model && (
              <div>
                <h4 className="font-medium">Model</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedMetadata.metadata.model === 'recraftv3' ? 'Recraft V3' : 'Recraft 20B'}
                </p>
              </div>
            )}

            {selectedMetadata?.metadata.size && (
              <div>
                <h4 className="font-medium">Dimensions</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedMetadata.metadata.size.replace('x', ' × ')}
                </p>
              </div>
            )}

            {selectedMetadata?.metadata.controls?.colors && selectedMetadata.metadata.controls.colors.length > 0 && (
              <div>
                <h4 className="font-medium">Colors</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedMetadata.metadata.controls.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded border border-border"
                      style={{
                        backgroundColor: `rgb(${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]})`
                      }}
                      title={`RGB(${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]})`}
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedMetadata?.metadata.controls?.background_color && (
              <div>
                <h4 className="font-medium">Background Color</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-6 h-6 rounded border border-border"
                    style={{
                      backgroundColor: `rgb(${selectedMetadata.metadata.controls.background_color.rgb[0]}, ${selectedMetadata.metadata.controls.background_color.rgb[1]}, ${selectedMetadata.metadata.controls.background_color.rgb[2]})`
                    }}
                    title={`RGB(${selectedMetadata.metadata.controls.background_color.rgb[0]}, ${selectedMetadata.metadata.controls.background_color.rgb[1]}, ${selectedMetadata.metadata.controls.background_color.rgb[2]})`}
                  />
                  <span className="text-sm text-muted-foreground">
                    RGB({selectedMetadata.metadata.controls.background_color.rgb[0]}, {selectedMetadata.metadata.controls.background_color.rgb[1]}, {selectedMetadata.metadata.controls.background_color.rgb[2]})
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {onUseAsInput && selectedMetadata?.metadata && (
              <Button onClick={handleUseAsInput}>
                Use as Input
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}