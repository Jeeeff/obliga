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
  addClient: (client: Client) => void
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

  const fetchUser = async () => {
    try {
      const userData = await api.get("/auth/me")
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: "https://github.com/shadcn.png", // Mock avatar for now
        role: userData.role,
        workspaceName: userData.workspace?.name
      })
      setRole(userData.role)
    } catch (e) {
      console.error("Failed to fetch user", e)
      // toast("Failed to fetch user session", "error")
    }
  }

  const fetchObligations = async () => {
    try {
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
    } catch (e) {
      console.error("Failed to fetch obligations", e)
    }
  }

  const fetchClients = async () => {
    try {
      const data = await api.get("/clients")
      const mapped = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        logo: "/file.svg",
        status: "Active"
      }))
      setClients(mapped)
    } catch (e) {
      console.error("Failed to fetch clients", e)
    }
  }

  // Initial load
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken")
      if (token) {
        await fetchUser()
        await Promise.all([fetchObligations(), fetchClients()])
      }
      setLoading(false)
    }
    init()
  }, [])

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

  const addClient = (client: Client) => {
    setClients((prev) => [...prev, client])
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
        addClient,
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