"use client"

import { Shield, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"

export function AccessDenied() {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="bg-zinc-900 border-zinc-800 shadow-md max-w-md w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-900/30 p-3 rounded-full">
              <Shield className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            {t("permissions.accessDenied")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-zinc-400">{t("permissions.noAccess")}</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              {t("permissions.goBack")}
            </Button>
            <Button onClick={() => router.push("/")} className="bg-emerald-600 hover:bg-emerald-700">
              {t("permissions.dashboard")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
