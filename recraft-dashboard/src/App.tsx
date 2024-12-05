import { useState, useCallback, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { ImageGallery } from '@/components/ImageGallery';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { generateImage, vectorizeImage, removeBackground, clarityUpscale, generativeUpscale, createStyle } from '@/lib/recraft';
import { imageStorage, type ImageMetadata } from '@/lib/image-storage';
import { Debug } from '@/components/Debug';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { styleStorage } from '@/lib/style-storage';
import type { RecraftGenerateParams, ToolType, FileUploadParams, CreateStyleParams, StyleType } from '@/types/recraft';

interface UploadState {
  file?: File | null;
  files?: File[];
}

const defaultGenerateParams: RecraftGenerateParams = {
  prompt: '',
  style: 'realistic_image',
  model: 'recraftv3',
  size: '1024x1024',
  controls: {
    colors: [],
  },
};

const defaultUploadParams: Record<ToolType, UploadState> = {
  vectorize: { file: null },
  removeBackground: { file: null },
  clarityUpscale: { file: null },
  generativeUpscale: { file: null },
  createStyle: { files: [] },
  generate: { file: null },
};

const defaultCreateStyleParams: CreateStyleParams = {
  style: 'digital_illustration',
  files: [],
};

function App() {
  const [activeTool, setActiveTool] = useState<ToolType>(() => {
    const saved = localStorage.getItem('activeTool');
    return (saved as ToolType) || 'generate';
  });

  const [loading, setLoading] = useState(false);
  const [processingImageId, setProcessingImageId] = useState<string | null>(null);
  const [errorDialog, setErrorDialog] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const { toast } = useToast();

  // Load generate params from localStorage
  const [generateParams, setGenerateParams] = useState<RecraftGenerateParams>(() => {
    const saved = localStorage.getItem('generateParams');
    return saved ? JSON.parse(saved) : defaultGenerateParams;
  });

  // Load upload params from localStorage (note: files can't be stored in localStorage)
  const [uploadParams, setUploadParams] = useState<Record<ToolType, UploadState>>(defaultUploadParams);

  // Load create style params from localStorage (note: files can't be stored in localStorage)
  const [createStyleParams, setCreateStyleParams] = useState<CreateStyleParams>(defaultCreateStyleParams);

  // Save active tool to localStorage
  useEffect(() => {
    localStorage.setItem('activeTool', activeTool);
  }, [activeTool]);

  // Save generate params to localStorage
  useEffect(() => {
    localStorage.setItem('generateParams', JSON.stringify(generateParams));
  }, [generateParams]);

  const handleGenerate = async (params: RecraftGenerateParams) => {
    console.log('Generating with params:', params);
    setLoading(true);
    try {
      const response = await generateImage(params);
      console.log('Generation response:', response);

      // Prepare metadata
      const metadata: ImageMetadata = {
        prompt: params.prompt,
        style: params.style,
        style_id: params.style_id,
        substyle: params.substyle,
        tool: 'generate',
        model: params.model,
        size: params.size,
        controls: params.controls
      };

      const title = `[Generated] ${params.prompt}`;
      const savedImage = await imageStorage.saveImage(response.data[0].url, metadata, title);
      console.log('Generated image saved:', savedImage);

      toast({
        title: 'Image generated successfully',
        description: 'Your image has been added to the gallery.',
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: 'Error generating image',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (params: FileUploadParams, tool: ToolType, originalMetadata?: ImageMetadata) => {
    // Update persistent state
    setUploadParams(prev => ({
      ...prev,
      [tool]: params
    }));
    
    console.log('Starting file upload with tool:', tool, 'Original metadata:', originalMetadata);
    setLoading(true);
    try {
      // Process the image
      let response;
      switch (tool) {
        case 'vectorize':
          response = await vectorizeImage(params);
          break;
        case 'removeBackground':
          response = await removeBackground(params);
          break;
        case 'clarityUpscale':
          response = await clarityUpscale(params);
          break;
        case 'generativeUpscale':
          response = await generativeUpscale(params);
          break;
        default:
          throw new Error('Invalid tool selected');
      }
      console.log('Processing response:', response);

      const toolNames: Record<ToolType, string> = {
        generate: 'Generated',
        vectorize: 'Vectorized',
        removeBackground: 'Background Removed',
        clarityUpscale: 'Clarity Enhanced',
        generativeUpscale: 'Generatively Enhanced',
        createStyle: 'Style Reference'
      };

      // Prepare metadata and title
      const baseMetadata: ImageMetadata = {
        tool,
        ...(originalMetadata && {
          prompt: originalMetadata.prompt,
          style: originalMetadata.style,
          style_id: originalMetadata.style_id,
          substyle: originalMetadata.substyle,
          model: originalMetadata.model,
          size: originalMetadata.size,
          controls: originalMetadata.controls
        }),
        ...(processingImageId && { originalImageId: processingImageId })
      };

      const title = originalMetadata?.prompt 
        ? `[${toolNames[tool]}] ${originalMetadata.prompt}`
        : `[${toolNames[tool]}]`;

      console.log('Final metadata and title:', { baseMetadata, title, originalMetadata });
      
      // Get the URL from the response based on the response format
      const imageUrl = response.image ? response.image.url : response.data[0].url;
      const savedImage = await imageStorage.saveImage(imageUrl, baseMetadata, title);
      console.log('Processed image saved:', savedImage);
      
      toast({
        title: 'Image processed successfully',
        description: 'Your image has been added to the gallery.',
      });
    } catch (error: any) {
      console.error('Processing error:', error);
      toast({
        title: 'Error processing image',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setProcessingImageId(null);
    }
  };

  const handleCreateStyle = async (params: CreateStyleParams) => {
    // Update persistent state
    setCreateStyleParams(params);
    
    console.log('Creating style with params:', params);
    setLoading(true);
    try {
      const response = await createStyle(params);
      console.log('Style creation response:', response);

      // Prompt for style name
      const styleName = window.prompt('Enter a name for your custom style:');
      if (styleName) {
        // Save to IndexedDB
        await styleStorage.saveStyle(response.id, styleName, params.style);
      }

      toast({
        title: 'Style created successfully',
        description: `Style saved as: ${styleName}`,
      });
    } catch (error: any) {
      console.error('Style creation error:', error);
      toast({
        title: 'Error creating style',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageAction = useCallback(async (imageId: string, tool: ToolType) => {
    console.log('Starting image action:', { imageId, tool });
    
    try {
      const image = await imageStorage.getImage(imageId);
      console.log('Found image for action:', image);
      if (!image) {
        throw new Error('Image not found');
      }

      // Validate tool compatibility
      if (tool === 'clarityUpscale' && image.metadata.tool === 'vectorize') {
        setErrorDialog({
          open: true,
          message: 'Cannot upscale a vectorized image. Please use the original image instead.'
        });
        return;
      }

      // Set processing state
      setProcessingImageId(imageId);
      setLoading(true);

      // Download the image and convert it to a File object
      const response = await fetch(image.url);
      const blob = await response.blob();
      const file = new File([blob], 'image.png', { type: 'image/png' });
      
      // Process the image with the selected tool and pass original metadata
      let originalMetadata = image.metadata;
      if (image.metadata.originalImageId) {
        const originalImage = await imageStorage.getImage(image.metadata.originalImageId);
        if (originalImage?.metadata) {
          originalMetadata = originalImage.metadata;
        }
      }

      await handleFileUpload({ file }, tool, {
        ...originalMetadata,
        style: originalMetadata.style as StyleType | undefined
      });
    } catch (error: any) {
      console.error('Image action error:', error);
      setErrorDialog({
        open: true,
        message: error.message
      });
      // Clean up states on error
      setProcessingImageId(null);
      setLoading(false);
    }
  }, [toast]);

  const handleUseAsInput = (params: Partial<RecraftGenerateParams>) => {
    setGenerateParams(prev => ({
      ...prev,
      ...params
    }));
    setActiveTool('generate');
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="recraft-theme">
      <Debug />
      <Layout>
        <div className="flex flex-col h-screen overflow-hidden bg-background">
          <Topbar activeTool={activeTool} onToolChange={setActiveTool} />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar 
              activeTool={activeTool}
              onGenerate={handleGenerate}
              onUpload={handleFileUpload}
              onCreateStyle={handleCreateStyle}
              loading={loading} 
              generateParams={generateParams}
              onGenerateParamsChange={setGenerateParams}
              uploadParams={uploadParams}
              createStyleParams={createStyleParams}
              onCreateStyleParamsChange={setCreateStyleParams}
            />
            <ImageGallery
              loading={loading}
              onImageAction={handleImageAction}
              processingImageId={processingImageId}
              onUseAsInput={handleUseAsInput}
            />
          </div>
        </div>
      </Layout>
      <Toaster />
      <AlertDialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog({ ...errorDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorDialog.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ThemeProvider>
  );
}

export default App;