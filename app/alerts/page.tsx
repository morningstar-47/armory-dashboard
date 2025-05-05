"use client"

import { AlertsPanel } from "@/components/alerts-panel"
import { useLanguage } from "@/contexts/language-context"
import { ProtectedRoute } from "@/components/protected-route"

export default function AlertsPage() {
  const { t } = useLanguage()

  return (
    <ProtectedRoute requiredResource="alerts">
      <div className="flex h-screen bg-background">
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
              <h1 className="text-2xl font-bold mb-6">{t("nav.alerts")}</h1>
              <AlertsPanel />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
