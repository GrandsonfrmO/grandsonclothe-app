import { unstable_cache } from 'next/cache';

/**
 * Cache serveur pour les données fréquemment accédées
 * Utilise le cache Next.js natif avec revalidation
 */

// Cache pour les produits populaires (5 minutes)
export const getCachedPopularProducts = unstable_cache(
  async (limit: number = 8) => {
    const { getProductsPaginated } = await import('@/lib/db/queries');
    const result = await getProductsPaginated({
      page: 1,
      limit,
      sort: 'popular',
    });
    return result.items;
  },
  ['popular-products'],
  {
    revalidate: 300, // 5 minutes
    tags: ['products', 'popular'],
  }
);

// Cache pour les statistiques du dashboard (2 minutes)
export const getCachedDashboardStats = unstable_cache(
  async () => {
    const { db } = await import('@/lib/db');
    const { orders, products, users } = await import('@/lib/db/schema');
    const { sql, count, sum } = await import('drizzle-orm');

    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
    ] = await Promise.all([
      db.select({ count: count() }).from(orders),
      db.select({ total: sum(orders.totalAmount) }).from(orders),
      db.select({ count: count() }).from(products),
      db.select({ count: count() }).from(users),
    ]);

    return {
      totalOrders: totalOrders[0]?.count || 0,
      totalRevenue: Number(totalRevenue[0]?.total || 0),
      totalProducts: totalProducts[0]?.count || 0,
      totalUsers: totalUsers[0]?.count || 0,
    };
  },
  ['dashboard-stats'],
  {
    revalidate: 120, // 2 minutes
    tags: ['dashboard', 'stats'],
  }
);

// Cache pour les zones de livraison (10 minutes)
export const getCachedDeliveryZones = unstable_cache(
  async () => {
    const { db } = await import('@/lib/db');
    const { deliveryZones } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');

    return await db
      .select()
      .from(deliveryZones)
      .where(eq(deliveryZones.isActive, true))
      .orderBy(deliveryZones.name);
  },
  ['delivery-zones'],
  {
    revalidate: 600, // 10 minutes
    tags: ['delivery-zones'],
  }
);

// Cache pour les produits récents (3 minutes)
export const getCachedRecentProducts = unstable_cache(
  async (limit: number = 12) => {
    const { getProductsPaginated } = await import('@/lib/db/queries');
    const result = await getProductsPaginated({
      page: 1,
      limit,
      sort: 'recent',
    });
    return result.items;
  },
  ['recent-products'],
  {
    revalidate: 180, // 3 minutes
    tags: ['products', 'recent'],
  }
);

// Cache pour les produits top-rated (5 minutes)
export const getCachedTopRatedProducts = unstable_cache(
  async (limit: number = 8) => {
    const { getProductsPaginated } = await import('@/lib/db/queries');
    const result = await getProductsPaginated({
      page: 1,
      limit,
      sort: 'top-rated',
    });
    return result.items;
  },
  ['top-rated-products'],
  {
    revalidate: 300, // 5 minutes
    tags: ['products', 'top-rated'],
  }
);

/**
 * Fonctions utilitaires pour invalider le cache
 */
export async function revalidateProducts() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag('products');
}

export async function revalidateDashboard() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag('dashboard');
}

export async function revalidateDeliveryZones() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag('delivery-zones');
}
