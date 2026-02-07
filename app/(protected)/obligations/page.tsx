"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, ArrowUpDown, Filter, Eye, Pencil } from "lucide-react"
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

export default function ObligationsPage() {
  const { t } = useI18n()
  const { obligations, loading } = useStore()
  const [filter, setFilter] = useState("")
  const [sort, setSort] = useState<"dueDate" | "client" | "status">("dueDate")

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
        <Button>New Obligation</Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter obligations..."
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
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => setSort("client")}>
                  Client <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => setSort("status")}>
                  Status <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => setSort("dueDate")}>
                  Due Date <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/obligations/${item.id}`} className="flex items-center cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
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
    </div>
  )
}
