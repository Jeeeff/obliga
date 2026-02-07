"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Role, Obligation, ObligationStatus, Client, Activity, User } from "./types"
import { api } from "./api"
import { useRouter } from "next/navigation"
import { useToast } from "./toast-context"

interface StoreContextType {
  role: Role
  user: User | null
  obligations: Obligation[]
  clients: Client[]
  activities: Activity[]
  loading: boolean
  logout: () => void
  updateObligationStatus: (id: string, status: ObligationStatus) => Promise<void>
  refreshObligations: () => Promise<void>
  retry: () => Promise<void>
  createClient: (client: Omit<Client, "id" | "status" | "logo">) => Promise<void>
  addActivity: (activity: Activity) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role>("CLIENT")
  const [obligations, setObligations] = useState<Obligation[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  const initialized = React.useRef(false)

  const fetchUser = async () => {
    // Let errors propagate to caller for handling
    const userData = await api.get("/auth/me")
    setUser({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: "https://github.com/shadcn.png", // Mock avatar for now
      role: userData.role,
      tenantName: userData.tenant?.name,
      tenantId: userData.tenantId
    })
    setRole(userData.role)
    return userData
  }

  const fetchObligations = async () => {
    const data = await api.get("/obligations")
    const mapped = data.map((o: any) => ({
      id: o.id,
      title: o.title,
      client: o.client?.name || "Unknown",
      clientId: o.clientId,
      type: o.type,
      dueDate: o.dueDate.split('T')[0],
      status: o.status,
      description: o.description
    }))
    setObligations(mapped)
  }

  const fetchClients = async () => {
    const data = await api.get("/clients")
    const mapped = data.map((c: any) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      logo: "/file.svg",
      status: "Active"
    }))
    setClients(mapped)
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setAuthChecked(true)
        setLoading(false)
        return
      }

      await fetchUser()
      // Only fetch data if user fetch succeeded
      await Promise.all([fetchObligations(), fetchClients()])
      setAuthChecked(true)
    } catch (e: any) {
      console.warn("Data load failed:", e.message)
      setAuthChecked(true)
      
      // Only show toast if it's not a 401 (which redirects) and not an abort
      if (e.message && !e.message.includes("401")) {
         toast("Connection failed. Click retry to try again.", "error")
      }
    } finally {
      setLoading(false)
    }
  }

  // Initial load with guard
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    loadData()
  }, [])

  const retry = async () => {
    // Allow manual retry
    await loadData()
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    // localStorage.removeItem("refreshToken") // Removed for security
    setUser(null)
    setObligations([])
    setClients([])
    router.push("/login")
  }

  const updateObligationStatus = async (id: string, status: ObligationStatus) => {
    // Optimistic update
    setObligations((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    )

    try {
        let endpoint = ""
        if (status === "SUBMITTED") endpoint = `/obligations/${id}/submit`
        else if (status === "APPROVED") endpoint = `/obligations/${id}/approve`
        else if (status === "CHANGES_REQUESTED") endpoint = `/obligations/${id}/request-changes`
        
        if (endpoint) {
            await api.post(endpoint, {})
            toast("Status updated successfully", "success")
        } 
        await fetchObligations() // Refresh to get exact server state
    } catch (e) {
        console.error("Update failed", e)
        toast("Failed to update status", "error")
        // Revert optimistic update (could improve this by storing prev state)
        await fetchObligations()
    }
  }

  const createClient = async (clientData: Omit<Client, "id" | "status" | "logo">) => {
    try {
        await api.post("/clients", clientData)
        toast("Client created successfully", "success")
        await fetchClients()
    } catch (e: any) {
        console.error("Create client failed", e)
        toast(e.message || "Failed to create client", "error")
        throw e // Re-throw to let component know
    }
  }

  const addActivity = (activity: Activity) => {
    setActivities((prev) => [activity, ...prev])
  }

  return (
    <StoreContext.Provider
      value={{
        role,
        user,
        obligations,
        clients,
        activities,
        loading,
        logout,
        updateObligationStatus,
        refreshObligations: fetchObligations,
        retry,
        createClient,
        addActivity,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}