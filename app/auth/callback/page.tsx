"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession()

      if (error) {
        console.error("Error during auth callback:", error.message)
        router.push("/auth/login")
        return
      }

      // Redirect to the dashboard
      router.push("/")
    }

    handleAuthCallback()
  }, [router, supabase.auth])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <h2 className="text-xl font-semibold">Processing authentication...</h2>
        <p className="text-zinc-400">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  )
}
