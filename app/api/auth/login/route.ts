import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import { loginSchema } from '@/lib/validation';
import { createError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';
import { sendAdminLoginNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(request);
    const isDev = process.env.NODE_ENV !== 'production';
    const rateLimitResult = rateLimit(identifier, { 
      maxRequests: isDev ? 100 : 10, 
      windowMs: 15 * 60 * 1000 
    });
    
    if (!rateLimitResult.allowed) {
      const error = createError('RATE_LIMIT_EXCEEDED');
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    const body = await request.json();

    // Validation avec Zod
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      const error = createError('VALIDATION_ERROR', validationResult.error.errors[0].message);
      return NextResponse.json(
        { error: error.message, code: error.code, details: validationResult.error.errors },
        { status: error.statusCode }
      );
    }

    const { email, password } = validationResult.data;

    const result = await db.select().from(users).where(eq(users.email, email));
    const user = result[0];

    if (!user) {
      const error = createError('INVALID_CREDENTIALS');
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const error = createError('INVALID_CREDENTIALS');
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    // Créer JWT signé
    const token = signToken({
      userId: user.id,
      role: user.role || 'buyer',
      email: user.email,
    });

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'buyer',
        },
      },
      { status: 200 }
    );

    // Cookie sécurisé avec JWT - Session persistante (30 jours)
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 jours au lieu de 7
      path: '/',
    });

    logger.info(`Connexion réussie pour ${email}`);

    // Envoyer email de notification si c'est un admin
    if (user.role === 'admin') {
      try {
        await sendAdminLoginNotification(user.email, user.name, request);
      } catch (emailError) {
        logger.error('Erreur envoi email notification admin', emailError);
        // Ne pas bloquer la connexion si l'email échoue
      }
    }

    return response;
  } catch (error) {
    logger.error('Erreur lors de la connexion', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}
