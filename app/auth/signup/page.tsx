'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, ArrowLeft, Lock, Mail, User, AlertCircle, Loader2, Check, Zap } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      await signup(email, name, password);
      router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inscription échouée');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak';
  const isPasswordMatch = password && confirmPassword && password === confirmPassword;

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-all duration-300 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Retour</span>
        </Link>

        {/* Logo/Header */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
            <span className="text-accent-foreground font-bold text-2xl">GC</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent via-accent to-accent/60 bg-clip-text text-transparent mb-2">
            GRANDSON CLOTHES
          </h1>
          <p className="text-muted-foreground text-lg">Rejoignez notre communauté</p>
        </div>

        {/* Signup Card */}
        <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2 group">
              <label className="block text-sm font-semibold text-foreground">Nom complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors duration-300" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                  className="pl-12 h-12 bg-secondary/50 border border-border/50 rounded-xl focus:border-accent/50 focus:bg-secondary transition-all duration-300 focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2 group">
              <label className="block text-sm font-semibold text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors duration-300" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="pl-12 h-12 bg-secondary/50 border border-border/50 rounded-xl focus:border-accent/50 focus:bg-secondary transition-all duration-300 focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 group">
              <label className="block text-sm font-semibold text-foreground">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors duration-300" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-12 pr-12 h-12 bg-secondary/50 border border-border/50 rounded-xl focus:border-accent/50 focus:bg-secondary transition-all duration-300 focus:ring-2 focus:ring-accent/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300 hover:scale-110"
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
                <div className="flex gap-1 mt-2 animate-in fade-in duration-300">
                  <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength === 'weak' ? 'bg-red-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength === 'weak' ? 'bg-border' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength !== 'strong' ? 'bg-border' : 'bg-green-500'}`} />
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2 group">
              <label className="block text-sm font-semibold text-foreground">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors duration-300" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-12 pr-12 h-12 bg-secondary/50 border border-border/50 rounded-xl focus:border-accent/50 focus:bg-secondary transition-all duration-300 focus:ring-2 focus:ring-accent/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300 hover:scale-110"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className={`flex items-center gap-2 text-xs font-medium transition-all duration-300 ${isPasswordMatch ? 'text-green-500' : 'text-red-500'}`}>
                  {isPasswordMatch ? (
                    <>
                      <Check className="w-4 h-4" />
                      Les mots de passe correspondent
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Les mots de passe ne correspondent pas
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-500 font-medium">{error}</p>
              </div>
            )}

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl hover:bg-secondary/30 transition-all duration-300">
              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center mt-0.5 transition-all duration-300 ${termsAccepted ? 'bg-accent border-accent' : 'border-border/50 group-hover:border-accent/50'}`}>
                {termsAccepted && (
                  <Check className="w-3 h-3 text-accent-foreground animate-in scale-in duration-200" />
                )}
              </div>
              <span className="text-sm text-muted-foreground leading-relaxed">
                J'accepte les{' '}
                <Link href="#" className="text-accent hover:underline font-medium transition-colors duration-300">
                  conditions d'utilisation
                </Link>
                {' '}et la{' '}
                <Link href="#" className="text-accent hover:underline font-medium transition-colors duration-300">
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
              className="w-full h-12 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold rounded-xl gap-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:scale-105 active:scale-95 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  S'inscrire
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-border/0 via-border/50 to-border/0" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="flex-1 h-px bg-gradient-to-r from-border/0 via-border/50 to-border/0" />
          </div>

          {/* Login Link */}
          <Button
            asChild
            variant="outline"
            className="w-full h-12 rounded-xl font-semibold border-border/50 hover:bg-secondary/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <Link href="/auth/login">
              Se connecter
            </Link>
          </Button>
        </div>

        {/* Benefits */}
        <div className="mt-8 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: "200ms" }}>
          <div className="flex gap-3 items-start group cursor-default">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-accent/20 transition-all duration-300 transform group-hover:scale-110">
              <Check className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold">Historique des commandes</p>
              <p className="text-xs text-muted-foreground">Suivez tous vos achats</p>
            </div>
          </div>

          <div className="flex gap-3 items-start group cursor-default">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-accent/20 transition-all duration-300 transform group-hover:scale-110">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">Favoris personnalisés</p>
              <p className="text-xs text-muted-foreground">Sauvegardez vos articles</p>
            </div>
          </div>

          <div className="flex gap-3 items-start group cursor-default">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-accent/20 transition-all duration-300 transform group-hover:scale-110">
              <Zap className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold">Accès rapide</p>
              <p className="text-xs text-muted-foreground">Checkout en un clic</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
