"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Skeleton loaders
function ChartSkeleton() {
  return (
    <div className="w-full h-64 bg-secondary/50 animate-pulse rounded-lg" />
  )
}

function CardSkeleton() {
  return (
    <div className="w-full h-32 bg-secondary/50 animate-pulse rounded-lg" />
  )
}

// Lazy loaded components
export const LazyRevenueTrendChart = dynamic(
  () => import('@/components/2tact/revenue-trend-chart').then(mod => mod.RevenueTrendChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

export const LazyOrderStatusDistribution = dynamic(
  () => import('@/components/2tact/order-status-distribution').then(mod => mod.OrderStatusDistribution),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

export const LazyCategoryPerformance = dynamic(
  () => import('@/components/2tact/category-performance').then(mod => mod.CategoryPerformance),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

export const LazySalesChart = dynamic(
  () => import('@/components/2tact/sales-chart').then(mod => mod.SalesChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

export const LazyTopProducts = dynamic(
  () => import('@/components/2tact/top-products').then(mod => mod.TopProducts),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  }
)

export const LazyRecentOrders = dynamic(
  () => import('@/components/2tact/recent-orders').then(mod => mod.RecentOrders),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  }
)
