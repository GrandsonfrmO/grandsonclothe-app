import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products, users } from '@/lib/db/schema';

export async function GET() {
  try {
    // Récupérer toutes les commandes
    let allOrders: any[] = [];
    let allUsers: any[] = [];
    let allOrderItems: any[] = [];
    let allProducts: any[] = [];

    try {
      allOrders = await db.select().from(orders);
    } catch (e) {
      console.error('Erreur lors de la récupération des commandes:', e);
    }

    try {
      allUsers = await db.select().from(users);
    } catch (e) {
      console.error('Erreur lors de la récupération des utilisateurs:', e);
    }

    try {
      allOrderItems = await db.select().from(orderItems);
    } catch (e) {
      console.error('Erreur lors de la récupération des items de commande:', e);
    }

    try {
      allProducts = await db.select().from(products);
    } catch (e) {
      console.error('Erreur lors de la récupération des produits:', e);
    }

    // Calculer les totaux
    const totalRevenue = allOrders.reduce((sum, order) => {
      const amount = typeof order.totalAmount === 'string' 
        ? parseFloat(order.totalAmount) 
        : (order.totalAmount || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const totalOrders = allOrders.length;
    const totalCustomers = allUsers.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Revenu par jour (7 derniers jours)
    const revenueByDay: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      revenueByDay[dateStr] = 0;
    }

    allOrders.forEach(order => {
      if (order.createdAt) {
        const orderDate = order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt);
        const dateStr = orderDate.toISOString().split('T')[0];
        if (dateStr in revenueByDay) {
          const amount = typeof order.totalAmount === 'string' 
            ? parseFloat(order.totalAmount) 
            : (order.totalAmount || 0);
          revenueByDay[dateStr] += isNaN(amount) ? 0 : amount;
        }
      }
    });

    // Commandes par statut
    const ordersByStatus: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    allOrders.forEach(order => {
      if (order.status) {
        const status = String(order.status).toLowerCase();
        if (status in ordersByStatus) {
          ordersByStatus[status as keyof typeof ordersByStatus] = (ordersByStatus[status as keyof typeof ordersByStatus] || 0) + 1;
        }
      }
    });

    // Produits les plus vendus
    const productSales: Record<number, number> = {};
    allOrderItems.forEach(item => {
      if (item.productId) {
        productSales[item.productId] = (productSales[item.productId] || 0) + (item.quantity || 1);
      }
    });

    const topProducts = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([productId, sales]) => {
        const product = allProducts.find(p => p.id === parseInt(productId));
        return {
          name: product?.name || 'Unknown',
          sales,
        };
      });

    const response = {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      totalCustomers,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      revenueByDay: Object.entries(revenueByDay).map(([date, revenue]) => ({
        date,
        revenue: Math.round(revenue * 100) / 100,
      })),
      ordersByStatus: Object.entries(ordersByStatus).map(([status, count]) => ({
        status,
        count,
      })),
      topProducts,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
