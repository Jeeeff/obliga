"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useStore } from "@/lib/store-context"
import { useI18n } from "@/lib/i18n"

export default function ClientsPage() {
  const { t } = useI18n()
  const { clients, loading, addClient } = useStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newClientName, setNewClientName] = useState("")

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClientName) return
    addClient({
        id: `c${Date.now()}`,
        name: newClientName,
        email: `${newClientName.toLowerCase().replace(" ", "")}@example.com`,
        logo: newClientName.substring(0, 2).toUpperCase(),
        status: "Active"
    })
    setNewClientName("")
    setShowAddModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("clients")}</h2>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Client
        </Button>
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
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{client.logo}</AvatarFallback>
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
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Obligations</span>
                            <span className="font-medium">12 (3 Pending)</span>
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
                    <CardTitle>Add New Client</CardTitle>
                </CardHeader>
                <form onSubmit={handleAddClient}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Client Name</label>
                            <Input value={newClientName} onChange={(e) => setNewClientName(e.target.value)} placeholder="Company Ltd." required />
                        </div>
                    </CardContent>
                    <div className="flex justify-end gap-2 p-6 pt-0">
                        <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
                        <Button type="submit">Create Client</Button>
                    </div>
                </form>
            </Card>
        </div>
      )}
    </div>
  )
}
