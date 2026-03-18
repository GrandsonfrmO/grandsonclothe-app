'use client';

import { Check } from 'lucide-react';

interface SizeSelectorProps {
  selectedSizes?: string[];
  onSizesChange?: (sizes: string[]) => void;
  selected?: string[];
  onChange?: (sizes: string[]) => void;
}

const SIZES = [
  { value: 'XS', label: 'XS', description: 'Extra Small' },
  { value: 'S', label: 'S', description: 'Small' },
  { value: 'M', label: 'M', description: 'Medium' },
  { value: 'L', label: 'L', description: 'Large' },
  { value: 'XL', label: 'XL', description: 'Extra Large' },
  { value: 'XXL', label: 'XXL', description: '2X Large' },
  { value: 'XXXL', label: 'XXXL', description: '3X Large' },
];

export function SizeSelector({ selectedSizes, onSizesChange, selected, onChange }: SizeSelectorProps) {
  // Support both prop naming conventions
  const sizes = selectedSizes ?? selected ?? [];
  const handleChange = onSizesChange ?? onChange ?? (() => {});

  const toggleSize = (value: string) => {
    if (sizes.includes(value)) {
      handleChange(sizes.filter(s => s !== value));
    } else {
      handleChange([...sizes, value]);
    }
  };

  const selectAll = () => {
    handleChange(SIZES.map(s => s.value));
  };

  const clearAll = () => {
    handleChange([]);
  };

  return (
    <div className="space-y-3">
      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={selectAll}
          className="text-xs px-3 py-1 rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
        >
          Tout sélectionner
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs px-3 py-1 rounded-md bg-secondary text-muted-foreground hover:bg-secondary/80 transition-colors"
        >
          Tout effacer
        </button>
      </div>

      {/* Size Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {SIZES.map((size) => {
          const isSelected = sizes.includes(size.value);
          return (
            <button
              key={size.value}
              type="button"
              onClick={() => toggleSize(size.value)}
              className={`
                relative group flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                ${isSelected 
                  ? 'border-accent bg-accent text-accent-foreground scale-105' 
                  : 'border-border hover:border-accent/50 hover:bg-accent/5'
                }
              `}
              title={size.description}
            >
              <span className={`text-lg font-bold ${isSelected ? 'text-accent-foreground' : ''}`}>
                {size.label}
              </span>
              {isSelected && (
                <Check className="absolute top-1 right-1 w-3 h-3" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Display */}
      {sizes.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-secondary/50 rounded-lg">
          <span className="text-sm text-muted-foreground">Tailles disponibles:</span>
          {sizes.sort((a, b) => {
            const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
            return order.indexOf(a) - order.indexOf(b);
          }).map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent text-accent-foreground rounded-md text-sm font-medium"
            >
              {value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
