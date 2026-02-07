"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Clock, AlertTriangle, FileText, ArrowRight, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useI18n } from "@/lib/i18n"
import { useStore } from "@/lib/store-context"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function DashboardPage() {
  const { t } = useI18n()
  const { obligations, loading } = useStore()
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [filter, setFilter] = useState("")

  const stats = {
    total: obligations.length,
    pending: obligations.filter((o) => o.status === "PENDING").length,
    atRisk: obligations.filter((o) => o.status === "OVERDUE").length,
    completed: obligations.filter((o) => o.status === "APPROVED").length,
  }

  const filteredObligations = obligations.filter((o) => 
    o.title.toLowerCase().includes(filter.toLowerCase()) || 
    o.client.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 5)

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h2>
        <div className="flex gap-2">
           {/* Actions if any */}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
           Array.from({ length: 4 }).map((_, i) => (
             <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-[60px] mb-2" />
                    <Skeleton className="h-3 w-[120px]" />
                </CardContent>
             </Card>
           ))
        ) : (
            <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("total_obligations")}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pending")}</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Due within 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("at_risk")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.atRisk}</div>
            <p className="text-xs text-muted-foreground">Action required immediately</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("completed")}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">15% increase</p>
          </CardContent>
        </Card>
            </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Main List */}
        <Card className="col-span-1 md:col-span-5">
          <CardHeader>
            <CardTitle>{t("obligations")}</CardTitle>
            <div className="pt-2">
                <Input 
                    placeholder="Filter obligations..." 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="max-w-sm"
                />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                 Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[150px]" />
                                <Skeleton className="h-3 w-[100px]" />
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Skeleton className="h-5 w-[80px] rounded-full" />
                            <Skeleton className="h-3 w-[60px]" />
                        </div>
                    </div>
                 ))
              ) : (
              filteredObligations.map((item) => (
                <Link key={item.id} href={`/obligations/${item.id}`}>
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition", 
                            item.status === "OVERDUE" ? "bg-red-100 text-red-600" : 
                            item.status === "APPROVED" ? "bg-green-100 text-green-600" : "text-primary")}>
                            {item.type === "PAYMENT" && <span className="font-bold">$</span>}
                            {item.type === "DOCUMENT" && <FileText className="h-5 w-5" />}
                            {item.type === "APPROVAL" && <CheckCircle2 className="h-5 w-5" />}
                        </div>
                        <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.client}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <Badge variant={
                            item.status === "PENDING" ? "secondary" :
                            item.status === "OVERDUE" ? "destructive" :
                            item.status === "APPROVED" ? "success" : "outline"
                        }>{t(item.status.toLowerCase().replace(" ", "_"))}</Badge>
                        <span className="text-xs text-muted-foreground">{item.dueDate}</span>
                    </div>
                    </div>
                </Link>
              ))
              )}
              <Button variant="ghost" className="w-full" asChild>
                  <Link href="/obligations">View All</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* OpenClaw Insight */}
        <div className="col-span-1 md:col-span-2">
            <div className="rounded-xl p-[1px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 h-full">
                <Card className="h-full border-none shadow-inner bg-card/95 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent font-bold">
                            {t("openclaw_insight")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Based on your activity, you have <span className="font-bold text-foreground">{stats.atRisk} obligations</span> requiring immediate attention. Your efficiency score is trending up.
                        </p>
                        <div className="space-y-2">
                            <div className="text-xs font-medium uppercase text-muted-foreground">Recommendations</div>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5" />
                                    <span>Prioritize overdue payments for Client A</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5" />
                                    <span>Review document expirations for next week</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-pink-500 mt-1.5" />
                                    <span>Approve pending request #O-123</span>
                                </li>
                            </ul>
                        </div>
                        <Button 
                            className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white border-0"
                            onClick={() => setShowRecommendations(true)}
                        >
                            {t("view_recommendations")}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>

      {/* Recommendations Slide-over Panel */}
      {showRecommendations && (
        <>
            <div 
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[90]" 
                onClick={() => setShowRecommendations(false)}
            />
            <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                className="fixed inset-y-0 right-0 z-[100] w-full max-w-md border-l bg-card p-6 shadow-2xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">{t("openclaw_insight")} - Details</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowRecommendations(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="space-y-6">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            Risk Analysis
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            High probability of delay detected for &quot;Alvará de Funcionamento&quot; due to recent regulatory changes. Suggest early submission.
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <h4 className="font-medium">Action Items</h4>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50 transition">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                    {i}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Review pending document {i}</p>
                                    <p className="text-xs text-muted-foreground">Estimated time: 5 mins</p>
                                    <Button variant="link" className="h-auto p-0 text-xs mt-1">Take action <ArrowRight className="h-3 w-3 ml-1" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </>
      )}
    </div>
  )
}
