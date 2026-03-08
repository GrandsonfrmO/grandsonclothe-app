'use client';

import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AuthTest() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-blue-700">Vérification de l'authentification...</p>
      </Card>
    );
  }

  if (isAuthenticated && user) {
    return (
      <Card className="p-4 bg-green-50 border-green-200">
        <p className="text-green-700 font-semibold">✅ Connecté</p>
        <p className="text-green-600 text-sm mt-2">
          Utilisateur: {user.name} ({user.email})
        </p>
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="mt-3"
        >
          Déconnexion
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-yellow-50 border-yellow-200">
      <p className="text-yellow-700 font-semibold">⚠️ Non connecté</p>
      <p className="text-yellow-600 text-sm mt-2">
        Accédez à <code className="bg-yellow-100 px-2 py-1 rounded">/auth/signup</code> pour créer un compte
      </p>
    </Card>
  );
}
