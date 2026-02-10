"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, ArrowUpDown, Filter, Eye, Pencil, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useStore } from "@/lib/store-context"
import { useI18n } from "@/lib/i18n"
import { api } from "@/lib/api"
import { ObligationType } from "@/lib/types"

export default function ObligationsPage() {
  const { t } = useI18n()
  const { obligations, clients, loading, role } = useStore()
  const [filter, setFilter] = useState("")
  const [sort, setSort] = useState<"dueDate" | "client" | "status">("dueDate")
  const [showNewModal, setShowNewModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newObligation, setNewObligation] = useState<{
    title: string
    clientId: string
    type: ObligationType
    dueDate: string
    description: string
  }>({
    title: "",
    clientId: "",
    type: "PAYMENT",
    dueDate: "",
    description: ""
  })

  const filteredData = obligations
    .filter(
      (item) =>
        item.title.toLowerCase().includes(filter.toLowerCase()) ||
        item.client.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "dueDate") return a.dueDate.localeCompare(b.dueDate)
      if (sort === "client") return a.client.localeCompare(b.client)
      return a.status.localeCompare(b.status)
    })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("obligations")}</h2>
        {role === "ADMIN" && (
          <Button className="gap-2" onClick={() => setShowNewModal(true)}>
            <Plus className="h-4 w-4" />
            {t("new_obligation")}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder={t("filter_obligations_placeholder")}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">{t("title")}</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => setSort("client")}>
                  {t("client")} <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => setSort("status")}>
                  {t("status_column")} <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => setSort("dueDate")}>
                  {t("due_date")} <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : (
            filteredData.map((item) => (
              <TableRow key={item.id} className="cursor-pointer group">
                <TableCell className="font-medium">
                    <Link href={`/obligations/${item.id}`} className="block w-full h-full group-hover:text-primary transition-colors">
                        {item.title}
                    </Link>
                </TableCell>
                <TableCell>{item.client}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  <Badge variant={
                        item.status === "PENDING" ? "secondary" :
                        item.status === "OVERDUE" ? "destructive" :
                        item.status === "APPROVED" ? "success" : "outline"
                    }>
                    {t(item.status.toLowerCase().replace(" ", "_"))}
                  </Badge>
                </TableCell>
                <TableCell>{item.dueDate}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/obligations/${item.id}`} className="flex items-center cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" /> {t("view_details")}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/obligations/${item.id}`} className="flex items-center cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4" /> {t("edit")}
                            </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
            )}
          </TableBody>
        </Table>
      </div>

      {showNewModal && role === "ADMIN" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-lg border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold">{t("new_obligation")}</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowNewModal(false)} disabled={submitting}>
                ✕
              </Button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (!newObligation.title || !newObligation.clientId || !newObligation.dueDate) return
                setSubmitting(true)
                try {
                  await api.post("/obligations", newObligation)
                  setNewObligation({
                    title: "",
                    clientId: "",
                    type: "PAYMENT",
                    dueDate: "",
                    description: ""
                  })
                  setShowNewModal(false)
                } catch {
                } finally {
                  setSubmitting(false)
                }
              }}
            >
              <div className="px-6 py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("obligations")}</label>
                  <Input
                    value={newObligation.title}
                    onChange={(e) => setNewObligation({ ...newObligation, title: e.target.value })}
                    placeholder={t("obligation_title_placeholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("clients")}</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newObligation.clientId}
                    onChange={(e) => setNewObligation({ ...newObligation, clientId: e.target.value })}
                    required
                  >
                    <option value="">{t("clients")}</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("type")}</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newObligation.type}
                      onChange={(e) =>
                        setNewObligation({ ...newObligation, type: e.target.value as ObligationType })
                      }
                    >
                      <option value="PAYMENT">{t("payment")}</option>
                      <option value="DOCUMENT">{t("document")}</option>
                      <option value="APPROVAL">{t("approval")}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("due_date_label")}</label>
                    <Input
                      type="date"
                      value={newObligation.dueDate}
                      onChange={(e) => setNewObligation({ ...newObligation, dueDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("description")}</label>
                  <Input
                    value={newObligation.description}
                    onChange={(e) => setNewObligation({ ...newObligation, description: e.target.value })}
                    placeholder={t("description_placeholder")}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t px-6 py-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowNewModal(false)}
                  disabled={submitting}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? t("creating") : t("create")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
