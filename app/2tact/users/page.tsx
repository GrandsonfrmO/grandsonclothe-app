"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Lock, Trash2, CheckCircle, AlertCircle, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/2tact/page-header"

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
  const [statusFilter, setStatusFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [suspendReason, setSuspendReason] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [statusFilter, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter) params.append("status", statusFilter)
      if (roleFilter) params.append("role", roleFilter)
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

  const handleStatusChange = async (userId: number, newStatus: string, reason?: string) => {
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
        fetchUsers()
        setSelectedUser(null)
        setSuspendReason("")
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleDelete = async (userId: number) => {
    try {
      const res = await fetch(`/api/2tact/users/${userId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="p-3 sm:p-4 lg:p-8">
          <PageHeader
            title="Gestion des Utilisateurs"
            description="Gérez les comptes utilisateurs, bloquez ou suspendez les utilisateurs"
            backHref="/2tact/dashboard"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-8">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="suspended">Suspendu</SelectItem>
              <SelectItem value="blocked">Bloqué</SelectItem>
              <SelectItem value="deleted">Supprimé</SelectItem>
            </SelectContent>
          </Select>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Tous les rôles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les rôles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="buyer">Acheteur</SelectItem>
              <SelectItem value="seller">Vendeur</SelectItem>
              <SelectItem value="guest">Invité</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-8 sm:py-12 text-sm">Chargement...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-sm text-muted-foreground">
            Aucun utilisateur trouvé
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredUsers.map((user: User) => (
              <Card key={user.id} className="p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all border-border">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-lg truncate">{user.name}</h3>
                      <Badge className={`${roleColors[user.role]} text-xs`}>
                        {user.role}
                      </Badge>
                      <Badge className={`${statusColors[user.status]} text-xs`}>
                        {statusIcons[user.status]}
                        <span className="ml-1">{user.status}</span>
                      </Badge>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground truncate mb-1">
                      {user.email}
                    </p>

                    {user.suspendReason && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Raison: {user.suspendReason}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground mt-1">
                      Créé: {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                          className="text-xs sm:text-sm"
                        >
                          <Eye className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                          Détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-lg sm:text-xl">Détails de l'utilisateur</DialogTitle>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="space-y-4 sm:space-y-6">
                            {/* User Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <p className="text-xs sm:text-sm text-muted-foreground">Nom</p>
                                <p className="font-medium text-sm">{selectedUser.name}</p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm text-muted-foreground">Email</p>
                                <p className="font-medium text-sm break-all">{selectedUser.email}</p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm text-muted-foreground">Rôle</p>
                                <p className="font-medium text-sm">{selectedUser.role}</p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm text-muted-foreground">Statut</p>
                                <p className="font-medium text-sm">{selectedUser.status}</p>
                              </div>
                            </div>

                            {/* Status Change */}
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground mb-2">Changer le statut</p>
                              <Select
                                value={selectedUser.status}
                                onValueChange={(status: string) => {
                                  if (status === "suspended") {
                                    // Show reason input
                                  } else {
                                    handleStatusChange(selectedUser.id, status)
                                  }
                                }}
                              >
                                <SelectTrigger className="text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Actif</SelectItem>
                                  <SelectItem value="suspended">Suspendu</SelectItem>
                                  <SelectItem value="blocked">Bloqué</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Suspend Reason */}
                            {selectedUser.status === "suspended" && (
                              <div>
                                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Raison de la suspension</p>
                                <Textarea
                                  value={suspendReason}
                                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSuspendReason(e.target.value)}
                                  placeholder="Entrez la raison de la suspension"
                                  className="text-sm"
                                  rows={3}
                                />
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 flex-wrap">
                              {selectedUser.status !== "active" && (
                                <Button
                                  onClick={() => handleStatusChange(selectedUser.id, "active")}
                                  className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                                >
                                  Activer
                                </Button>
                              )}

                              {selectedUser.status !== "suspended" && (
                                <Button
                                  onClick={() => {
                                    if (suspendReason) {
                                      handleStatusChange(selectedUser.id, "suspended", suspendReason)
                                    }
                                  }}
                                  variant="outline"
                                  className="text-xs sm:text-sm"
                                >
                                  <AlertCircle className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                                  Suspendre
                                </Button>
                              )}

                              {selectedUser.status !== "blocked" && (
                                <Button
                                  onClick={() => handleStatusChange(selectedUser.id, "blocked")}
                                  variant="destructive"
                                  className="text-xs sm:text-sm"
                                >
                                  <Ban className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                                  Bloquer
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* Delete Button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-xs sm:text-sm"
                        >
                          <Trash2 className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>Supprimer l'utilisateur?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer "{user.name}"? Cette action ne peut pas être annulée.
                        </AlertDialogDescription>
                        <div className="flex gap-2 justify-end">
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Supprimer
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
