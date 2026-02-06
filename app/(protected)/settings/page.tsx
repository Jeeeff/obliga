"use client"

import { useI18n } from "@/lib/i18n"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockUsers } from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"

export default function SettingsPage() {
  const { t } = useI18n()
  const user = mockUsers[0]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">{t("settings")}</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>{t("profile")}</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Avatar</Button>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue={user.email} disabled />
                </div>
                <Button>Save Changes</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your workspace experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium">Theme</label>
                        <p className="text-xs text-muted-foreground">Select your preferred interface theme</p>
                    </div>
                    <ThemeToggle />
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium">Language</label>
                        <p className="text-xs text-muted-foreground">Select your preferred language</p>
                    </div>
                    <LanguageToggle />
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium">Notifications</label>
                        <p className="text-xs text-muted-foreground">Receive email updates about obligations</p>
                    </div>
                    {/* Mock Switch */}
                    <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
