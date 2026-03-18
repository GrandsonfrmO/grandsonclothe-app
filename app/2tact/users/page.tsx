"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Lock, Trash2, CheckCircle, AlertCircle, Ban, Clock, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { PageHeader } from "@/components/2tact/page-header"
import { Separator } from "@/components/ui/separator"

interface User {
  id: number
  email: string
  name: string
  role: "admin" | "buyer" | "seller" | "guest"
  status: "active" | "suspended" | "blocked" | "deleted"
  suspendedAt?: string
  suspendReason?: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  suspended: "bg-yellow-100 text-yellow-800",
  blocked: "bg-red-100 text-red-800",
  deleted: "bg-gray-100 text-gray-800",
}

const statusIcons: Record<string, React.ReactNode> = {
  active: <CheckCircle className="w-4 h-4" />,
  suspended: <AlertCircle className="w-4 h-4" />,
  blocked: <Ban className="w-4 h-4" />,
  deleted: <Trash2 className="w-4 h-4" />,
}

const statusLabels: Record<string, string> = {
  active: "Actif",
  suspended: "Suspendu",
  blocked: "Bloqué",
  deleted: "Supprimé",
}

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  buyer: "bg-blue-100 text-blue-800",
  seller: "bg-green-100 text-green-800",
  guest: "bg-gray-100 text-gray-800",
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [suspendReason, setSuspendReason] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [statusFilter, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter)
      if (roleFilter && roleFilter !== "all") params.append("role", roleFilter)
      if (searchTerm) params.append("search", searchTerm)

      const res = await fetch(`/api/2tact/users?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setUsers(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Erreur:", error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId: number) => {
    const loadingToast = toast.loading("Suppression définitive en cours...")
    try {
      const res = await fetch(`/api/2tact/users/${userId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Utilisateur éradiqué avec succès de la base Grandson.", { id: loadingToast })
        fetchUsers()
      } else {
        const errorData = await res.json()
        toast.error(`Échec de la suppression: ${errorData.error || "Erreur inconnue"}`, { id: loadingToast })
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Une erreur catastrophique est survenue.", { id: loadingToast })
    }
  }

  const handleStatusChange = async (userId: number, newStatus: string, reason?: string) => {
    const loadingToast = toast.loading("Mise à jour du statut...")
    try {
      const res = await fetch(`/api/2tact/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          suspendReason: reason,
        }),
      })

      if (res.ok) {
        toast.success(`Statut mis à jour vers "${statusLabels[newStatus]}"`, { id: loadingToast })
        fetchUsers()
        setSelectedUser(null)
        setSuspendReason("")
      } else {
        toast.error("Échec de la mise à jour du statut.", { id: loadingToast })
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur réseau ou serveur.", { id: loadingToast })
    }
  }

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background pb-20">
      {/* Header with Glassmorphism */}
      <div className="sticky top-0 z-40 bg-background/60 backdrop-blur-2xl border-b border-border/50">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <PageHeader
            title="Souveraineté des Comptes"
            description="Arbitrez l'accès et les privilèges de votre communauté"
            backHref="/2tact/dashboard"
          />
        </div>
      </div>

      <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12">
        {/* Filtres et Recherche High-End */}
        <div className="bg-card/40 backdrop-blur-xl p-3 sm:p-4 rounded-[2.5rem] border border-border/40 shadow-2xl space-y-4">
          <div className="relative group px-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <Input
              placeholder="Rechercher par nom, email ou identifiant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 h-14 bg-transparent border-none focus-visible:ring-0 text-lg font-medium placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 px-2 pb-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 bg-secondary/50 border-none rounded-2xl text-xs font-black uppercase tracking-[0.2em] min-w-[200px] shadow-inner">
                <SelectValue placeholder="État Civil" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/40 bg-background/95 backdrop-blur-xl">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">🌟 Actif</SelectItem>
                <SelectItem value="suspended">⏳ Suspendu</SelectItem>
                <SelectItem value="blocked">🚫 Bloqué</SelectItem>
                <SelectItem value="deleted">🗑️ Supprimé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-12 bg-secondary/50 border-none rounded-2xl text-xs font-black uppercase tracking-[0.2em] min-w-[200px] shadow-inner">
                <SelectValue placeholder="Hiérarchie" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/40 bg-background/95 backdrop-blur-xl">
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="admin">👑 Admin</SelectItem>
                <SelectItem value="buyer">🛍️ Acheteur</SelectItem>
                <SelectItem value="seller">🏪 Vendeur</SelectItem>
                <SelectItem value="guest">👤 Invité</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1" />
            
            <div className="flex items-center gap-3 px-6 bg-accent/5 rounded-2xl border border-accent/10">
               <span className="text-[10px] font-black text-accent uppercase tracking-widest">{filteredUsers.length} CITOYENS</span>
            </div>
          </div>
        </div>

        {/* Liste des Utilisateurs Premium */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-16 h-16 border-t-4 border-accent rounded-full animate-spin" />
            <p className="text-sm font-black uppercase tracking-[0.5em] text-accent animate-pulse italic">Recensement en cours...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-40 bg-card/20 rounded-[3rem] border-2 border-dashed border-border/20">
             <Search className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
             <h3 className="text-2xl font-black italic tracking-tighter">Territoire inexploré</h3>
             <p className="text-muted-foreground font-medium mt-2">Aucune trace de vie correspondant à vos critères</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUsers.map((user: User) => (
              <Card key={user.id} className="group relative overflow-hidden bg-card/40 backdrop-blur-xl border border-border/40 hover:border-accent/40 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] p-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors" />
                
                <div className="relative z-10 space-y-6">
                  {/* User Profile Header */}
                  <div className="flex items-start justify-between">
                    <div className="w-20 h-20 bg-accent/10 rounded-[2rem] flex items-center justify-center text-3xl font-black text-accent shadow-inner group-hover:scale-110 transition-transform duration-500">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`${roleColors[user.role]} border-none rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] shadow-sm`}>
                        {user.role}
                      </Badge>
                      <Badge className={`${statusColors[user.status]} border-none rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] shadow-sm`}>
                        {statusIcons[user.status]}
                        <span className="ml-2">{user.status}</span>
                      </Badge>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tighter italic truncate">{user.name}</h3>
                    <p className="text-sm font-medium text-muted-foreground truncate">{user.email}</p>
                  </div>

                  <div className="pt-4 border-t border-border/30 space-y-3">
                    {user.suspendReason && (
                      <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10 flex gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] font-black text-red-600 uppercase italic">Motif: {user.suspendReason}</p>
                      </div>
                    )}
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                       <Clock className="w-3 h-3" /> Membre depuis {new Date(user.createdAt).toLocaleDateString("fr-FR", { month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Dialog open={selectedUser?.id === user.id} onOpenChange={(open) => {
                      if (!open) { setSelectedUser(null); setSuspendReason(""); }
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedUser(user)}
                          className="flex-1 h-12 rounded-2xl font-black gap-2 hover:bg-accent hover:text-white transition-all shadow-lg"
                        >
                          <Eye className="w-4 h-4" /> GÉRER
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl w-[95vw] bg-background/95 backdrop-blur-3xl border-border/40 rounded-[3rem] p-0 overflow-hidden shadow-3xl">
                        {selectedUser && (
                          <div className="space-y-0">
                            <div className="p-10 bg-gradient-to-br from-accent/10 via-secondary/10 to-transparent border-b border-border/30">
                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-6">
                                   <div className="w-24 h-24 bg-accent/20 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-accent shadow-xl">
                                      {selectedUser.name.charAt(0).toUpperCase()}
                                   </div>
                                   <div>
                                      <h2 className="text-4xl font-black italic tracking-tighter">{selectedUser.name}</h2>
                                      <p className="text-lg font-medium text-muted-foreground">{selectedUser.email}</p>
                                   </div>
                                </div>
                                <Badge className={`${statusColors[selectedUser.status]} border-none px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]`}>
                                   {selectedUser.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-8">
                                 <div className="bg-white/5 p-6 rounded-3xl border border-border/20">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-2 tracking-widest">HIÉRARCHIE</p>
                                    <p className="text-xl font-black text-accent uppercase">{selectedUser.role}</p>
                                 </div>
                                 <div className="bg-white/5 p-6 rounded-3xl border border-border/20 col-span-2">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-2 tracking-widest">IDENTIFIANT UNIQUE</p>
                                    <p className="text-sm font-black opacity-40 uppercase tracking-tighter">USER-ID-{selectedUser.id}-ALPHA</p>
                                 </div>
                              </div>
                            </div>

                            <div className="p-10 space-y-12">
                              {/* Modificateur d'État Premium */}
                              <section className="space-y-6">
                                <h3 className="section-title flex items-center gap-3"><Lock className="w-5 h-5 text-accent" /> Protocole de Sécurité</h3>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                   <Card className="p-6 bg-secondary/10 border-none rounded-[2rem] space-y-4 hover:bg-green-500/5 transition-colors cursor-pointer group/stat" onClick={() => handleStatusChange(selectedUser.id, "active")}>
                                      <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 group-hover/stat:scale-110 transition-transform">
                                         <CheckCircle className="w-6 h-6" />
                                      </div>
                                      <div>
                                         <p className="text-sm font-black italic">Restaurer l'Accès</p>
                                         <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Status: ACTIF</p>
                                      </div>
                                   </Card>

                                   <Card className="p-6 bg-secondary/10 border-none rounded-[2rem] space-y-4 hover:bg-red-500/5 transition-colors cursor-pointer group/stat" onClick={() => handleStatusChange(selectedUser.id, "blocked")}>
                                      <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 group-hover/stat:scale-110 transition-transform">
                                         <Ban className="w-6 h-6" />
                                      </div>
                                      <div>
                                         <p className="text-sm font-black italic">Révoquer le Bannissement</p>
                                         <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Status: BLOQUÉ</p>
                                      </div>
                                   </Card>
                                </div>

                                <Separator className="bg-border/20" />

                                <div className="space-y-4 p-8 bg-black/5 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-border/40">
                                   <div className="flex items-center gap-3 mb-2">
                                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                                      <h4 className="text-sm font-black uppercase tracking-widest">Procédure de Suspension</h4>
                                   </div>
                                   <Textarea
                                      placeholder="Explicitez les raisons de la suspension temporaire..."
                                      value={suspendReason}
                                      onChange={(e) => setSuspendReason(e.target.value)}
                                      className="bg-background border-border/40 rounded-2xl"
                                      rows={3}
                                   />
                                   <Button
                                      onClick={() => { if (suspendReason) handleStatusChange(selectedUser.id, "suspended", suspendReason) }}
                                      className="w-full h-12 rounded-xl font-black bg-yellow-600 hover:bg-yellow-700 shadow-xl"
                                      disabled={!suspendReason}
                                   >
                                      SUSPENDRE LE CITOYEN
                                   </Button>
                                </div>
                              </section>

                              <div className="flex justify-end pt-10 border-t border-border/30">
                                <Button variant="ghost" onClick={() => { setSelectedUser(null); setSuspendReason(""); }} className="rounded-xl font-bold">Quitter le Dossier</Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-12 w-12 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all p-0 flex items-center justify-center shadow-lg hover:rotate-6"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-background/95 backdrop-blur-2xl border-border/40 rounded-[2.5rem] shadow-3xl">
                        <AlertDialogTitle className="text-2xl font-black tracking-tight italic">Exclusion Définitive?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground font-medium py-4">
                          Cette action effacera irrévocablement le profil de <span className="text-accent font-black">"{user.name}"</span> de vos registres. Cette action est souveraine et sans retour.
                        </AlertDialogDescription>
                        <div className="flex gap-4 justify-end mt-6">
                          <AlertDialogCancel className="rounded-2xl font-bold border-none bg-secondary/30">Clémence</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-600 hover:bg-red-700 rounded-2xl font-black px-8 shadow-xl shadow-red-500/20"
                          >
                            BANNIR À JAMAIS
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
