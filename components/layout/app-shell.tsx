"use client"

import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar />
      </div>
      <main className="md:pl-72 h-full">
        <Topbar />
        <div className="p-8 h-[calc(100vh-4rem)] overflow-y-auto bg-muted/20">
            {children}
        </div>
      </main>
    </div>
  )
}
