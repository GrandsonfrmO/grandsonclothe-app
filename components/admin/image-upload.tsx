'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { GifImage } from '@/components/gif-image';

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  onImageSelect?: (url: string) => void;
  error?: string;
}

export function ImageUpload({ value = '', onChange, onImageSelect, error }: ImageUploadProps) {
  // Support both prop naming conventions
  const handleChange = onChange || onImageSelect || (() => {});
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image est trop grande (max 5MB)');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      handleChange(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      {value && (
        <div className="relative w-full h-48 bg-secondary rounded-lg overflow-hidden border-2 border-border">
          <GifImage
            src={value}
            alt="Aperçu"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => handleChange('')}
            className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer
          ${isDragging 
            ? 'border-accent bg-accent/5 scale-[1.02]' 
            : error 
            ? 'border-red-500 bg-red-50/50' 
            : 'border-border hover:border-accent/50 hover:bg-accent/5'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center gap-3 text-center">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center transition-colors
            ${isDragging ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'}
          `}>
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          
          <div>
            <p className="font-medium mb-1">
              {isUploading 
                ? 'Upload en cours...' 
                : isDragging 
                ? 'Déposez l\'image ici' 
                : 'Glissez-déposez une image ou cliquez'
              }
            </p>
            <p className="text-sm text-muted-foreground">
              {isUploading ? 'Veuillez patienter' : 'JPG, PNG, GIF, WEBP (max 5MB)'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full" />
          {error}
        </p>
      )}
    </div>
  );
}
