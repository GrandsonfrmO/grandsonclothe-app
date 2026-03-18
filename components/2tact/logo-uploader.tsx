"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Upload, Check, Loader2, ImageIcon, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface LogoSettings {
  logoUrl: string
  siteName: string
  tagline: string
}

export function LogoUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [settings, setSettings] = useState<LogoSettings>({
    logoUrl: "",
    siteName: "GRANDSON CLOTHES",
    tagline: "Style & Qualité",
  })
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  // Load current settings
  useEffect(() => {
    fetch("/api/settings/logo", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setSettings(data)
        setPreviewUrl(data.logoUrl || "")
      })
      .catch(console.error)
  }, [])

  const handleFileSelect = async (file: File) => {
    if (!file) return
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      setError("Format invalide. Utilisez PNG, JPEG, WEBP ou GIF.")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Fichier trop lourd. Maximum 2MB.")
      return
    }
    setError(null)

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)

    // Upload to server
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Échec de l'upload")
      const { url } = await res.json()
      setSettings((prev) => ({ ...prev, logoUrl: url }))
      setPreviewUrl(url)
    } catch (err) {
      setError("Erreur lors de l'upload de l'image.")
      setPreviewUrl(settings.logoUrl)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/settings/logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur de sauvegarde")
      }
      setSaved(true)
      // Notify all SiteLogo instances to refresh
      window.dispatchEvent(new Event("logo-updated"))
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveLogo = () => {
    setPreviewUrl("")
    setSettings((prev) => ({ ...prev, logoUrl: "" }))
  }

  return (
    <div className="space-y-10">
      {/* Logo Upload Zone */}
      <div className="space-y-4">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
          Emblème Officiel du Site
        </p>

        <div
          className={cn(
            "relative flex flex-col sm:flex-row items-center gap-8 p-8 rounded-[2rem] border-2 border-dashed transition-all duration-300 cursor-pointer",
            dragOver
              ? "border-accent bg-accent/10 scale-[1.01]"
              : "border-border/40 bg-secondary/10 hover:border-accent/50 hover:bg-secondary/20"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />

          {/* Preview */}
          <div className="relative w-32 h-32 shrink-0 rounded-[1.5rem] bg-background/60 border border-border/40 shadow-xl overflow-hidden flex items-center justify-center">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            ) : previewUrl ? (
              <Image src={previewUrl} alt="Logo" fill className="object-contain p-2" unoptimized />
            ) : (
              <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
            )}
            {/* Overlay on hover */}
            {!uploading && (
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-[1.5rem]">
                <Upload className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1">
            <h4 className="text-xl font-black italic">
              {previewUrl ? "Logo actuel" : "Aucun logo"}
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Glissez-déposez votre image ici ou cliquez pour parcourir.
              <br />
              <span className="text-accent font-bold">PNG, WEBP, GIF</span> — Max 2MB — Recommandé 512×512
            </p>
            <div className="flex flex-wrap gap-3" onClick={(e) => e.stopPropagation()}>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest px-5"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Upload...</>
                ) : (
                  <><Upload className="w-4 h-4 mr-2" /> Choisir un fichier</>
                )}
              </Button>
              {previewUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest px-5 border-destructive/30 text-destructive hover:bg-destructive hover:text-white"
                  onClick={handleRemoveLogo}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Site Name & Tagline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
            Nom du Site
          </label>
          <Input
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            placeholder="GRANDSON CLOTHES"
            className="h-14 bg-secondary/30 border-none rounded-2xl text-lg font-black italic tracking-tight focus-visible:ring-accent shadow-inner"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
            Slogan / Tagline
          </label>
          <Input
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            placeholder="Style & Qualité"
            className="h-14 bg-secondary/30 border-none rounded-2xl text-lg font-black italic tracking-tight focus-visible:ring-accent shadow-inner"
          />
        </div>
      </div>

      {/* Live Preview */}
      <div className="p-6 bg-secondary/10 rounded-[2rem] border border-border/20 space-y-3">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
          Aperçu en Temps Réel
        </p>
        <div className="flex items-center gap-4 p-4 bg-background/60 rounded-2xl border border-border/20 w-fit">
          <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/20 overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              <Image src={previewUrl} alt="Preview" width={48} height={48} className="object-contain p-1" unoptimized />
            ) : (
              <span className="text-accent font-black text-xl italic">
                {settings.siteName.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-black text-base tracking-tighter">{settings.siteName || "Nom du site"}</p>
            <p className="text-xs text-muted-foreground">{settings.tagline || "Tagline"}</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm font-bold">
          {error}
        </div>
      )}

      {/* Save Button */}
      <div className="pt-4 border-t border-border/30">
        <Button
          onClick={handleSave}
          disabled={saving || uploading}
          className={cn(
            "h-16 w-full sm:w-80 rounded-2xl text-xl font-black italic tracking-tighter gap-4 shadow-2xl transition-all",
            saved
              ? "bg-emerald-500 hover:bg-emerald-500 shadow-emerald-500/20"
              : "bg-accent hover:bg-accent/90 shadow-accent/20"
          )}
        >
          {saving ? (
            <><Loader2 className="w-6 h-6 animate-spin" /> SAUVEGARDE...</>
          ) : saved ? (
            <><Check className="w-6 h-6" /> LOGO MIS À JOUR !</>
          ) : (
            <><RefreshCw className="w-6 h-6" /> APPLIQUER LE LOGO</>
          )}
        </Button>
      </div>
    </div>
  )
}
