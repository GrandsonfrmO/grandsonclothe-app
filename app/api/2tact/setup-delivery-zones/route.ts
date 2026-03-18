import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deliveryZones } from '@/lib/db/schema';
import { requireAdmin, isNextResponse } from '@/lib/auth-middleware';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const adminCheck = await requireAdmin(request);
    if (isNextResponse(adminCheck)) {
      return adminCheck;
    }

    // Insert sample delivery zones
    const sampleZones = [
      {
        name: 'Conakry Centre',
        description: 'Zone centrale de Conakry',
        price: 5000,
        isActive: true,
      },
      {
        name: 'Conakry Banlieue',
        description: 'Zones périphériques de Conakry',
        price: 8000,
        isActive: true,
      },
      {
        name: 'Kindia',
        description: 'Région de Kindia',
        price: 12000,
        isActive: true,
      },
      {
        name: 'Mamou',
        description: 'Région de Mamou',
        price: 15000,
        isActive: true,
      },
      {
        name: 'Labé',
        description: 'Région de Labé',
        price: 18000,
        isActive: true,
      },
    ];

    // Insert zones (ignore duplicates)
    const results = [];
    for (const zone of sampleZones) {
      try {
        const result = await db.insert(deliveryZones).values(zone).returning();
        if (result.length > 0) {
          results.push(result[0]);
        }
      } catch (error) {
        // Zone already exists, skip
        logger.info(`Zone ${zone.name} already exists`);
      }
    }

    logger.info(`Delivery zones setup complete: ${results.length} zones created`);

    return NextResponse.json(
      {
        success: true,
        message: 'Delivery zones setup complete',
        zonesCreated: results.length,
        zones: results,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Error setting up delivery zones', error);
    return NextResponse.json(
      { error: 'Error setting up delivery zones' },
      { status: 500 }
    );
  }
}
