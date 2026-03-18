'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, ArrowLeft, Lock, Mail, User, Store, AlertCircle, Loader2, Check } from 'lucide-react';

export default function SellerSignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (!termsAccepted) {
      setError('Veuillez accepter les conditions d\'utilisation');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/seller-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          storeName,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Inscription échouée');
      }

      router.push('/auth/login?message=seller-registered');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inscription échouée');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = password.length >= 6 ? 'strong' : password.length >= 3 ? 'medium' : 'weak';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Retour</span>
        </Link>

        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60 mb-6 shadow-lg">
            <Store className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent via-accent to-accent/60 bg-clip-text text-transparent mb-2">
            GRANDSON CLOTHES
          </h1>
          <p className="text-muted-foreground text-lg">Créez votre boutique</p>
        </div>

        {/* Signup Card */}
        <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Store Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Nom de la boutique</label>
              <div className="relative group">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <Input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Ma Boutique"
                  required
                  className="pl-12 h-12 bg-secondary/50 border-border/50 rounded-xl focus:border-accent/50 focus:bg-secondary transition-all"
                />
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Nom complet</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                  className="pl-12 h-12 bg-secondary/50 border-border/50 rounded-xl focus:border-accent/50 focus:bg-secondary transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="pl-12 h-12 bg-secondary/50 border-border/50 rounded-xl focus:border-accent/50 focus:bg-secondary transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-12 pr-12 h-12 bg-secondary/50 border-border/50 rounded-xl focus:border-accent/50 focus:bg-secondary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {password && (
                <div className="flex gap-1 mt-2">
                  <div className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength === 'weak' ? 'bg-red-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  <div className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength === 'weak' ? 'bg-border' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  <div className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength !== 'strong' ? 'bg-border' : 'bg-green-500'}`} />
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Confirmer le mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-12 pr-12 h-12 bg-secondary/50 border-border/50 rounded-xl focus:border-accent/50 focus:bg-secondary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-500 font-medium">{error}</p>
              </div>
            )}

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="w-5 h-5 rounded-lg border border-border/50 bg-secondary/50 flex items-center justify-center mt-0.5 group-hover:border-accent/50 transition-colors">
                {termsAccepted && (
                  <Check className="w-3 h-3 text-accent" />
                )}
              </div>
              <span className="text-sm text-muted-foreground leading-relaxed">
                J'accepte les{' '}
                <Link href="#" className="text-accent hover:underline font-medium">
                  conditions d'utilisation
                </Link>
                {' '}et la{' '}
                <Link href="#" className="text-accent hover:underline font-medium">
                  politique de confidentialité
                </Link>
              </span>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="hidden"
              />
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !termsAccepted}
              className="w-full h-12 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold rounded-xl gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                'Créer ma boutique'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Login Link */}
          <Button
            asChild
            variant="outline"
            className="w-full h-12 rounded-xl font-semibold border-border/50 hover:bg-secondary/50 transition-all"
          >
            <Link href="/auth/login">
              Se connecter
            </Link>
          </Button>
        </div>

        {/* Benefits */}
        <div className="mt-8 space-y-3">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">Démarrage rapide</p>
              <p className="text-xs text-muted-foreground">Commencez à vendre en quelques minutes</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">Commissions compétitives</p>
              <p className="text-xs text-muted-foreground">Maximisez vos revenus</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">Support 24/7</p>
              <p className="text-xs text-muted-foreground">Nous sommes toujours là pour vous</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
