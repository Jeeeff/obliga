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
    in_progress: "In Progress",
    submitted: "Submitted",
    under_review: "Under Review",
    approved: "Approved",
    overdue: "Overdue",
    rejected: "Rejected",
    changes_requested: "Changes Requested",
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
    change_avatar: "Change Avatar",
    save_changes: "Save Changes",
    manage_personal_info: "Manage your personal information",
    customize_workspace: "Customize your workspace experience",
    select_theme: "Select your preferred interface theme",
    select_language: "Select your preferred language",
    email_notifications: "Receive email updates about obligations",
    new_obligation: "New Obligation",
    changes_saved: "Changes saved successfully",
    filter_obligations_placeholder: "Filter obligations...",
    due_within_7_days: "Due within 7 days",
    action_required_immediately: "Action required immediately",
    increase_15: "15% increase",
    view_all: "View All",
    coming_soon: "Coming soon",
    reports_description:
      "High-level financial and obligations reports will appear here. For now, you can use the dashboard, obligations, and invoices pages to explore your data.",
    notifications: "Notifications",
    openclaw_details: "Details",
    risk_analysis: "Risk Analysis",
    openclaw_risk_message:
      'High probability of delay detected for "Alvará de Funcionamento" due to recent regulatory changes. Suggest early submission.',
    action_items: "Action Items",
    review_pending_document: "Review pending document",
    estimated_time_5_min: "Estimated time: 5 mins",
    take_action: "Take action",
    recommendations: "Recommendations",
    title: "Title",
    client: "Client",
    type: "Type",
    status_column: "Status",
    due_date: "Due Date",
    actions: "Actions",
    obligation_title_placeholder: "e.g. Monthly VAT",
    due_date_label: "Due Date",
    description: "Description",
    description_placeholder: "Optional details",
    cancel: "Cancel",
    create: "Create",
    creating: "Creating...",
    payment: "Payment",
    document: "Document",
    approval: "Approval",
    add_client: "Add Client",
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
    in_progress: "Em andamento",
    submitted: "Enviado",
    under_review: "Em Análise",
    approved: "Aprovado",
    overdue: "Atrasado",
    rejected: "Rejeitado",
    changes_requested: "Alterações solicitadas",
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
    change_avatar: "Alterar avatar",
    save_changes: "Salvar alterações",
    manage_personal_info: "Gerencie suas informações pessoais",
    customize_workspace: "Personalize sua experiência de trabalho",
    select_theme: "Selecione o tema da interface",
    select_language: "Selecione o idioma preferido",
    email_notifications: "Receba atualizações por e-mail sobre obrigações",
    new_obligation: "Nova obrigação",
    changes_saved: "Alterações salvas com sucesso",
    filter_obligations_placeholder: "Filtrar obrigações...",
    due_within_7_days: "Vence nos próximos 7 dias",
    action_required_immediately: "Ação imediata necessária",
    increase_15: "Aumento de 15%",
    view_all: "Ver todas",
    coming_soon: "Em breve",
    reports_description:
      "Relatórios financeiros e de obrigações de alto nível aparecerão aqui. Por enquanto, use as páginas de painel, obrigações e faturas para explorar seus dados.",
    notifications: "Notificações",
    openclaw_details: "Detalhes",
    risk_analysis: "Análise de risco",
    openclaw_risk_message:
      'Alta probabilidade de atraso detectada para "Alvará de Funcionamento" devido a mudanças regulatórias recentes. Recomenda-se envio antecipado.',
    action_items: "Itens de ação",
    review_pending_document: "Revisar documento pendente",
    estimated_time_5_min: "Tempo estimado: 5 min",
    take_action: "Tomar ação",
    recommendations: "Recomendações",
    title: "Título",
    client: "Cliente",
    type: "Tipo",
    status_column: "Status",
    due_date: "Data de vencimento",
    actions: "Ações",
    obligation_title_placeholder: "Ex.: Imposto mensal",
    due_date_label: "Data de vencimento",
    description: "Descrição",
    description_placeholder: "Detalhes opcionais",
    cancel: "Cancelar",
    create: "Criar",
    creating: "Criando...",
    payment: "Pagamento",
    document: "Documento",
    approval: "Aprovação",
    add_client: "Adicionar cliente",
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
