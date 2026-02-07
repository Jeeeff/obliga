"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Language = "en" | "pt"

type I18nContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Sidebar
    dashboard: "Dashboard",
    clients: "Clients",
    obligations: "Obligations",
    activity: "Activity",
    invoices: "Invoices",
    reports: "Reports",
    settings: "Settings",
    
    // Status
    pending: "Pending",
    submitted: "Submitted",
    under_review: "Under Review",
    approved: "Approved",
    overdue: "Overdue",
    at_risk: "At Risk",
    completed: "Completed",
    
    // Dashboard
    total_obligations: "Total Obligations",
    view_recommendations: "View recommendations",
    openclaw_insight: "OpenClaw Insight",
    
    // Actions
    mark_as_submitted: "Mark as Submitted",
    approve: "Approve",
    request_changes: "Request Changes",
    sign_in: "Sign in",
    email: "Email",
    password: "Password",
    welcome_back: "Welcome back",
    enter_credentials: "Enter your credentials to access your account",
    
    // General
    search: "Search...",
    theme: "Theme",
    language: "Language",
    profile: "Profile",
    workspace: "Workspace",
    logout: "Log out",
  },
  pt: {
    // Sidebar
    dashboard: "Painel",
    clients: "Clientes",
    obligations: "Obrigações",
    activity: "Atividade",
    invoices: "Faturas",
    reports: "Relatórios",
    settings: "Configurações",
    
    // Status
    pending: "Pendente",
    submitted: "Enviado",
    under_review: "Em Análise",
    approved: "Aprovado",
    overdue: "Atrasado",
    at_risk: "Em Risco",
    completed: "Concluído",
    
    // Dashboard
    total_obligations: "Total de Obrigações",
    view_recommendations: "Ver recomendações",
    openclaw_insight: "Insight OpenClaw",
    
    // Actions
    mark_as_submitted: "Marcar como Enviado",
    approve: "Aprovar",
    request_changes: "Solicitar Alterações",
    sign_in: "Entrar",
    email: "E-mail",
    password: "Senha",
    welcome_back: "Bem-vindo de volta",
    enter_credentials: "Insira suas credenciais para acessar sua conta",
    
    // General
    search: "Buscar...",
    theme: "Tema",
    language: "Idioma",
    profile: "Perfil",
    workspace: "Espaço de Trabalho",
    logout: "Sair",
  },
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && (saved === "en" || saved === "pt")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(saved)
    }
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string) => {
    return translations[language][key] || key
  }

  if (!mounted) {
    return null
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
