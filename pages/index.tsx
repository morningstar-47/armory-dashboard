"use client"

import { useEffect } from "react"
import { useRouter } from "next/router"

export default function IndexPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the app router version
    router.replace("/dashboard")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Redirecting to dashboard...</p>
    </div>
  )
}
