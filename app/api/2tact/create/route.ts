import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { requireAdmin } from '@/lib/auth-middleware';

// POST - Create or update admin (protected route)
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json();
    const { email, password, name } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin with this email exists
    const existingUser: any = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    let result;

    if (existingUser.length > 0) {
      // Update existing user
      result = await db
        .update(users)
        .set({
          password: hashedPassword,
          name,
          role: 'admin',
        })
        .where(eq(users.email, email))
        .returning();

      return NextResponse.json({
        success: true,
        message: 'Admin account updated successfully',
        action: 'updated',
        admin: {
          id: result[0].id,
          email: result[0].email,
          name: result[0].name,
        },
      });
    } else {
      // Create new admin
      result = await db.insert(users).values({
        email,
        password: hashedPassword,
        name,
        role: 'admin',
      }).returning();

      return NextResponse.json({
        success: true,
        message: 'Admin account created successfully',
        action: 'created',
        admin: {
          id: result[0].id,
          email: result[0].email,
          name: result[0].name,
        },
      });
    }
  } catch (error) {
    console.error('Error creating/updating admin:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET - List all admins (protected route)
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const admins: any = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.role, 'admin'));

    return NextResponse.json({
      success: true,
      count: admins.length,
      admins: admins.map((admin: any) => ({
        id: admin.id,
        email: admin.email,
        name: admin.name,
        createdAt: admin.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
