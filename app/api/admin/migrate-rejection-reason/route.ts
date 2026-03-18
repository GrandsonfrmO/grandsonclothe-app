import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('Starting migration: adding rejection_reason column to orders table');

    // Add rejection_reason column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS rejection_reason TEXT
    `);

    logger.info('✓ Migration completed: rejection_reason column added to orders table');
    
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
