import { FileImage, Eraser, ArrowUpCircle, Layers } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ToolType } from '@/types/recraft';

interface ImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  title?: string;
  onActionClick: (tool: ToolType) => void;
}

export function ImageModal({ open, onOpenChange, imageUrl, title, onActionClick }: ImageModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 bg-background/95 backdrop-blur-sm">
        <div className="space-y-4 p-6">
          <div className="relative h-[70vh] flex items-center justify-center">
            <img
              src={imageUrl}
              alt={title || "Image"}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          </div>

          {title && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{title}</p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="secondary"
              className="bg-white/10 hover:bg-white/20"
              onClick={() => onActionClick('vectorize')}
            >
              <FileImage className="mr-2 h-4 w-4" />
              Vectorize
            </Button>
            <Button
              variant="secondary"
              className="bg-white/10 hover:bg-white/20"
              onClick={() => onActionClick('removeBackground')}
            >
              <Eraser className="mr-2 h-4 w-4" />
              Remove Background
            </Button>
            <Button
              variant="secondary"
              className="bg-white/10 hover:bg-white/20"
              onClick={() => onActionClick('clarityUpscale')}
            >
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Upscale
            </Button>
            <Button
              variant="secondary"
              className="bg-white/10 hover:bg-white/20"
              onClick={() => onActionClick('generativeUpscale')}
            >
              <Layers className="mr-2 h-4 w-4" />
              Gen. Upscale
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 