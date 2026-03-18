"use client"

import { FileImage, TrendingDown, Zap } from "lucide-react"
import { formatFileSize } from "@/lib/image-optimizer"

interface CompressionStatsProps {
  originalSize: number
  optimizedSize: number
  compressionRatio: number
  dimensions: { width: number; height: number }
}

export function CompressionStats({
  originalSize,
  optimizedSize,
  compressionRatio,
  dimensions
}: CompressionStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
      <div className="flex flex-col items-center text-center">
        <FileImage className="w-5 h-5 text-green-500 mb-2" />
        <p className="text-xs text-muted-foreground mb-1">Dimensions</p>
        <p className="text-sm font-medium">
          {dimensions.width} × {dimensions.height}
        </p>
      </div>

      <div className="flex flex-col items-center text-center">
        <TrendingDown className="w-5 h-5 text-green-500 mb-2" />
        <p className="text-xs text-muted-foreground mb-1">Réduction</p>
        <p className="text-sm font-medium text-green-500">
          -{compressionRatio}%
        </p>
      </div>

      <div className="flex flex-col items-center text-center">
        <Zap className="w-5 h-5 text-green-500 mb-2" />
        <p className="text-xs text-muted-foreground mb-1">Taille</p>
        <div className="text-sm">
          <span className="line-through text-muted-foreground text-xs">
            {formatFileSize(originalSize)}
          </span>
          <span className="ml-2 font-medium text-green-500">
            {formatFileSize(optimizedSize)}
          </span>
        </div>
      </div>
    </div>
  )
}
