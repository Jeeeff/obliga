"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import { Invoice } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Send, CreditCard, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function InvoiceDetailsPage() {
  const params = useParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadInvoice(params.id as string)
    }
  }, [params.id])

  const loadInvoice = async (id: string) => {
    try {
      const data = await api.request(`/invoices/${id}`)
      setInvoice(data)
    } catch (error) {
      console.error("Failed to load invoice", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPdf = async () => {
    try {
        // Direct download via browser logic or API blob
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 
            (process.env.NODE_ENV === "production" ? "https://api.obliga.devlogicstudio.cloud" : "http://localhost:3001/api");
            
        const response = await fetch(`${baseUrl}/invoices/${invoice!.id}/pdf`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        
        if (!response.ok) throw new Error('Download failed')
        
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice-${invoice!.id}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
    } catch (error) {
        console.error("PDF Download failed", error)
        alert("Erro ao baixar PDF")
    }
  }

  const handleSendEmail = async () => {
    if (!confirm("Enviar fatura por email para o cliente?")) return
    setProcessing(true)
    try {
      await api.request(`/invoices/${invoice!.id}/send`, { method: "POST" })
      alert("Email enviado com sucesso!")
    } catch (error) {
      console.error("Email send failed", error)
      alert("Erro ao enviar email")
    } finally {
      setProcessing(false)
    }
  }

  const handlePay = async (gateway: string) => {
    if (!invoice) return
    if (!confirm(`Processar pagamento via ${gateway}?`)) return
    setProcessing(true)
    try {
      await api.request(`/invoices/${invoice!.id}/pay`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gateway })
      })
      alert("Pagamento processado com sucesso!")
      loadInvoice(invoice!.id) // Reload to update status
    } catch (error) {
      console.error("Payment failed", error)
      alert("Erro ao processar pagamento")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <div className="p-8"><Skeleton className="h-64 w-full" /></div>
  if (!invoice) return <div className="p-8">Fatura não encontrada</div>

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/invoices">
                <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Fatura #{invoice.id.slice(0, 8)}</h2>
        </div>
        <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleDownloadPdf} disabled={processing}>
                <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
            <Button variant="outline" onClick={handleSendEmail} disabled={processing}>
                <Send className="mr-2 h-4 w-4" /> Enviar Email
            </Button>
            {invoice.status !== 'PAID' && (
                <Button onClick={() => handlePay('stripe')} disabled={processing}>
                    <CreditCard className="mr-2 h-4 w-4" /> Pagar Agora
                </Button>
            )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{invoice.status}</div>
                <p className="text-muted-foreground">Vencimento: {new Date(invoice.dueDate).toLocaleDateString()}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Cliente</CardTitle></CardHeader>
            <CardContent>
                <div className="text-xl font-semibold">{invoice.client?.name}</div>
                <p className="text-muted-foreground">{invoice.client?.email}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Total</CardTitle></CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(invoice.amount))}
                </div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Itens da Fatura</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Preço Unit.</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.price))}</TableCell>
                        <TableCell className="text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * Number(item.price))}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
