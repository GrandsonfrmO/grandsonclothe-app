"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, AlertCircle, Loader2, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erreur de connexion")
        setLoading(false)
        return
      }

      // Rediriger selon le rôle
      if (data.user.role === "admin") {
        router.push("/2tact/dashboard")
      } else {
        router.push("/profile")
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.")
      setLoading(false)
    }
  }

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
          <p className="text-muted-foreground text-lg">Bienvenue de retour</p>
        </div>

        {/* Login Card */}
        <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2 group">
              <label className="block text-sm font-semibold text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors duration-300" />
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-secondary/50 border border-border/50 rounded-xl focus:border-accent/50 focus:bg-secondary transition-all duration-300 focus:ring-2 focus:ring-accent/20"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2 group">
              <label className="block text-sm font-semibold text-foreground">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors duration-300" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 bg-secondary/50 border border-border/50 rounded-xl focus:border-accent/50 focus:bg-secondary transition-all duration-300 focus:ring-2 focus:ring-accent/20"
                  required
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
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-500 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold rounded-xl gap-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-border/0 via-border/50 to-border/0" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="flex-1 h-px bg-gradient-to-r from-border/0 via-border/50 to-border/0" />
          </div>

          {/* Signup Link */}
          <Button
            asChild
            variant="outline"
            className="w-full h-12 rounded-xl font-semibold border-border/50 hover:bg-secondary/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <Link href="/auth/signup">
              Créer un compte
            </Link>
          </Button>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: "200ms" }}>
          <div className="text-center group cursor-default">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-accent/20 transition-all duration-300 transform group-hover:scale-110">
              <CheckCircle2 className="w-5 h-5 text-accent" />
            </div>
            <p className="text-xs font-medium">Sécurisé</p>
          </div>
          <div className="text-center group cursor-default">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-accent/20 transition-all duration-300 transform group-hover:scale-110">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs font-medium">Rapide</p>
          </div>
          <div className="text-center group cursor-default">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-accent/20 transition-all duration-300 transform group-hover:scale-110">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs font-medium">Fiable</p>
          </div>
        </div>
      </div>
    </div>
  )
}
