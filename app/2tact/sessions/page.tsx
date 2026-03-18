"use client"

import { useState, useEffect } from "react"
import { Monitor, Smartphone, Tablet, MapPin, Clock, Shield, Trash2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface Session {
  id: string
  device: string
  browser: string
  location: string
  ipAddress: string
  lastActive: string
  isCurrent: boolean
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler les sessions (à remplacer par une vraie API)
    const mockSessions: Session[] = [
      {
        id: '1',
        device: 'Windows PC',
        browser: 'Chrome 120',
        location: 'Conakry, Guinée',
        ipAddress: '197.149.123.45',
        lastActive: new Date().toISOString(),
        isCurrent: true,
      },
    ]
    setSessions(mockSessions)
    setLoading(false)
  }, [])

  const getDeviceIcon = (device: string) => {
    if (device.includes('Phone') || device.includes('Android') || device.includes('iOS')) {
      return <Smartphone className="w-5 h-5" />
    }
    if (device.includes('Tablet') || device.includes('iPad')) {
      return <Tablet className="w-5 h-5" />
    }
    return <Monitor className="w-5 h-5" />
  }

  const handleRevokeSession = (sessionId: string) => {
    // Implémenter la révocation de session
    setSessions(sessions.filter(s => s.id !== sessionId))
    toast.success("Session révoquée avec succès")
  }

  const handleRevokeAllSessions = () => {
    // Garder seulement la session actuelle
    setSessions(sessions.filter(s => s.isCurrent))
    toast.success("Toutes les autres sessions ont été révoquées")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="p-4 lg:p-8">
          <PageHeader
            title="Sessions Actives"
            description="Gérez vos sessions de connexion"
            backHref="/2tact/settings"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8">
        {/* Info Card */}
        <Card className="p-6 mb-6 border-border bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Session Persistante Activée</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Votre session reste active pendant 30 jours. Vous ne serez pas déconnecté automatiquement.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 border-green-500 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Durée: 30 jours
                </Badge>
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/20 border-blue-500 text-blue-700 dark:text-blue-400">
                  <Shield className="w-3 h-3 mr-1" />
                  Renouvellement automatique
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Sessions List */}
        {loading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {sessions.length} session{sessions.length > 1 ? 's' : ''} active{sessions.length > 1 ? 's' : ''}
              </h2>
              {sessions.length > 1 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Révoquer toutes les autres sessions
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>Révoquer toutes les sessions?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cela déconnectera tous vos autres appareils. Vous resterez connecté sur cet appareil.
                    </AlertDialogDescription>
                    <div className="flex gap-2 justify-end">
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleRevokeAllSessions}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Révoquer tout
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <div className="space-y-4">
              {sessions.map((session) => (
                <Card key={session.id} className="p-6 border-border hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getDeviceIcon(session.device)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg">{session.device}</h3>
                          {session.isCurrent && (
                            <Badge className="bg-green-500 text-white">
                              Session actuelle
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            <span>{session.browser}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{session.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>IP: {session.ipAddress}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              Dernière activité: {new Date(session.lastActive).toLocaleString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!session.isCurrent && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Révoquer
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogTitle>Révoquer cette session?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cet appareil sera déconnecté immédiatement.
                          </AlertDialogDescription>
                          <div className="flex gap-2 justify-end">
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRevokeSession(session.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Révoquer
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Security Tips */}
        <Card className="p-6 mt-6 border-border">
          <h3 className="font-bold text-lg mb-4">🔒 Conseils de sécurité</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
              <span>Vérifiez régulièrement vos sessions actives</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
              <span>Révoquez les sessions que vous ne reconnaissez pas</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
              <span>Déconnectez-vous manuellement sur les appareils partagés</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
              <span>Utilisez un mot de passe fort et unique</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
