import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST() {
  try {
    const adminEmail = 'admin@grandsonclothes.com';
    
    // Update role to admin
    const result: any = await db
      .update(users)
      .set({ role: 'admin' })
      .where(eq(users.email, adminEmail))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { message: 'Admin account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Admin role updated successfully',
      admin: {
        id: result[0].id,
        email: result[0].email,
        name: result[0].name,
        role: result[0].role,
      },
    });
  } catch (error) {
    console.error('Fix admin role error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to fix admin role' },
      { status: 500 }
    );
  }
}
