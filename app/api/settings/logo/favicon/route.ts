import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';

// POST - Générer un favicon à partir d'une image
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult || authResult.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Pour l'instant, retourner l'URL de l'image originale
    // Dans une vraie implémentation, on utiliserait sharp ou canvas pour redimensionner
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ 
      success: true,
      faviconUrl: dataUrl
    });
  } catch (error) {
    console.error('Error generating favicon:', error);
    return NextResponse.json({ error: 'Failed to generate favicon' }, { status: 500 });
  }
}
