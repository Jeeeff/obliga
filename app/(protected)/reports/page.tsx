 "use client"

 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
 import { Skeleton } from "@/components/ui/skeleton"
 import { useI18n } from "@/lib/i18n"

 export default function ReportsPage() {
   const { t } = useI18n()

   return (
     <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
         <h2 className="text-3xl font-bold tracking-tight">{t("reports")}</h2>
       </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("coming_soon")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("reports_description")}
          </p>
           <div className="grid gap-4 md:grid-cols-3">
             <div className="space-y-2">
               <Skeleton className="h-4 w-24" />
               <Skeleton className="h-8 w-16" />
               <Skeleton className="h-3 w-32" />
             </div>
             <div className="space-y-2">
               <Skeleton className="h-4 w-28" />
               <Skeleton className="h-8 w-20" />
               <Skeleton className="h-3 w-28" />
             </div>
             <div className="space-y-2">
               <Skeleton className="h-4 w-20" />
               <Skeleton className="h-8 w-24" />
               <Skeleton className="h-3 w-24" />
             </div>
           </div>
         </CardContent>
       </Card>
     </div>
   )
 }
