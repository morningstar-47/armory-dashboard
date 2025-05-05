"use client"

import { IntelligenceMap } from "@/components/intelligence-map"
import { useLanguage } from "@/contexts/language-context"
import { ProtectedRoute } from "@/components/protected-route"

export default function MapPage() {
  const { t } = useLanguage()

  return (
    <ProtectedRoute requiredResource="map">
      <div className="flex h-screen bg-background">
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-hidden p-4 md:p-6">
            <div className="mx-auto h-full max-w-7xl flex flex-col">
              <h1 className="text-2xl font-bold mb-4">{t("nav.map")}</h1>
              <div className="flex-1 min-h-0">
                <IntelligenceMap />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
