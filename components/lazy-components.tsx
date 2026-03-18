/**
 * Composants lazy-loadés pour améliorer les performances
 * Ces composants sont chargés uniquement quand nécessaire
 */

import dynamic from 'next/dynamic';

// Charts du dashboard - chargés uniquement sur la page dashboard
export const RevenueTrendChart = dynamic(
  () => import('@/components/2tact/revenue-trend-chart').then(mod => ({ default: mod.RevenueTrendChart })),
  {
    loading: () => (
      <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-lg animate-pulse">
        <p className="text-muted-foreground">Chargement du graphique...</p>
      </div>
    ),
    ssr: false, // Désactiver SSR pour les charts (ils utilisent window)
  }
);

export const OrderStatusDistribution = dynamic(
  () => import('@/components/2tact/order-status-distribution').then(mod => ({ default: mod.OrderStatusDistribution })),
  {
    loading: () => (
      <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-lg animate-pulse">
        <p className="text-muted-foreground">Chargement du graphique...</p>
      </div>
    ),
    ssr: false,
  }
);

// Theme Manager - chargé uniquement sur la page settings
export const ThemeManager = dynamic(
  () => import('@/components/2tact/theme-manager').then(mod => ({ default: mod.ThemeManager })),
  {
    loading: () => (
      <div className="p-6 bg-muted/10 rounded-lg animate-pulse">
        <div className="h-8 w-48 bg-muted rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </div>
    ),
  }
);

// Color Palette - chargé uniquement sur la page settings
export const ColorPalette = dynamic(
  () => import('@/components/2tact/color-palette').then(mod => ({ default: mod.ColorPalette })),
  {
    loading: () => (
      <div className="p-6 bg-muted/10 rounded-lg animate-pulse">
        <div className="h-8 w-48 bg-muted rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    ),
  }
);

// Logo Manager - chargé uniquement sur la page settings
export const LogoManager = dynamic(
  () => import('@/components/2tact/logo-manager').then(mod => ({ default: mod.LogoManager })),
  {
    loading: () => (
      <div className="p-6 bg-muted/10 rounded-lg animate-pulse">
        <div className="h-8 w-48 bg-muted rounded mb-4"></div>
        <div className="h-48 bg-muted rounded"></div>
      </div>
    ),
  }
);

// Logo History Gallery - chargé uniquement quand l'utilisateur clique
export const LogoHistoryGallery = dynamic(
  () => import('@/components/2tact/logo-history-gallery').then(mod => ({ default: mod.LogoHistoryGallery })),
  {
    loading: () => (
      <div className="grid grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded"></div>
        ))}
      </div>
    ),
  }
);

// Review Form - chargé uniquement quand l'utilisateur veut laisser un avis
export const ReviewForm = dynamic(
  () => import('@/components/review-form').then(mod => ({ default: mod.ReviewForm })),
  {
    loading: () => (
      <div className="p-4 bg-muted/10 rounded-lg animate-pulse">
        <div className="space-y-3">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-24 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded w-32"></div>
        </div>
      </div>
    ),
  }
);

// Notifications Panel - chargé uniquement quand ouvert
export const NotificationsPanel = dynamic(
  () => import('@/components/2tact/notifications-panel').then(mod => ({ default: mod.NotificationsPanel })),
  {
    loading: () => (
      <div className="p-4 space-y-2 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded"></div>
        ))}
      </div>
    ),
  }
);

// Custom Color Editor - chargé uniquement sur demande
export const CustomColorEditor = dynamic(
  () => import('@/components/2tact/custom-color-editor').then(mod => ({ default: mod.CustomColorEditor })),
  {
    loading: () => (
      <div className="p-4 bg-muted/10 rounded-lg animate-pulse">
        <div className="h-64 bg-muted rounded"></div>
      </div>
    ),
  }
);
