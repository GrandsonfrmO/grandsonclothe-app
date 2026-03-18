'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserNotificationsBell } from '@/components/user-notifications-bell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, Shield, Bell } from 'lucide-react';

export function UserMenu() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex gap-2">
        <Link href="/auth/login">
          <Button variant="outline" size="sm">
            Connexion
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button size="sm">
            S'inscrire
          </Button>
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="flex items-center gap-2">
      {user?.role !== 'admin' && <UserNotificationsBell />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{user?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
            {user?.email}
          </div>
          <DropdownMenuSeparator />
          {user?.role === 'admin' && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/2tact/dashboard" className="cursor-pointer bg-accent/10 text-accent font-semibold">
                  <Shield className="w-4 h-4 mr-2" />
                  Tableau de bord Admin
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              Mon profil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/orders" className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Mes commandes
            </Link>
          </DropdownMenuItem>
          {user?.role !== 'admin' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/notifications" className="cursor-pointer">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/2tact/notifications" className="cursor-pointer">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
