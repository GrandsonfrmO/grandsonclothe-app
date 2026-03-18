'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Loader } from 'lucide-react';

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/2tact/setup');
      const data = await response.json();
      setAdminExists(data.adminExists);
      if (data.admins && data.admins.length > 0) {
        setMessage(`Admin trouvé: ${data.admins[0].email}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSetupAdmin = async () => {
    setLoading(true);
    setSuccess(false);
    setMessage('');

    try {
      const response = await fetch('/api/2tact/setup', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setMessage(
          `✅ ${data.message}\n\nEmail: ${data.admin.email}\nNom: ${data.admin.name}\n\nVous pouvez maintenant vous connecter sur /2tact`
        );
        setAdminExists(true);
      } else {
        setMessage(`❌ Erreur: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Configuration Admin</h1>
          <p className="text-muted-foreground text-sm">
            Créez ou mettez à jour votre compte administrateur
          </p>
        </div>

        {adminExists !== null && (
          <div className={`mb-6 p-4 rounded-lg flex gap-3 ${
            adminExists 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-amber-500/10 border border-amber-500/20'
          }`}>
            {adminExists ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-green-600">Admin existe</p>
                  <p className="text-xs text-green-600/80">Un compte admin est déjà configuré</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-amber-600">Pas d'admin</p>
                  <p className="text-xs text-amber-600/80">Aucun compte admin trouvé</p>
                </div>
              </>
            )}
          </div>
        )}

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm whitespace-pre-wrap ${
            success
              ? 'bg-green-500/10 border border-green-500/20 text-green-600'
              : 'bg-red-500/10 border border-red-500/20 text-red-600'
          }`}>
            {message}
          </div>
        )}

        <Button
          onClick={handleSetupAdmin}
          disabled={loading}
          className="w-full h-12 rounded-lg gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Configuration en cours...
            </>
          ) : (
            'Configurer le compte admin'
          )}
        </Button>

        <div className="mt-6 p-4 bg-secondary/50 rounded-lg text-xs text-muted-foreground space-y-2">
          <p className="font-medium">Identifiants:</p>
          <p>Email: <code className="bg-background px-2 py-1 rounded">Voir .env.local</code></p>
          <p>Mot de passe: <code className="bg-background px-2 py-1 rounded">Voir .env.local</code></p>
          <p className="text-xs mt-3 text-amber-600">⚠️ Configurez vos identifiants dans .env.local</p>
        </div>

        <div className="mt-6 text-center">
          <a href="/2tact" className="text-accent hover:underline text-sm">
            Aller à la page de connexion admin →
          </a>
        </div>
      </Card>
    </div>
  );
}
