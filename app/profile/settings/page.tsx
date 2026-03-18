'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNav } from '@/components/bottom-nav';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Lock, 
  Bell, 
  Trash2,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  LogOut
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Preferences {
  newsletter: boolean;
  notifications: boolean;
  smsUpdates: boolean;
}

export default function SettingsPage() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({ 
    name: '', 
    email: '',
    phone: '',
    address: ''
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preferences, setPreferences] = useState<Preferences>({
    newsletter: true,
    notifications: true,
    smsUpdates: false,
  });
  
  const [loading2, setLoading2] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'preferences'>('profile');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({ 
        name: user.name, 
        email: user.email,
        phone: '',
        address: ''
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (key: keyof Preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading2(true);
    setMessage('');
    setError('');

    try {
      setMessage('Profil mis à jour avec succès');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading2(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading2(true);
    setMessage('');
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading2(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading2(false);
      return;
    }

    try {
      setMessage('Mot de passe changé avec succès');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Erreur lors du changement de mot de passe');
    } finally {
      setLoading2(false);
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading2(true);
    setMessage('');
    setError('');

    try {
      setMessage('Préférences mises à jour avec succès');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Erreur lors de la mise à jour des préférences');
    } finally {
      setLoading2(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader title="Paramètres" showBack />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader title="Paramètres" showBack />
      
      <main className="space-y-2 px-4 py-4">
        {/* Tabs */}
        <Card className="p-2 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all touch-manipulation flex-1 min-w-[120px] justify-center ${
                activeTab === 'profile'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-sm">Profil</span>
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all touch-manipulation flex-1 min-w-[120px] justify-center ${
                activeTab === 'password'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span className="text-sm">Sécurité</span>
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all touch-manipulation flex-1 min-w-[120px] justify-center ${
                activeTab === 'preferences'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="text-sm">Notifications</span>
            </button>
          </div>
        </Card>

        {/* Messages */}
        {message && (
          <Card className="p-4 bg-accent/10 border-accent/20">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{message}</p>
            </div>
          </Card>
        )}
        {error && (
          <Card className="p-4 bg-destructive/10 border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{error}</p>
            </div>
          </Card>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-2">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold">Informations personnelles</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    placeholder="+224 XXX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Adresse de livraison
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-foreground resize-none"
                    rows={3}
                    placeholder="Entrez votre adresse complète"
                  />
                </div>
              </div>
            </Card>

            <Button 
              type="submit" 
              disabled={loading2}
              className="w-full h-12 rounded-xl touch-manipulation"
            >
              {loading2 ? 'Mise à jour...' : 'Enregistrer les modifications'}
            </Button>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-2">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold">Changer le mot de passe</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Minimum 6 caractères
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    required
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-accent/10 border-accent/20">
              <p className="text-xs text-muted-foreground">
                💡 Utilisez un mot de passe fort avec des lettres, chiffres et caractères spéciaux
              </p>
            </Card>

            <Button 
              type="submit" 
              disabled={loading2}
              className="w-full h-12 rounded-xl touch-manipulation"
            >
              {loading2 ? 'Changement en cours...' : 'Changer le mot de passe'}
            </Button>
          </form>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <form onSubmit={handlePreferencesSubmit} className="space-y-2">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold">Préférences de notification</h2>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl cursor-pointer touch-manipulation active:bg-secondary transition-colors">
                  <input
                    type="checkbox"
                    checked={preferences.newsletter}
                    onChange={() => handlePreferenceChange('newsletter')}
                    className="w-5 h-5 text-accent rounded focus:ring-2 focus:ring-accent mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground mb-1">Newsletter</p>
                    <p className="text-sm text-muted-foreground">
                      Recevoir nos dernières offres et actualités par email
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl cursor-pointer touch-manipulation active:bg-secondary transition-colors">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={() => handlePreferenceChange('notifications')}
                    className="w-5 h-5 text-accent rounded focus:ring-2 focus:ring-accent mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground mb-1">Notifications email</p>
                    <p className="text-sm text-muted-foreground">
                      Mises à jour sur vos commandes et votre compte
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl cursor-pointer touch-manipulation active:bg-secondary transition-colors">
                  <input
                    type="checkbox"
                    checked={preferences.smsUpdates}
                    onChange={() => handlePreferenceChange('smsUpdates')}
                    className="w-5 h-5 text-accent rounded focus:ring-2 focus:ring-accent mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground mb-1">Alertes SMS</p>
                    <p className="text-sm text-muted-foreground">
                      Suivi de livraison et alertes importantes par SMS
                    </p>
                  </div>
                </label>
              </div>
            </Card>

            <Button 
              type="submit" 
              disabled={loading2}
              className="w-full h-12 rounded-xl touch-manipulation"
            >
              {loading2 ? 'Mise à jour...' : 'Enregistrer les préférences'}
            </Button>
          </form>
        )}

        {/* Danger Zone */}
        <Card className="p-4 bg-destructive/10 border-destructive/20 mt-6">
          <div className="flex items-start gap-3 mb-4">
            <Trash2 className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-destructive mb-1">Zone de danger</h2>
              <p className="text-sm text-muted-foreground">
                Supprimer votre compte est une action permanente et ne peut pas être annulée.
              </p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            className="w-full h-12 rounded-xl touch-manipulation"
          >
            Supprimer mon compte
          </Button>
        </Card>

        {/* Logout Button */}
        <Button 
          onClick={() => {
            logout();
            router.push('/');
          }}
          variant="outline"
          className="w-full h-12 rounded-xl touch-manipulation border-border gap-2 mt-2"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
