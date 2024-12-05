import { useState, useEffect } from 'react';
import { Wand2, Plus, Minus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ColorPicker } from '@/components/ui/color-picker';
import { STYLES, IMAGE_SIZES, RECRAFT_V3_SUBSTYLES, RECRAFT_20B_SUBSTYLES } from '@/lib/constants';
import { styleStorage, type StoredStyle } from '@/lib/style-storage';
import type { RecraftGenerateParams, StyleType, RecraftModel, RGB } from '@/types/recraft';

interface GenerateSidebarProps {
  onGenerate: (params: RecraftGenerateParams) => Promise<void>;
  loading: boolean;
  params: RecraftGenerateParams;
  onParamsChange: (params: RecraftGenerateParams) => void;
}

export function GenerateSidebar({ onGenerate, loading, params, onParamsChange }: GenerateSidebarProps) {
  const [customStyles, setCustomStyles] = useState<StoredStyle[]>([]);
  const [showColors, setShowColors] = useState(false);

  useEffect(() => {
    // Load custom styles from IndexedDB
    const loadStyles = async () => {
      try {
        const styles = await styleStorage.getAllStyles();
        setCustomStyles(styles);
      } catch (error) {
        console.error('Error loading styles:', error);
      }
    };
    loadStyles();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(params);
  };

  const getSubstyles = (style: StyleType, model: RecraftModel) => {
    if (model === 'recraftv3') {
      return RECRAFT_V3_SUBSTYLES[style] || [];
    }
    return RECRAFT_20B_SUBSTYLES[style] || [];
  };

  const addColor = () => {
    onParamsChange({
      ...params,
      controls: {
        ...params.controls,
        colors: [...(params.controls?.colors || []), { rgb: [0, 0, 0] }],
      },
    });
  };

  const removeColor = (index: number) => {
    onParamsChange({
      ...params,
      controls: {
        ...params.controls,
        colors: params.controls?.colors?.filter((_, i) => i !== index) || [],
      },
    });
  };

  const updateColor = (index: number, color: RGB) => {
    onParamsChange({
      ...params,
      controls: {
        ...params.controls,
        colors: params.controls?.colors?.map((c, i) => i === index ? color : c) || [],
      },
    });
  };

  const updateBackgroundColor = (color: RGB) => {
    onParamsChange({
      ...params,
      controls: {
        ...params.controls,
        background_color: color,
      },
    });
  };

  const handleColorToggle = (enabled: boolean) => {
    setShowColors(enabled);
    if (!enabled) {
      // Clear color settings when disabling
      onParamsChange({
        ...params,
        controls: {
          ...params.controls,
          colors: [],
          background_color: undefined
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex flex-col items-center text-center space-y-2">
            <Wand2 className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Generate Image</h2>
            <p className="text-sm text-muted-foreground">Create an image using AI</p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !params.prompt}
          >
            {loading ? (
              <span className="flex items-center">
                Generating...
              </span>
            ) : (
              <span className="flex items-center">
                <Wand2 className="mr-2 h-4 w-4" />
                Generate
              </span>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            placeholder="Describe your image..."
            value={params.prompt}
            onChange={(e) => onParamsChange({ ...params, prompt: e.target.value })}
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Style</Label>
          <div className="space-y-2">
            <Select
              value={params.style_id || params.style}
              onValueChange={(value) => {
                if (customStyles.some(style => style.id === value)) {
                  onParamsChange({ 
                    ...params, 
                    style_id: value,
                    style: undefined
                  });
                } else {
                  onParamsChange({ 
                    ...params, 
                    style: value as StyleType,
                    style_id: undefined
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="header" disabled>Predefined Styles</SelectItem>
                {STYLES.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style.replace('_', ' ')}
                  </SelectItem>
                ))}
                
                {customStyles.length > 0 && (
                  <>
                    <SelectItem value="custom_header" disabled>Custom Styles</SelectItem>
                    {customStyles.map((style) => (
                      <SelectItem key={style.id} value={style.id}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {params.style && !params.style_id && (
          <div className="space-y-2">
            <Label htmlFor="substyle">Substyle</Label>
            <Select
              value={params.substyle || ''}
              onValueChange={(value) => onParamsChange({ ...params, substyle: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select substyle" />
              </SelectTrigger>
              <SelectContent>
                {getSubstyles(params.style, params.model).map((substyle) => (
                  <SelectItem key={substyle} value={substyle}>
                    {substyle.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select
            value={params.model}
            onValueChange={(value: RecraftModel) => onParamsChange({ ...params, model: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recraftv3">Recraft V3</SelectItem>
              <SelectItem value="recraft20b">Recraft 20B</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Select
            value={params.size}
            onValueChange={(value) => onParamsChange({ ...params, size: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {IMAGE_SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="color-toggle" className="text-base">Color Controls</Label>
            <Switch
              id="color-toggle"
              checked={showColors}
              onCheckedChange={handleColorToggle}
            />
          </div>

          {showColors && (
            <div className="space-y-4 mt-4 animate-in slide-in-from-top-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Color Palette</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addColor}
                    disabled={params.controls?.colors?.length >= 5}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {params.controls?.colors?.map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <ColorPicker
                        value={color}
                        onChange={(newColor) => updateColor(index, newColor)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeColor(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Background Color</Label>
                <ColorPicker
                  value={params.controls?.background_color}
                  onChange={updateBackgroundColor}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}