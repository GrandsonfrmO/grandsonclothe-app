'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface ColorPaletteItem {
  name: string;
  hex: string;
  oklch: string;
  category: string;
}

const COLOR_PALETTES: ColorPaletteItem[] = [
  // Primaires
  { name: 'Teal', hex: '#20B2AA', oklch: 'oklch(0.65 0.2 145)', category: 'Primaire' },
  { name: 'Ocean Blue', hex: '#0077BE', oklch: 'oklch(0.65 0.2 250)', category: 'Primaire' },
  { name: 'Sunset Orange', hex: '#FF6B35', oklch: 'oklch(0.65 0.2 30)', category: 'Primaire' },
  { name: 'Forest Green', hex: '#2D6A4F', oklch: 'oklch(0.65 0.2 120)', category: 'Primaire' },
  { name: 'Purple', hex: '#7209B7', oklch: 'oklch(0.65 0.2 280)', category: 'Primaire' },

  // Neutres
  { name: 'Noir', hex: '#000000', oklch: 'oklch(0.08 0 0)', category: 'Neutre' },
  { name: 'Gris Foncé', hex: '#2D3436', oklch: 'oklch(0.18 0 0)', category: 'Neutre' },
  { name: 'Gris Moyen', hex: '#636E72', oklch: 'oklch(0.45 0 0)', category: 'Neutre' },
  { name: 'Gris Clair', hex: '#B2BEC3', oklch: 'oklch(0.75 0 0)', category: 'Neutre' },
  { name: 'Blanc', hex: '#FFFFFF', oklch: 'oklch(0.98 0 0)', category: 'Neutre' },

  // Accents
  { name: 'Rouge Vif', hex: '#E63946', oklch: 'oklch(0.577 0.245 27.325)', category: 'Accent' },
  { name: 'Vert Succès', hex: '#06A77D', oklch: 'oklch(0.65 0.2 150)', category: 'Accent' },
  { name: 'Jaune Alerte', hex: '#FFB703', oklch: 'oklch(0.75 0.2 80)', category: 'Accent' },
  { name: 'Bleu Info', hex: '#0096FF', oklch: 'oklch(0.65 0.2 260)', category: 'Accent' },
  { name: 'Rose', hex: '#EC4899', oklch: 'oklch(0.65 0.2 330)', category: 'Accent' },

  // Pastels
  { name: 'Pastel Bleu', hex: '#A8D8EA', oklch: 'oklch(0.8 0.1 250)', category: 'Pastel' },
  { name: 'Pastel Rose', hex: '#FFB3D9', oklch: 'oklch(0.8 0.1 330)', category: 'Pastel' },
  { name: 'Pastel Vert', hex: '#C1E1A6', oklch: 'oklch(0.8 0.1 120)', category: 'Pastel' },
  { name: 'Pastel Jaune', hex: '#FFE5B4', oklch: 'oklch(0.85 0.1 80)', category: 'Pastel' },
  { name: 'Pastel Lavande', hex: '#E6D5E8', oklch: 'oklch(0.8 0.05 280)', category: 'Pastel' },
];

export function ColorPalette() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Primaire');

  const categories = Array.from(new Set(COLOR_PALETTES.map(c => c.category)));
  const filteredColors = COLOR_PALETTES.filter(c => c.category === selectedCategory);

  const copyToClipboard = (text: string, format: 'hex' | 'oklch') => {
    navigator.clipboard.writeText(text);
    setCopiedColor(`${text}-${format}`);
    toast.success(`${format.toUpperCase()} copié!`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/60" />
        <div>
          <h3 className="text-lg font-semibold">Palette de couleurs</h3>
          <p className="text-sm text-muted-foreground">
            Sélectionnez et copiez les couleurs pour votre design
          </p>
        </div>
      </div>

      {/* Catégories */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category
                ? 'bg-accent text-accent-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grille de couleurs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {filteredColors.map(color => (
          <Card
            key={color.name}
            className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            {/* Aperçu couleur */}
            <div
              className="h-24 w-full transition-transform group-hover:scale-105"
              style={{ backgroundColor: color.hex }}
            />

            {/* Infos */}
            <div className="p-3 space-y-2">
              <p className="text-sm font-medium truncate">{color.name}</p>

              {/* Boutons copie */}
              <div className="flex gap-1">
                <button
                  onClick={() => copyToClipboard(color.hex, 'hex')}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded transition-colors"
                  title={color.hex}
                >
                  {copiedColor === `${color.hex}-hex` ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span className="truncate">{color.hex}</span>
                </button>
              </div>

              {/* OKLch */}
              <button
                onClick={() => copyToClipboard(color.oklch, 'oklch')}
                className="w-full flex items-center justify-center gap-1 px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded transition-colors"
                title={color.oklch}
              >
                {copiedColor === `${color.oklch}-oklch` ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span className="truncate font-mono text-xs">{color.oklch.split('(')[1]?.split(')')[0]}</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Info */}
      <Card className="p-4 bg-secondary/30">
        <p className="text-sm text-muted-foreground">
          💡 Cliquez sur une couleur pour copier son code HEX ou OKLch
        </p>
      </Card>
    </div>
  );
}
