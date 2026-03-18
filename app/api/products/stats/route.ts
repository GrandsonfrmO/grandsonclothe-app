import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  try {
    // Récupérer les produits avec leurs statistiques de vente et avis
    const productsWithStats = await db.execute(sql`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.image,
        p.category,
        p.stock,
        p.created_at,
        COALESCE(COUNT(DISTINCT oi.id), 0) as total_sales,
        COALESCE(SUM(oi.quantity), 0) as total_quantity_sold,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COALESCE(COUNT(DISTINCT r.id), 0) as review_count
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
      LEFT JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id, p.name, p.price, p.image, p.category, p.stock, p.created_at
      ORDER BY p.created_at DESC
    `);

    return NextResponse.json(Array.from(productsWithStats));
  } catch (error) {
    console.error('Error fetching product stats:', error);
    return NextResponse.json({ error: 'Failed to fetch product stats' }, { status: 500 });
  }
}
