"use client"

import { useState, useEffect } from "react"
import { Search, Eye, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Customer {
  id: number
  email: string
  name: string
  createdAt: string
  orderCount?: number
  totalSpent?: string
}

interface Order {
  id: number
  status: string
  totalAmount: string
  createdAt: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerOrders, setCustomerOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers")
      const data = await res.json()
      setCustomers(data)
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerOrders = async (customerId: number) => {
    try {
      const res = await fetch(`/api/customers/${customerId}/orders`)
      const data = await res.json()
      setCustomerOrders(data)
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    fetchCustomerOrders(customer.id)
  }

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-muted-foreground">Gérez vos clients et leur historique</p>
      </div>

      <Card className="mb-6">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Nom</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-center font-semibold">Commandes</th>
                <th className="px-4 py-3 text-right font-semibold">Total dépensé</th>
                <th className="px-4 py-3 text-left font-semibold">Inscrit</th>
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Chargement...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun client trouvé
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 font-semibold">{customer.name}</td>
                    <td className="px-4 py-3 text-sm">{customer.email}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="outline">{customer.orderCount || 0}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {customer.totalSpent ? parseFloat(customer.totalSpent).toFixed(2) : "0.00"} €
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(customer.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(customer)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Historique
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{customer.name} - Historique</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-semibold">{customer.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Inscrit le</p>
                                <p className="font-semibold">
                                  {new Date(customer.createdAt).toLocaleDateString("fr-FR")}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4" />
                                Commandes ({customerOrders.length})
                              </h3>
                              {customerOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Aucune commande</p>
                              ) : (
                                <div className="space-y-2">
                                  {customerOrders.map((order) => (
                                    <div key={order.id} className="flex justify-between items-center p-2 bg-muted rounded">
                                      <div>
                                        <p className="font-semibold">Commande #{order.id}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-semibold">{parseFloat(order.totalAmount).toFixed(2)} €</p>
                                        <Badge variant="outline" className="text-xs">
                                          {order.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
