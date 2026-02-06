"use client"

import { mockActivities } from "@/lib/data"
import { useI18n } from "@/lib/i18n"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ActivityPage() {
  const { t } = useI18n()

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">{t("activity")}</h2>
      
      <Card>
        <CardHeader>
            <CardTitle>Global Activity</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-8">
                {mockActivities.concat(mockActivities).map((activity, i) => ( // Duplicate for more data
                    <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                        <Avatar>
                            <AvatarImage src={activity.userAvatar} />
                            <AvatarFallback>{activity.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="text-sm">
                                <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium text-primary">{activity.target}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
