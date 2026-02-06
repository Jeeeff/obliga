"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, CheckSquare, Activity, FileText, Settings, Hexagon } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useStore } from "@/lib/store-context"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useI18n()
  const { user } = useStore()

  const routes = [
    {
      label: t("dashboard"),
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: t("clients"),
      icon: Users,
      href: "/clients",
      color: "text-violet-500",
    },
    {
      label: t("obligations"),
      icon: CheckSquare,
      href: "/obligations",
      color: "text-pink-700",
    },
    {
      label: t("activity"),
      icon: Activity,
      href: "/activity",
      color: "text-orange-700",
    },
    {
      label: t("reports"),
      icon: FileText,
      href: "/reports", // Mock route
      color: "text-emerald-500",
    },
    {
      label: t("settings"),
      icon: Settings,
      href: "/settings",
      color: "text-gray-500",
    },
  ]

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-50 dark:bg-card text-slate-900 dark:text-card-foreground border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 mr-4">
            <Hexagon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Obliga
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href || pathname.startsWith(route.href + "/")
                  ? "bg-primary/10 text-primary shadow-[0_0_10px_rgba(59,130,246,0.1)] border-l-4 border-primary"
                  : "text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 border-t">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-sm font-medium truncate">{user?.workspaceName || "Obliga"}</p>
            <p className="text-xs text-muted-foreground">v0.1.0</p>
        </div>
      </div>
    </div>
  )
}
