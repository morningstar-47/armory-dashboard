"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatsCards } from "@/components/stats-cards"
import { ActivityFeed } from "@/components/activity-feed"
import { useLanguage } from "@/contexts/language-context"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardPage() {
  const { t } = useLanguage()

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
              <h1 className="text-2xl font-bold mb-6">{t("dashboard.title")}</h1>
              <StatsCards />
              <ActivityFeed />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
