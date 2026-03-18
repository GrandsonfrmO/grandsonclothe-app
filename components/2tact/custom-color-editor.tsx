"use client"

import { useState } from "react"
import { Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CustomColorEditorProps {
  onApply: (color: string) => void
}

export function CustomColorEditor({ onApply }: CustomColorEditorProps) {
  const [hue, setHue] = useState(145)
  const [lightness, setLightness] = useState(0.65)
  const [chroma, setChroma] = useState(0.2)

  const customColor = `oklch(${lightness.toFixed(2)} ${chroma.toFixed(2)} ${hue})`

  return (
    <div className="p-4 bg-secondary rounded-xl space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Sliders className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-medium">Créer une couleur personnalisée</h3>
      </div>

      {/* Aperçu */}
      <div className="flex items-center gap-3">
        <div 
          className="w-16 h-16 rounded-lg border-2 border-border shadow-lg"
          style={{ background: customColor }}
        />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-mono">{customColor}</p>
        </div>
      </div>

      {/* Teinte (Hue) */}
      <div>
        <label className="text-xs text-muted-foreground mb-2 block">
          Teinte: {hue}°
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={(e) => setHue(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              oklch(0.65 0.2 0),
              oklch(0.65 0.2 60),
              oklch(0.65 0.2 120),
              oklch(0.65 0.2 180),
              oklch(0.65 0.2 240),
              oklch(0.65 0.2 300),
              oklch(0.65 0.2 360)
            )`
          }}
        />
      </div>

      {/* Luminosité (Lightness) */}
      <div>
        <label className="text-xs text-muted-foreground mb-2 block">
          Luminosité: {(lightness * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="0.3"
          max="0.9"
          step="0.01"
          value={lightness}
          onChange={(e) => setLightness(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-black via-gray-500 to-white"
        />
      </div>

      {/* Saturation (Chroma) */}
      <div>
        <label className="text-xs text-muted-foreground mb-2 block">
          Saturation: {(chroma * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="0"
          max="0.3"
          step="0.01"
          value={chroma}
          onChange={(e) => setChroma(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              oklch(${lightness} 0 ${hue}),
              oklch(${lightness} 0.3 ${hue})
            )`
          }}
        />
      </div>

      <Button 
        onClick={() => onApply(customColor)}
        className="w-full"
        size="sm"
      >
        Appliquer cette couleur
      </Button>
    </div>
  )
}
