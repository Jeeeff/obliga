"use client"

import { MessageCircle } from "lucide-react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const whatsappMessage =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
    "Olá, gostaria de agendar uma demonstração do Obliga / tirar uma dúvida sobre a versão gratuita."

  const whatsappLink =
    whatsappNumber &&
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

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
        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-6 right-6 z-[90] inline-flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 shadow-lg hover:bg-emerald-600 transition"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium hidden sm:inline">
              Falar no WhatsApp
            </span>
          </a>
        )}
      </main>
    </div>
  )
}
