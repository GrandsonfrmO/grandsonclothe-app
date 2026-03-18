import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('Starting migration: adding admin_notes column to orders table');

    // Add admin_notes column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS admin_notes TEXT
    `);

    logger.info('✓ Migration completed: admin_notes column added to orders table');
    
    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully'
    });
  } catch (error) {
    logger.error('Migration error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
