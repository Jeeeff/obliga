import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/lib/i18n"
import { StoreProvider } from "@/lib/store-context"
import { ToastProvider } from "@/lib/toast-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DevLogic Obliga",
  description: "SaaS for Obligation Management",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <ToastProvider>
              <StoreProvider>{children}</StoreProvider>
            </ToastProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
