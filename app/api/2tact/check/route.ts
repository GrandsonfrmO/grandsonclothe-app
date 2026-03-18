import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const adminEmail = 'admin@grandsonclothes.com';
    
    // Check if admin exists
    const result: any = await db.select().from(users).where(eq(users.email, adminEmail));
    const admin = result[0];

    if (!admin) {
      return NextResponse.json({
        exists: false,
        message: 'Admin account does not exist',
      });
    }

    return NextResponse.json({
      exists: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error('Check admin error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to check admin' },
      { status: 500 }
    );
  }
}
