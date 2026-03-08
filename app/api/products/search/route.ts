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
      filters.push(gte(products.price, parseFloat(minPrice)));
    }
    if (maxPrice) {
      filters.push(lte(products.price, parseFloat(maxPrice)));
    }

    // Build query
    let query_builder = db.select().from(products);

    if (filters.length > 0) {
      query_builder = query_builder.where(and(...filters));
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        query_builder = query_builder.orderBy(products.price);
        break;
      case 'price-desc':
        query_builder = query_builder.orderBy(products.price);
        break;
      case 'popular':
        // For now, just order by ID (in production, use view count or sales)
        query_builder = query_builder.orderBy(products.id);
        break;
      case 'newest':
      default:
        query_builder = query_builder.orderBy(products.createdAt);
        break;
    }

    const allResults = await query_builder;

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
