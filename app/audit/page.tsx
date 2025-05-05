"use client"

import { AuditLogs } from "@/components/audit-logs"
import { useLanguage } from "@/contexts/language-context"
import { ProtectedRoute } from "@/components/protected-route"

export default function AuditPage() {
  const { t } = useLanguage()

  return (
    <ProtectedRoute requiredPermission="audit:view">
      <div className="flex h-screen bg-background">
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
              <h1 className="text-2xl font-bold mb-6">{t("audit.title")}</h1>
              <AuditLogs />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
