import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { ilike, and, gte, lte, eq } from 'drizzle-orm';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Build filters
    const filters = [];

    // Search query
    if (query) {
      filters.push(
        ilike(products.name, `%${query}%`)
      );
    }

    // Category filter
    if (category && category !== 'all') {
      filters.push(eq(products.category, category));
    }

    // Price filters
    if (minPrice) {
      filters.push(gte(products.price, parseInt(minPrice)));
    }
    if (maxPrice) {
      filters.push(lte(products.price, parseInt(maxPrice)));
    }

    // Build query
    let queryBuilder = db.select().from(products);

    if (filters.length > 0) {
      queryBuilder = queryBuilder.where(and(...filters)) as any;
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        queryBuilder = queryBuilder.orderBy(products.price) as any;
        break;
      case 'price-desc':
        queryBuilder = queryBuilder.orderBy(products.price) as any;
        break;
      case 'popular':
        // For now, just order by ID (in production, use view count or sales)
        queryBuilder = queryBuilder.orderBy(products.id) as any;
        break;
      case 'newest':
      default:
        queryBuilder = queryBuilder.orderBy(products.createdAt) as any;
        break;
    }

    const allResults = await queryBuilder;

    // Reverse for descending price
    if (sortBy === 'price-desc') {
      allResults.reverse();
    }

    // Apply pagination
    const total = allResults.length;
    const offset = (page - 1) * limit;
    const results = allResults.slice(offset, offset + limit);

    return NextResponse.json({
      data: results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}
