"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const { t } = useLanguage()
  const router = useRouter()

  // Automatically redirect to login after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/login")
    }, 5000) // 5 seconds

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-zinc-900 p-3">
            <Shield className="h-10 w-10 text-emerald-500" />
          </div>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">{t("auth.registrationRestricted")}</CardTitle>
            <CardDescription className="text-center">{t("auth.adminOnlyRegistration")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 bg-amber-900/20 border-amber-900/50">
              <AlertDescription>{t("auth.contactAdminForAccount")}</AlertDescription>
            </Alert>
            <p className="text-center text-sm text-zinc-400 mb-4">{t("auth.redirectingToLogin")}</p>
            <Button onClick={() => router.push("/auth/login")} className="w-full bg-emerald-600 hover:bg-emerald-700">
              {t("auth.goToLogin")}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              {t("auth.alreadyHaveAccount")}{" "}
              <Link href="/auth/login" className="text-emerald-500 hover:text-emerald-400 transition-colors">
                {t("auth.login")}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
