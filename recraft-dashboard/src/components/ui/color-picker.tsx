import { HexColorPicker } from "react-colorful";
import { Label } from "@/components/ui/label";
import type { RGB } from "@/types/recraft";

interface ColorPickerProps {
  label?: string;
  value?: RGB;
  onChange: (color: RGB) => void;
  className?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

export function ColorPicker({ label, value, onChange, className }: ColorPickerProps) {
  const handleChange = (hex: string) => {
    onChange({ rgb: hexToRgb(hex) });
  };

  return (
    <div className={className}>
      {label && <Label className="mb-2 block">{label}</Label>}
      <HexColorPicker
        color={value ? rgbToHex(value.rgb) : "#000000"}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
}