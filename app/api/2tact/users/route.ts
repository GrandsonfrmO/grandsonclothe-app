import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { requireAdmin, isNextResponse } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est admin
    const adminCheck = await requireAdmin(request);
    if (isNextResponse(adminCheck)) {
      return adminCheck;
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    // Get all users
    const allUsers = await db.select().from(users);

    // Filter in memory
    let filteredUsers = allUsers;
    
    if (status) {
      filteredUsers = filteredUsers.filter(u => u.status === status);
    }

    if (role) {
      filteredUsers = filteredUsers.filter(u => u.role === role);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (u) =>
          u.email.toLowerCase().includes(searchLower) ||
          u.name.toLowerCase().includes(searchLower)
      );
    }

    // Retirer les mots de passe
    const safeUsers = filteredUsers.map((u) => ({
      ...u,
      password: undefined,
    }));

    return NextResponse.json(safeUsers);
  } catch (error) {
    logger.error('Erreur lors de la récupération des utilisateurs', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}
