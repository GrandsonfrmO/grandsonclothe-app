'use client';

import { Check } from 'lucide-react';

interface ColorPickerProps {
  selectedColors?: string[];
  onColorsChange?: (colors: string[]) => void;
  selected?: string[];
  onChange?: (colors: string[]) => void;
}

export const COLORS = [
  { name: 'Noir', value: 'black', hex: '#000000' },
  { name: 'Blanc', value: 'white', hex: '#FFFFFF' },
  { name: 'Gris', value: 'gray', hex: '#6B7280' },
  { name: 'Rouge', value: 'red', hex: '#EF4444' },
  { name: 'Bleu', value: 'blue', hex: '#3B82F6' },
  { name: 'Vert', value: 'green', hex: '#10B981' },
  { name: 'Jaune', value: 'yellow', hex: '#F59E0B' },
  { name: 'Rose', value: 'pink', hex: '#EC4899' },
  { name: 'Violet', value: 'purple', hex: '#8B5CF6' },
  { name: 'Orange', value: 'orange', hex: '#F97316' },
  { name: 'Marron', value: 'brown', hex: '#92400E' },
  { name: 'Beige', value: 'beige', hex: '#D4A574' },
];

export function ColorPicker({ selectedColors, onColorsChange, selected, onChange }: ColorPickerProps) {
  // Support both prop naming conventions
  const colors = selectedColors ?? selected ?? [];
  const handleChange = onColorsChange ?? onChange ?? (() => {});

  const toggleColor = (value: string) => {
    if (colors.includes(value)) {
      handleChange(colors.filter(c => c !== value));
    } else {
      handleChange([...colors, value]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {COLORS.map((color) => {
          const isSelected = colors.includes(color.value);
          return (
            <button
              key={color.value}
              type="button"
              onClick={() => toggleColor(color.value)}
              className={`
                relative group flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all
                ${isSelected 
                  ? 'border-accent bg-accent/5 scale-105' 
                  : 'border-border hover:border-accent/50 hover:bg-accent/5'
                }
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform
                  ${color.value === 'white' ? 'border-gray-300' : 'border-transparent'}
                  ${isSelected ? 'scale-110' : 'group-hover:scale-105'}
                `}
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <Check 
                    className={`w-4 h-4 ${color.value === 'white' || color.value === 'yellow' || color.value === 'beige' ? 'text-gray-800' : 'text-white'}`} 
                  />
                )}
              </div>
              <span className="text-xs font-medium truncate w-full text-center">
                {color.name}
              </span>
            </button>
          );
        })}
      </div>

      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-secondary/50 rounded-lg">
          <span className="text-sm text-muted-foreground">Sélectionnées:</span>
          {colors.map((value) => {
            const color = COLORS.find(c => c.value === value);
            return color ? (
              <span
                key={value}
                className="inline-flex items-center gap-1.5 px-2 py-1 bg-background rounded-md text-sm border"
              >
                <span
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: color.hex }}
                />
                {color.name}
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
