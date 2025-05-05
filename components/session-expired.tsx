"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

export function SessionExpired() {
  const { t } = useLanguage()
  const { signOut } = useAuth()
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          signOut()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [signOut])

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="bg-zinc-900 border-zinc-800 shadow-md max-w-md w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-900/30 p-3 rounded-full">
              <Shield className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-center">{t("auth.sessionExpired")}</CardTitle>
          <CardDescription className="text-center">
            You will be redirected to the login page in {countdown} seconds.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={() => {
              signOut()
              router.push("/auth/login")
            }}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {t("auth.login")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
