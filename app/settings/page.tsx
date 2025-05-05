"use client"

import { SettingsPanel } from "@/components/settings-panel"
import { PermissionsManagement } from "@/components/permissions-management"
import { useLanguage } from "@/contexts/language-context"
import { usePermissions } from "@/contexts/permissions-context"
import { ProtectedRoute } from "@/components/protected-route"

export default function SettingsPage() {
  const { t } = useLanguage()
  const { can } = usePermissions()

  return (
    <ProtectedRoute requiredResource="settings">
      <div className="flex h-screen bg-background">
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
              <h1 className="text-2xl font-bold mb-6">{t("nav.settings")}</h1>
              <div className="space-y-6">
                <SettingsPanel />

                {can("users:manage") && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">{t("permissions.title")}</h2>
                    <PermissionsManagement />
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
