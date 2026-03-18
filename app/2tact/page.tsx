'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  // Rediriger vers le dashboard si connecté en tant qu'admin
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user?.role === 'admin') {
        router.push('/2tact/dashboard');
      } else {
        // Rediriger vers la page de login admin
        router.push('/2tact/login');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  return null;
}
