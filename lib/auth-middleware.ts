import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';
import { createError } from './errors';
import { logger } from './logger';

export async function verifyAuth(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return null;
    }

    // Vérifier le JWT avec signature
    const decoded = verifyToken(token);
    
    if (!decoded) {
      logger.warn('Token JWT invalide ou expiré');
      return null;
    }

    return decoded;
  } catch (error) {
    logger.error('Erreur lors de la vérification du token', error);
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<JWTPayload | NextResponse> {
  const user = await verifyAuth(request);
  
  if (!user) {
    const error = createError('UNAUTHORIZED');
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  return user;
}

export async function requireAdmin(request: NextRequest): Promise<JWTPayload | NextResponse> {
  const user = await verifyAuth(request);
  
  if (!user) {
    const error = createError('UNAUTHORIZED');
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  if (user.role !== 'admin') {
    const error = createError('FORBIDDEN', 'Accès administrateur requis');
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  return user;
}

export function isNextResponse(value: any): value is NextResponse {
  return value instanceof NextResponse;
}
