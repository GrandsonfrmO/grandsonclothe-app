'use client';

import { useState, useEffect } from 'react';
import { Palette, Save, RotateCcw, Loader2, Palette as PaletteIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { CustomColorEditor } from '@/components/2tact/custom-color-editor';
import { ColorPalette } from '@/components/2tact/color-palette';
import { useTheme } from '@/lib/theme-context';

interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  foreground: string;
}

const PRESET_THEMES: Record<string, ThemeColors> = {
  default: {
    primary: 'oklch(0.65 0.2 145)',
    accent: 'oklch(0.65 0.2 145)',
    background: 'oklch(0.08 0 0)',
    foreground: 'oklch(0.98 0 0)',
  },
  ocean: {
    primary: 'oklch(0.65 0.2 250)',
    accent: 'oklch(0.65 0.2 250)',
    background: 'oklch(0.08 0 0)',
    foreground: 'oklch(0.98 0 0)',
  },
  sunset: {
    primary: 'oklch(0.65 0.2 30)',
    accent: 'oklch(0.65 0.2 30)',
    background: 'oklch(0.08 0 0)',
    foreground: 'oklch(0.98 0 0)',
  },
  forest: {
    primary: 'oklch(0.65 0.2 120)',
    accent: 'oklch(0.65 0.2 120)',
    background: 'oklch(0.08 0 0)',
    foreground: 'oklch(0.98 0 0)',
  },
  purple: {
    primary: 'oklch(0.65 0.2 280)',
    accent: 'oklch(0.65 0.2 280)',
    background: 'oklch(0.08 0 0)',
    foreground: 'oklch(0.98 0 0)',
  },
};

export function ThemeManager() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-muted-foreground">Chargement du thème...</p>
        </div>
      </div>
    );
  }

  return <ThemeManagerContent />;
}

function ThemeManagerContent() {
  const { colors: currentColors, updateTheme, isLoading: themeLoading } = useTheme();
  const [colors, setColors] = useState<ThemeColors>(currentColors);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setColors(currentColors);
  }, [currentColors]);

  useEffect(() => {
    setHasChanges(JSON.stringify(colors) !== JSON.stringify(currentColors));
  }, [colors, currentColors]);

  if (themeLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-muted-foreground">Chargement du thème...</p>
        </div>
      </div>
    );
  }

  const handleSaveTheme = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(colors),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      updateTheme(colors);
      toast.success('Thème sauvegardé avec succès!');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('Erreur lors de la sauvegarde du thème');
    } finally {
      setLoading(false);
    }
  };

  const handleResetTheme = () => {
    setColors(currentColors);
    setHasChanges(false);
  };

  const handleApplyPreset = (preset: ThemeColors) => {
    setColors(preset);
  };

  const handleCustomColor = (color: string) => {
    setColors({ ...colors, accent: color });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Palette className="w-5 h-5 text-accent" />
        <div>
          <h3 className="text-lg font-semibold">Couleurs du site</h3>
          <p className="text-sm text-muted-foreground">
            Personnalisez l'apparence de votre boutique
          </p>
        </div>
      </div>

      {/* Aperçu en temps réel */}
      <Card className="p-6 bg-gradient-to-br from-card to-card/50">
        <h4 className="text-sm font-medium mb-4">Aperçu en temps réel</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Primaire</p>
            <div
              className="w-full h-20 rounded-lg border-2 border-border"
              style={{ backgroundColor: colors.primary }}
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Accent</p>
            <div
              className="w-full h-20 rounded-lg border-2 border-border"
              style={{ backgroundColor: colors.accent }}
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Fond</p>
            <div
              className="w-full h-20 rounded-lg border-2 border-border"
              style={{ backgroundColor: colors.background }}
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Texte</p>
            <div
              className="w-full h-20 rounded-lg border-2 border-border"
              style={{ backgroundColor: colors.foreground }}
            />
          </div>
        </div>
      </Card>

      {/* Thèmes prédéfinis */}
      <Card className="p-6">
        <h4 className="text-sm font-medium mb-4">Thèmes prédéfinis</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(PRESET_THEMES).map(([name, theme]) => (
            <button
              key={name}
              onClick={() => handleApplyPreset(theme)}
              className={`p-3 rounded-lg border-2 transition-all ${
                JSON.stringify(colors.accent) === JSON.stringify(theme.accent)
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              <div className="flex gap-1 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                />
              </div>
              <p className="text-xs font-medium capitalize">{name}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Éditeur de couleur personnalisée */}
      <CustomColorEditor onApply={handleCustomColor} />

      {/* Palette de couleurs */}
      <Card className="p-6">
        <ColorPalette />
      </Card>

      {/* Codes couleur */}
      <Card className="p-6 bg-secondary/30">
        <h4 className="text-sm font-medium mb-4">Codes couleur (OKLch)</h4>
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center p-2 bg-background rounded border border-border">
            <span className="text-muted-foreground">Primaire:</span>
            <span className="text-foreground">{colors.primary}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-background rounded border border-border">
            <span className="text-muted-foreground">Accent:</span>
            <span className="text-foreground">{colors.accent}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-background rounded border border-border">
            <span className="text-muted-foreground">Fond:</span>
            <span className="text-foreground">{colors.background}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-background rounded border border-border">
            <span className="text-muted-foreground">Texte:</span>
            <span className="text-foreground">{colors.foreground}</span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleSaveTheme}
          disabled={!hasChanges || loading}
          className="gap-2 flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Sauvegarder les modifications
            </>
          )}
        </Button>
        <Button
          onClick={handleResetTheme}
          disabled={!hasChanges}
          variant="outline"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </Button>
      </div>

      {hasChanges && (
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-sm text-accent">
          Vous avez des modifications non sauvegardées
        </div>
      )}
    </div>
  );
}
