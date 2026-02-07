"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AppShell from "@/components/layout/app-shell"
import { useStore } from "@/lib/store-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex h-screen w-full">
        {/* Sidebar Skeleton */}
        <div className="hidden border-r bg-muted/40 md:block w-[280px]">
           <div className="flex h-full max-h-screen flex-col gap-2">
             <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Skeleton className="h-6 w-32" />
             </div>
             <div className="flex-1 p-4 space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
             </div>
           </div>
        </div>
        {/* Main Content Skeleton */}
        <div className="flex flex-col flex-1">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                <Skeleton className="h-8 w-full max-w-[200px]" />
                <div className="ml-auto">
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </header>
            <main className="flex-1 p-4 lg:p-6">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-[300px]" />
                    <Skeleton className="h-[200px] w-full" />
                </div>
            </main>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return <AppShell>{children}</AppShell>
}
