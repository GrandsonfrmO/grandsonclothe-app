import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products, users } from '@/lib/db/schema';

export async function GET() {
  try {
    // Get all orders for calculations
    const allOrders = await db.select().from(orders);
    const allUsers = await db.select().from(users);
    const allOrderItems = await db.select().from(orderItems);
    const allProducts = await db.select().from(products);

    // Calculate totals
    const totalRevenue = allOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
    const totalOrders = allOrders.length;
    const totalCustomers = allUsers.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Revenue by day (last 7 days)
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
        const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
        if (dateStr in revenueByDay) {
          revenueByDay[dateStr] += parseFloat(order.totalAmount);
        }
      }
    });

    // Orders by status
    const ordersByStatus: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    allOrders.forEach(order => {
      if (order.status) {
        ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
      }
    });

    // Top products
    const productSales: Record<number, number> = {};
    allOrderItems.forEach(item => {
      if (item.productId) {
        productSales[item.productId] = (productSales[item.productId] || 0) + 1;
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

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      revenueByDay: Object.entries(revenueByDay).map(([date, revenue]) => ({
        date,
        revenue,
      })),
      ordersByStatus: Object.entries(ordersByStatus).map(([status, count]) => ({
        status,
        count,
      })),
      topProducts,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
