'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, AlertCircle, Loader2, ArrowLeft, Eye, EyeOff, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur de connexion');
        setLoading(false);
        return;
      }

      // Vérifier que c'est un admin
      if (data.user.role !== 'admin') {
        setError('Accès refusé. Ce compte n\'a pas les droits administrateur.');
        setLoading(false);
        return;
      }

      // Rediriger vers le dashboard admin
      router.push('/2tact/dashboard');
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Aurora Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-lg">
        {/* Back Button High-End */}
        <Link href="/" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-accent mb-12 transition-all duration-500 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-500" />
          <span>Quitter la Zone de Sécurité</span>
        </Link>

        {/* Logo/Header Royal */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-border/40 mb-8 shadow-2xl group transition-transform duration-700 hover:rotate-[360deg] cursor-pointer">
            <div className="absolute inset-0 bg-accent/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Shield className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter text-foreground mb-4 drop-shadow-sm">
            PORTAIL <span className="text-accent underline decoration-accent/20 underline-offset-8">IMPÉRIAL</span>
          </h1>
          <p className="text-sm font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40">Grandson Clothes Admin Hub</p>
        </div>

        {/* Login Card Glassmorphism */}
        <div className="bg-card/40 backdrop-blur-2xl border border-border/40 rounded-[3.5rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] hover:shadow-accent/5 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <form onSubmit={handleLogin} className="space-y-8">
            {/* Email Royal */}
            <div className="space-y-3 group">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 group-focus-within:text-accent transition-colors">Identifiant d'Accès</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-all duration-500" />
                <Input
                  type="email"
                  placeholder="admin@grandson-prestige.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-14 h-16 bg-secondary/30 border-none rounded-2xl text-lg font-black italic tracking-tight focus:ring-0 shadow-inner group-focus-within:bg-secondary/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Royal */}
            <div className="space-y-3 group">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 group-focus-within:text-accent transition-colors">Code de Chiffrement</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-all duration-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-14 pr-14 h-16 bg-secondary/30 border-none rounded-2xl text-lg font-black italic tracking-tight focus:ring-0 shadow-inner group-focus-within:bg-secondary/50 transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-all duration-500 hover:scale-125"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message Premium */}
            {error && (
              <div className="flex items-center gap-4 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in slide-in-from-top-2 duration-500 shadow-lg shadow-red-500/5">
                <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                <p className="text-xs font-black uppercase text-red-500 tracking-wider">Accès Révoqué: {error}</p>
              </div>
            )}

            {/* Submit Button Royal */}
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full h-20 bg-accent hover:bg-accent/90 text-white font-black italic text-xl rounded-[2rem] gap-4 transition-all duration-500 shadow-2xl shadow-accent/20 disabled:opacity-50 hover:scale-[1.02] active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Authentification...
                </>
              ) : (
                <>
                  INITIALISER LA SESSION <ArrowLeft className="w-6 h-6 rotate-180" />
                </>
              )}
            </Button>
          </form>

          {/* Luxury Divider */}
          <div className="flex items-center gap-6 my-10">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-border/50 to-transparent" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-30">Contrôle Alternatives</span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-border/0 via-border/50 to-border/0" />
          </div>

          {/* Alternative Accès */}
          <Button
            asChild
            variant="outline"
            className="w-full h-16 rounded-2xl font-black text-xs uppercase tracking-widest border-border/40 hover:bg-secondary/40 transition-all duration-500 hover:scale-x-105"
          >
            <Link href="/auth/login">
              RETOUR AU SECTEUR CIVIL
            </Link>
          </Button>
        </div>

        {/* Footer Royal */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">Système de Surveillance Actif</p>
          <div className="flex justify-center gap-8">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
             <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-lg shadow-accent/50" style={{ animationDelay: '0.5s' }} />
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
