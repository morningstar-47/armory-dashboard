"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, Lock, BarChart3, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"

export default function LandingPage() {
  const { t } = useLanguage()
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-emerald-500 mr-2" />
            <span className="text-xl font-bold">ARMORY</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/auth/login")}>
              {t("auth.login")}
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push("/auth/register")}>
              {t("auth.register")}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Advanced Military Intelligence <span className="text-emerald-500">Platform</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-10">
            Secure, real-time intelligence gathering and analysis for military operations and strategic decision-making.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-lg"
              onClick={() => router.push("/auth/register")}
            >
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/auth/login")}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-zinc-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700">
              <div className="bg-emerald-900/30 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Communications</h3>
              <p className="text-zinc-400">
                End-to-end encrypted communications with multi-factor authentication and role-based access control.
              </p>
            </div>
            <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700">
              <div className="bg-emerald-900/30 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
              <p className="text-zinc-400">
                Advanced data visualization and analytics tools for intelligence processing and threat assessment.
              </p>
            </div>
            <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700">
              <div className="bg-emerald-900/30 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Intelligence</h3>
              <p className="text-zinc-400">
                Interactive mapping and geospatial analysis for tracking assets and monitoring global threats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-zinc-800 bg-zinc-900">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-emerald-500 mr-2" />
              <span className="font-bold">ARMORY</span>
            </div>
            <div className="text-zinc-400 text-sm">© {new Date().getFullYear()} Armory. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
