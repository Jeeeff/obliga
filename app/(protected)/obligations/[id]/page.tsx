"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar, CheckCircle, Paperclip, Send, User, ChevronRight, FileText, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStore } from "@/lib/store-context"
import { mockUsers, mockActivities } from "@/lib/data"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export default function ObligationDetailPage() {
  const params = useParams()
  const { t } = useI18n()
  const { obligations, role, updateObligationStatus } = useStore()
  const id = params.id as string
  const obligation = obligations.find((o) => o.id === id)
  
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([
    { id: 1, user: mockUsers[1], text: "Please review the attached documents.", time: "2 hours ago" }
  ])

  if (!obligation) {
    return <div className="p-8 text-center">Obligation not found</div>
  }

  const steps = ["PENDING", "SUBMITTED", "UNDER_REVIEW", "APPROVED"]
  // Map statuses to steps indices
  const getStepIndex = (status: string) => {
    if (status === "CHANGES_REQUESTED") return 0 // Back to start? Or 1? Prompt says "CHANGES_REQUESTED -> PENDING" for Admin action. So effectively back to Pending.
    if (status === "OVERDUE") return 0
    return steps.findIndex(s => s === status)
  }
  
  const activeStep = getStepIndex(obligation.status)
  
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    setComments([...comments, { id: Date.now(), user: mockUsers[0], text: comment, time: "Just now" }])
    setComment("")
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-start">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>Obligations</span>
            <ChevronRight className="h-4 w-4" />
            <span>{obligation.id}</span>
          </div>
          <h1 className="text-3xl font-bold">{obligation.title}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{obligation.client}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Due: {obligation.dueDate}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <Badge className="text-base px-4 py-1" variant={
                 obligation.status === "PENDING" ? "secondary" :
                 obligation.status === "OVERDUE" ? "destructive" :
                 obligation.status === "APPROVED" ? "success" : "outline"
            }>
                {t(obligation.status.toLowerCase().replace(" ", "_"))}
            </Badge>
        </div>
      </div>

      {/* Stepper */}
      <Card>
        <CardContent className="pt-6">
            <div className="relative flex justify-between">
                {steps.map((step, index) => (
                    <div key={step} className="flex flex-col items-center relative z-10 w-full">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                            index <= activeStep && activeStep !== -1 ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted-foreground text-muted-foreground"
                        )}>
                            {index < activeStep ? <CheckCircle className="h-5 w-5" /> : index + 1}
                        </div>
                        <span className={cn("text-xs mt-2 font-medium uppercase", index <= activeStep && activeStep !== -1 ? "text-foreground" : "text-muted-foreground")}>
                            {step.replace("_", " ")}
                        </span>
                        {index < steps.length - 1 && (
                            <div className={cn(
                                "absolute top-4 left-1/2 w-full h-[2px] -z-10",
                                index < activeStep ? "bg-primary" : "bg-muted"
                            )} />
                        )}
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            {/* Description & Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        {obligation.description || "No description provided."}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Type:</span> <span className="font-medium">{obligation.type}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Assigned to:</span> <span className="font-medium">{obligation.assignedTo || "Unassigned"}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Attachments</CardTitle>
                    <Button size="sm" variant="outline" className="gap-2">
                        <Upload className="h-4 w-4" /> Upload
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                            <div className="flex items-center gap-3">
                                <FileText className="h-8 w-8 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium">Invoice_Jan_2026.pdf</p>
                                    <p className="text-xs text-muted-foreground">2.4 MB • Uploaded 2 days ago</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
                        </div>
                        {/* Mock empty state if needed */}
                    </div>
                </CardContent>
            </Card>

            {/* Comments */}
            <Card>
                <CardHeader>
                    <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        {comments.map((c) => (
                            <div key={c.id} className="flex gap-4">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={c.user.avatar} />
                                    <AvatarFallback>{c.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="bg-muted/50 p-3 rounded-lg flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold text-sm">{c.user.name}</span>
                                        <span className="text-xs text-muted-foreground">{c.time}</span>
                                    </div>
                                    <p className="text-sm">{c.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleAddComment} className="flex gap-2">
                        <Input 
                            placeholder="Add a comment..." 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
                    </form>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            {/* Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {/* CLIENT ACTIONS */}
                    {role === "CLIENT" && (
                        <>
                            {(obligation.status === "PENDING" || obligation.status === "CHANGES_REQUESTED" || obligation.status === "OVERDUE") ? (
                                <Button 
                                    className="w-full gap-2" 
                                    onClick={() => updateObligationStatus(obligation.id, "SUBMITTED")}
                                >
                                    <CheckCircle className="h-4 w-4" /> {t("mark_as_submitted")}
                                </Button>
                            ) : (
                                <div className="p-3 bg-muted rounded-lg flex items-center gap-3 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Submitted — awaiting review
                                </div>
                            )}
                        </>
                    )}

                    {/* ADMIN ACTIONS */}
                    {role === "ADMIN" && (
                        <>
                            {(obligation.status === "SUBMITTED" || obligation.status === "UNDER_REVIEW") ? (
                                <>
                                    <Button 
                                        className="w-full gap-2 bg-green-600 hover:bg-green-700" 
                                        onClick={() => updateObligationStatus(obligation.id, "APPROVED")}
                                    >
                                        <CheckCircle className="h-4 w-4" /> {t("approve")}
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => updateObligationStatus(obligation.id, "CHANGES_REQUESTED")}
                                    >
                                        <AlertCircle className="h-4 w-4" /> {t("request_changes")}
                                    </Button>
                                </>
                            ) : (
                                <div className="text-sm text-muted-foreground text-center italic">
                                    {obligation.status === "APPROVED" ? "This obligation is approved." : "Waiting for client submission."}
                                </div>
                            )}
                            {/* Allow Admin to reset if Changes Requested? Prompt says: CHANGES_REQUESTED -> PENDING */}
                            {obligation.status === "CHANGES_REQUESTED" && (
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="w-full mt-2"
                                    onClick={() => updateObligationStatus(obligation.id, "PENDING")}
                                >
                                    Reset to Pending
                                </Button>
                            )}
                        </>
                    )}
                    
                    <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                        <p>Current Role: <span className="font-bold">{role}</span></p>
                        <p className="opacity-70 mt-1">
                            {role === "CLIENT" ? "Submit work for review." : "Review and approve client submissions."}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle>Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative border-l border-muted pl-4 space-y-6">
                        {mockActivities.slice(0, 3).map((activity) => (
                            <div key={activity.id} className="relative">
                                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-muted-foreground" />
                                <p className="text-sm">
                                    <span className="font-medium">{activity.user}</span> {activity.action}
                                </p>
                                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
