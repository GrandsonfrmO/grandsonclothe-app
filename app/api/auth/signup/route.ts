import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import { signupSchema } from '@/lib/validation';
import { createError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation avec Zod
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      const error = createError('VALIDATION_ERROR', validationResult.error.errors[0].message);
      return NextResponse.json(
        { error: error.message, code: error.code, details: validationResult.error.errors },
        { status: error.statusCode }
      );
    }

    const { email, name, password } = validationResult.data;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      const error = createError('USER_ALREADY_EXISTS');
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const result = await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
      role: 'buyer', // Rôle par défaut pour les nouveaux utilisateurs
    }).returning();

    const newUser = result[0];

    // Créer JWT signé
    const token = signToken({
      userId: newUser.id,
      role: newUser.role || 'buyer',
      email: newUser.email,
    });

    const response = NextResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role || 'buyer',
        },
      },
      { status: 201 }
    );

    // Cookie sécurisé avec JWT
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    });

    logger.info(`Nouvel utilisateur créé: ${email}`);

    return response;
  } catch (error) {
    logger.error('Erreur lors de l\'inscription', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}
