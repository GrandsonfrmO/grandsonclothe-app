import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct, getProductsPaginated } from '@/lib/db/queries';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { requireAdmin, isNextResponse } from '@/lib/auth-middleware';
import { createProductSchema } from '@/lib/validation';
import { createError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export const revalidate = 60; // Cache for 1 minute (faster updates)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sort = searchParams.get('sort') || 'recent'; // recent, popular, top-rated, random
    const category = searchParams.get('category') || undefined;
    
    // Use optimized pagination query
    const result = await getProductsPaginated({
      page,
      limit,
      sort: sort as any,
      category,
    });
    
    return NextResponse.json(
      {
        data: result.items,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: result.pages,
          hasMore: result.hasMore,
        }
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        }
      }
    );
  } catch (error) {
    logger.error('Erreur lors de la récupération des produits', error);
    console.error('Products GET error:', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code, details: error instanceof Error ? error.message : 'Unknown error' },
      { status: appError.statusCode }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Protection admin
    const admin = await requireAdmin(request);
    if (isNextResponse(admin)) return admin;

    const body = await request.json();

    // Validation avec Zod
    const validationResult = createProductSchema.safeParse(body);
    if (!validationResult.success) {
      const error = createError('VALIDATION_ERROR', validationResult.error.errors[0].message);
      return NextResponse.json(
        { error: error.message, code: error.code, details: validationResult.error.errors },
        { status: error.statusCode }
      );
    }

    const { name, description, price, image, category, stock, colors, sizes } = validationResult.data;

    // Convertir colors et sizes en JSON string si ce ne sont pas déjà des strings
    const colorsValue = colors 
      ? (typeof colors === 'string' ? colors : JSON.stringify(colors))
      : null;
    const sizesValue = sizes
      ? (typeof sizes === 'string' ? sizes : JSON.stringify(sizes))
      : null;

    const insertData = {
      name,
      description: description || '',
      price,
      image: image || '',
      category,
      stock: stock || 0,
      colors: colorsValue,
      sizes: sizesValue,
    };

    const newProduct = await db.insert(products).values(insertData).returning();

    logger.info(`Produit créé par admin ${admin.userId}: ${newProduct[0].name}`);

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    logger.error('Erreur lors de la création du produit', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}
