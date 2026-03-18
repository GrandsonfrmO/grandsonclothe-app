'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';

export default function TestRolePage() {
  const { user, loading, isAuthenticated } = useAuth();
  const [apiUser, setApiUser] = useState<any>(null);

  useEffect(() => {
    // Vérifier via l'API
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setApiUser(data.user));
  }, []);

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test du Rôle Utilisateur</h1>
      
      <div className="space-y-6">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">État d'authentification</h2>
          <p><strong>Connecté :</strong> {isAuthenticated ? '✅ Oui' : '❌ Non'}</p>
          <p><strong>Loading :</strong> {loading ? 'Oui' : 'Non'}</p>
        </div>

        <div className="p-4 bg-blue-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Données du Context (useAuth)</h2>
          {user ? (
            <>
              <p><strong>ID :</strong> {user.id}</p>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Nom :</strong> {user.name}</p>
              <p><strong>Rôle :</strong> <span className="text-2xl font-bold">{user.role}</span></p>
              <p><strong>Est Admin :</strong> {user.role === 'admin' ? '✅ OUI' : '❌ NON'}</p>
            </>
          ) : (
            <p>Aucun utilisateur dans le context</p>
          )}
        </div>

        <div className="p-4 bg-green-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Données de l'API (/api/auth/me)</h2>
          {apiUser ? (
            <>
              <p><strong>ID :</strong> {apiUser.id}</p>
              <p><strong>Email :</strong> {apiUser.email}</p>
              <p><strong>Nom :</strong> {apiUser.name}</p>
              <p><strong>Rôle :</strong> <span className="text-2xl font-bold">{apiUser.role}</span></p>
              <p><strong>Est Admin :</strong> {apiUser.role === 'admin' ? '✅ OUI' : '❌ NON'}</p>
            </>
          ) : (
            <p>Chargement des données API...</p>
          )}
        </div>

        <div className="p-4 bg-yellow-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Diagnostic</h2>
          {user && user.role === 'admin' ? (
            <p className="text-green-600 font-bold">✅ Tu devrais avoir accès à /admin</p>
          ) : (
            <p className="text-red-600 font-bold">❌ Tu n'as pas le rôle admin</p>
          )}
        </div>

        <div className="space-y-2">
          <a href="/2tact/dashboard" className="block p-3 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600">
            Tester l'accès à /2tact/dashboard
          </a>
          <a href="/api/admin/check" className="block p-3 bg-purple-500 text-white text-center rounded-lg hover:bg-purple-600">
            Vérifier le compte admin dans la DB
          </a>
          <a href="/api/admin/fix-role" className="block p-3 bg-orange-500 text-white text-center rounded-lg hover:bg-orange-600">
            Forcer le rôle admin dans la DB
          </a>
        </div>
      </div>
    </div>
  );
}
