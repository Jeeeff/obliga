"use client"

import { useState, useRef } from "react"
import { useI18n } from "@/lib/i18n"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useStore } from "@/lib/store-context"
import { useToast } from "@/lib/toast-context"

export default function SettingsPage() {
  const { t } = useI18n()
  const { user, updateUserProfile } = useStore()
  const { toast } = useToast()

  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user || saving) return

    const formData = new FormData(event.currentTarget)
    const name = (formData.get("name") as string) || user.name
    const avatar = ((formData.get("avatar") as string) || "").trim() || undefined

    setSaving(true)
    updateUserProfile({ name, avatar })
    toast(t("changes_saved"), "success")
    setSaving(false)
  }

  const handleAvatarUpload = async (file: File) => {
    if (!file) return
    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append("avatar", file)

      const updatedUser = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me/avatar`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization:
              typeof window !== "undefined"
                ? `Bearer ${localStorage.getItem("accessToken") || ""}`
                : "",
          },
        },
      ).then(async (res) => {
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || "Falha ao enviar avatar")
        }
        return res.json()
      })

      updateUserProfile({
        name: updatedUser.name,
        avatar: updatedUser.avatar,
      })
      toast(t("changes_saved"), "success")
    } catch (error) {
      console.error(error)
      toast("Não foi possível enviar o avatar. Tente novamente.", "error")
    } finally {
      setUploadingAvatar(false)
    }
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">{t("settings")}</h2>
        <div className="text-sm text-muted-foreground">Carregando informações do perfil...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">{t("settings")}</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("profile")}</CardTitle>
            <CardDescription>{t("manage_personal_info")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSave}>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                  >
                    {uploadingAvatar ? "Enviando..." : t("change_avatar")}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        void handleAvatarUpload(file)
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Imagem quadrada, até 5MB.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("profile")}</label>
                <Input name="name" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("email")}</label>
                <Input defaultValue={user.email} disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("change_avatar")}</label>
                <Input
                  name="avatar"
                  placeholder="URL do avatar (opcional)"
                  defaultValue={user.avatar}
                />
              </div>
              <Button type="submit" disabled={saving}>
                {t("save_changes")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("workspace")}</CardTitle>
            <CardDescription>{t("customize_workspace")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">{t("theme")}</label>
                <p className="text-xs text-muted-foreground">{t("select_theme")}</p>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">{t("language")}</label>
                <p className="text-xs text-muted-foreground">{t("select_language")}</p>
              </div>
              <LanguageToggle />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">{t("notifications")}</label>
                <p className="text-xs text-muted-foreground">{t("email_notifications")}</p>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsEnabled((v) => !v)}
                className="w-10 h-6 rounded-full relative transition-colors"
                style={{
                  backgroundColor: notificationsEnabled ? "rgb(59 130 246)" : "rgb(229 231 235)",
                }}
              >
                <div
                  className="absolute top-1 h-4 w-4 bg-white rounded-full transition-all"
                  style={{
                    left: notificationsEnabled ? "calc(100% - 1.25rem)" : "0.25rem",
                  }}
                />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
