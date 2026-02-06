"use client"

import * as React from "react"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const { language, setLanguage } = useI18n()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-12 font-bold"
      onClick={() => setLanguage(language === "en" ? "pt" : "en")}
    >
      {language.toUpperCase()}
    </Button>
  )
}
