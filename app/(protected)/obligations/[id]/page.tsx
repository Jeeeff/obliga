"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar, CheckCircle, Send, User, ChevronRight, FileText, Upload, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useStore } from "@/lib/store-context"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { Obligation, Comment, Attachment, Activity, ObligationStatus } from "@/lib/types"
import { formatStatus, formatType } from "@/lib/mappers"
import { useToast } from "@/lib/toast-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function ObligationDetailPage() {
  const params = useParams()
  // const { t } = useI18n()
  const { role, updateObligationStatus } = useStore()
  const { toast } = useToast()
  const id = params.id as string
  const router = useRouter()

  const [obligation, setObligation] = useState<Obligation | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [uploading, setUploading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
        setLoading(true)
        const results = await Promise.allSettled([
            api.get(`/obligations/${id}`),
            api.get(`/obligations/${id}/comments`),
            api.get(`/obligations/${id}/attachments`),
            api.get(`/activity?entityType=OBLIGATION&entityId=${id}`)
        ])

        const obResult = results[0]
        const commentsResult = results[1]
        const attachmentsResult = results[2]
        const activityResult = results[3]

        if (obResult.status === 'rejected') {
            throw obResult.reason
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obData = obResult.value as any

        // Map client name if it's an object in obData
        const ob: Obligation = {
            ...obData,
            client: obData.client?.name || "Unknown",
            dueDate: obData.dueDate.split('T')[0]
        }

        setObligation(ob)
        setComments(commentsResult.status === 'fulfilled' ? commentsResult.value as Comment[] : [])
        setAttachments(attachmentsResult.status === 'fulfilled' ? attachmentsResult.value as Attachment[] : [])
        setActivities(activityResult.status === 'fulfilled' ? activityResult.value as Activity[] : [])
    } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as any
        console.error("Failed to load obligation details", err)
        toast(err.message || "Failed to load details", "error")
        if (err.message?.includes("403") || err.status === 403) {
            router.push("/dashboard")
        }
    } finally {
        setLoading(false)
    }
  }, [id, router, toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
        await api.post(`/obligations/${id}/comments`, { message: commentText })
        setCommentText("")
        // Refresh comments
        const newComments = await api.get(`/obligations/${id}/comments`)
        setComments(newComments)
        toast("Comment added", "success")
    } catch {
        toast("Failed to add comment", "error")
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("file", file)

    setUploading(true)
    try {
        await api.post(`/obligations/${id}/attachments`, formData)
        toast("File uploaded successfully", "success")
        // Refresh attachments
        const newAttachments = await api.get(`/obligations/${id}/attachments`)
        setAttachments(newAttachments)
    } catch (error) {
        console.error(error)
        toast("Failed to upload file", "error")
    } finally {
        setUploading(false)
        // Reset input
        e.target.value = ""
    }
  }

  const handleReset = async () => {
      if (!confirm("Are you sure you want to reset this obligation to PENDING?")) return
      try {
          await api.post(`/obligations/${id}/reset`, {})
          toast("Obligation reset to Pending", "success")
          fetchData()
      } catch {
          toast("Failed to reset obligation", "error")
      }
  }

  const handleStatusChange = async (status: ObligationStatus) => {
      await updateObligationStatus(id, status)
      fetchData()
  }

  if (loading) {
      return <div className="p-8 space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-64 w-full" />
      </div>
  }

  if (!obligation) {
    return <div className="p-8 text-center">Obligation not found</div>
  }

  const steps = ["PENDING", "SUBMITTED", "UNDER_REVIEW", "APPROVED"]
  const getStepIndex = (status: string) => {
    if (status === "CHANGES_REQUESTED" || status === "OVERDUE") return 0
    return steps.findIndex(s => s === status)
  }
  
  const activeStep = getStepIndex(obligation.status)
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-start">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span className="cursor-pointer hover:underline" onClick={() => router.push('/dashboard')}>Obligations</span>
            <ChevronRight className="h-4 w-4" />
            <span>{obligation.id.substring(0, 8)}...</span>
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
            <Badge variant="outline">{formatType(obligation.type)}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <Badge className="text-base px-4 py-1" variant={
                 obligation.status === "PENDING" ? "secondary" :
                 obligation.status === "OVERDUE" ? "destructive" :
                 obligation.status === "APPROVED" ? "success" : "outline"
            }>
                {formatStatus(obligation.status)}
            </Badge>
            
            {role === "ADMIN" && obligation.status !== "PENDING" && (
                <Button variant="outline" size="sm" onClick={handleReset}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Reset
                </Button>
            )}

            {/* Action Buttons based on status/role could go here, but Stepper handles flow mostly */}
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
                            {formatStatus(step as ObligationStatus)}
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
            
            {/* Contextual Actions */}
            <div className="mt-6 flex justify-end">
                {role === "CLIENT" && obligation.status === "PENDING" && (
                    <Button onClick={() => handleStatusChange("SUBMITTED")}>Submit for Review</Button>
                )}
                {role === "ADMIN" && obligation.status === "SUBMITTED" && (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleStatusChange("CHANGES_REQUESTED")}>Request Changes</Button>
                        <Button onClick={() => handleStatusChange("APPROVED")}>Approve</Button>
                    </div>
                )}
            </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Description & Attachments */}
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{obligation.description || "No description provided."}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Attachments</CardTitle>
                    <div className="relative">
                        <input 
                            type="file" 
                            id="file-upload" 
                            className="hidden" 
                            onChange={handleFileUpload} 
                            disabled={uploading}
                        />
                        <Button size="sm" variant="outline" className="cursor-pointer" asChild disabled={uploading}>
                            <label htmlFor="file-upload">
                                {uploading ? <div className="animate-spin h-4 w-4 border-2 border-current rounded-full mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                                Upload
                            </label>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {attachments.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No attachments yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {attachments.map(att => (
                                <div key={att.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded">
                                            <FileText className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{att.fileName}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(att.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild>
                                        <a href={`${api.BASE_URL || ''}/attachments/${att.id}/download`} target="_blank" rel="noopener noreferrer">
                                            Download
                                        </a>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {activities.map(act => (
                            <div key={act.id} className="flex gap-3 text-sm">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{act.user?.name?.substring(0, 2).toUpperCase() || "SY"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p>
                                        <span className="font-medium">{act.user?.name || "System"}</span>{" "}
                                        <span className="text-muted-foreground">{act.action.toLowerCase().replace('_', ' ')}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">{new Date(act.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                        {activities.length === 0 && <p className="text-sm text-muted-foreground">No activity recorded.</p>}
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Comments */}
        <div className="space-y-6">
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-2">
                        {comments.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center my-8">No comments yet. Start the conversation!</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="flex gap-3">
                                    <Avatar className="h-8 w-8 mt-1">
                                        <AvatarFallback>{comment.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted/50 p-3 rounded-lg flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-sm">{comment.user.name}</span>
                                            <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <p className="text-sm">{comment.message}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <form onSubmit={handleAddComment} className="mt-4 pt-4 border-t flex gap-2">
                        <Input 
                            placeholder="Type a comment..." 
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={!commentText.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
