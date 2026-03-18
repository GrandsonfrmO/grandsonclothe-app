import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

export async function POST() {
  try {
    // Get credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@grandsonclothes.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Validate credentials are set
    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { message: 'Admin credentials not configured in environment variables' },
        { status: 500 }
      );
    }

    // Check if admin already exists
    const existingAdmin: any = await db.select().from(users).where(eq(users.email, adminEmail));

    if (existingAdmin.length > 0) {
      // Update role to admin if not already
      if (existingAdmin[0].role !== 'admin') {
        await db.update(users)
          .set({ role: 'admin' })
          .where(eq(users.email, adminEmail));
        
        return NextResponse.json({
          message: 'User updated to admin',
          email: adminEmail,
        });
      }
      
      return NextResponse.json({
        message: 'Admin already exists',
        email: adminEmail,
      });
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const newAdmin: any = await db.insert(users).values({
      email: adminEmail,
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    }).returning();

    return NextResponse.json({
      message: 'Admin created successfully',
      email: adminEmail,
      user: {
        id: newAdmin[0].id,
        email: newAdmin[0].email,
        name: newAdmin[0].name,
        role: newAdmin[0].role,
      },
    });
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to create admin' },
      { status: 500 }
    );
  }
}
