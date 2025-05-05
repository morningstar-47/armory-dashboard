"use client"

import { ReportsList } from "@/components/reports-list"
import { useLanguage } from "@/contexts/language-context"
import { ProtectedRoute } from "@/components/protected-route"

export default function ReportsPage() {
  const { t } = useLanguage()

  return (
    <ProtectedRoute requiredResource="reports">
      <div className="flex h-screen bg-background">
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
              <h1 className="text-2xl font-bold mb-6">{t("nav.reports")}</h1>
              <ReportsList />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
