"use client"

import { useState } from "react"
import { Plus, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useStore } from "@/lib/store-context"
import { useI18n } from "@/lib/i18n"

import { api } from "@/lib/api"
import { ObligationType } from "@/lib/types"

export default function ClientsPage() {
  const { t } = useI18n()
  const { clients, loading, createClient, role } = useStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newClientName, setNewClientName] = useState("")
  const [newClientEmail, setNewClientEmail] = useState("")
  const [newClientCnpj, setNewClientCnpj] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Obligation Modal State
  const [showObligationModal, setShowObligationModal] = useState(false)
  const [newObligation, setNewObligation] = useState<{
    title: string
    clientId: string
    type: "PAYMENT" | "DOCUMENT" | "APPROVAL"
    dueDate: string
    description: string
  }>({
    title: "",
    clientId: "",
    type: "PAYMENT",
    dueDate: "",
    description: ""
  })

  const handleCreateObligation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newObligation.title || !newObligation.clientId || !newObligation.dueDate) return

    setSubmitting(true)
    try {
        await api.post("/obligations", newObligation)
        // toast("Obligation created", "success") // Assumes toast is available or use console
        setNewObligation({
            title: "",
            clientId: "",
            type: "PAYMENT",
            dueDate: "",
            description: ""
        })
        setShowObligationModal(false)
    } catch (error) {
        console.error(error)
    } finally {
        setSubmitting(false)
    }
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClientName) return
    
    setSubmitting(true)
    try {
      await createClient({
        name: newClientName,
        email: newClientEmail,
      })
      setNewClientName("")
      setNewClientEmail("")
      setNewClientCnpj("")
      setShowAddModal(false)
    } catch {
      // Error handled in store
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("clients")}</h2>
        {role === "ADMIN" && (
            <div className="flex gap-2">
                <Button onClick={() => setShowObligationModal(true)} variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" /> Add Obligation
                </Button>
                <Button onClick={() => setShowAddModal(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> {t("add_client")}
                </Button>
            </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
             Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm h-[140px] p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-[120px]" />
                            <Skeleton className="h-3 w-[150px]" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                </div>
             ))
        ) : (
            clients.map((client) => (
                <Card key={client.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{client.logo || client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <CardTitle className="text-base">{client.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                        <Badge variant={client.status === "Active" ? "success" : "secondary"}>
                            {client.status}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>CNPJ</span>
                            <span className="font-medium">Disponível a partir do plano Essencial</span>
                        </div>
                    </CardContent>
                </Card>
            ))
        )}
      </div>

      {/* Simple Modal for Add Client */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Card className="w-full max-w-md shadow-lg border">
                <CardHeader>
                    <CardTitle>{t("add_client")}</CardTitle>
                </CardHeader>
                <form onSubmit={handleAddClient}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nome do cliente</label>
                            <Input
                              value={newClientName}
                              onChange={(e) => setNewClientName(e.target.value)}
                              placeholder="Empresa Exemplo Ltda."
                              required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">E-mail (opcional)</label>
                            <Input
                              value={newClientEmail}
                              onChange={(e) => setNewClientEmail(e.target.value)}
                              placeholder="contato@empresa.com"
                              type="email"
                            />
                        </div>
                        <div className="space-y-1 border-t pt-4">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium flex items-center gap-2">
                              CNPJ
                              <Lock className="h-3 w-3 text-muted-foreground" />
                            </label>
                            <span className="text-[10px] uppercase text-muted-foreground">
                              Disponível a partir do plano Essencial
                            </span>
                          </div>
                          <Input
                            value={newClientCnpj}
                            onChange={(e) => setNewClientCnpj(e.target.value)}
                            placeholder="00.000.000/0001-00"
                            disabled
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium flex items-center gap-2">
                              Dados fiscais avançados
                              <Lock className="h-3 w-3 text-muted-foreground" />
                            </label>
                            <span className="text-[10px] uppercase text-muted-foreground">
                              Disponível nos planos Essencial e acima
                            </span>
                          </div>
                          <Input
                            placeholder="Inscrição estadual, regime tributário, etc."
                            disabled
                          />
                        </div>
                    </CardContent>
                    <div className="flex justify-between items-center gap-2 p-6 pt-0">
                        <div className="text-xs text-muted-foreground">
                          Campos fiscais completos estarão disponíveis na sua primeira versão paga.
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)} disabled={submitting}>
                            Cancelar
                          </Button>
                          <Button type="submit" disabled={submitting}>
                              {submitting ? "Criando..." : "Criar cliente"}
                          </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
      )}

      {/* Simple Modal for Add Obligation */}
      {showObligationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Card className="w-full max-w-md shadow-lg border">
                <CardHeader>
                    <CardTitle>Create Obligation</CardTitle>
                </CardHeader>
                <form onSubmit={handleCreateObligation}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input 
                                value={newObligation.title} 
                                onChange={(e) => setNewObligation({...newObligation, title: e.target.value})} 
                                placeholder="e.g. Monthly VAT" 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Client</label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={newObligation.clientId}
                                onChange={(e) => setNewObligation({...newObligation, clientId: e.target.value})}
                                required
                            >
                                <option value="">Select Client</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newObligation.type}
                                    onChange={(e) => setNewObligation({...newObligation, type: e.target.value as ObligationType})}
                                >
                                    <option value="PAYMENT">Payment</option>
                                    <option value="DOCUMENT">Document</option>
                                    <option value="APPROVAL">Approval</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Due Date</label>
                                <Input 
                                    type="date"
                                    value={newObligation.dueDate} 
                                    onChange={(e) => setNewObligation({...newObligation, dueDate: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Input 
                                value={newObligation.description} 
                                onChange={(e) => setNewObligation({...newObligation, description: e.target.value})} 
                                placeholder="Optional details" 
                            />
                        </div>
                    </CardContent>
                    <div className="flex justify-end gap-2 p-6 pt-0">
                        <Button type="button" variant="ghost" onClick={() => setShowObligationModal(false)} disabled={submitting}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Creating..." : "Create Obligation"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
      )}
    </div>
  )
}
