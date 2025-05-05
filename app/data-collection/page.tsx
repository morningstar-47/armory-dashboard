"use client"

import DataCollectionForm from "@/components/data-collection-form"
import { useLanguage } from "@/contexts/language-context"
import { ProtectedRoute } from "@/components/protected-route"

export default function DataCollectionPage() {
  const { t } = useLanguage()

  return (
    <ProtectedRoute requiredResource="data">
      <div className="flex h-screen bg-background">
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mx-auto max-w-4xl">
              <h1 className="text-2xl font-bold mb-6">{t("nav.data")}</h1>
              <DataCollectionForm />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
