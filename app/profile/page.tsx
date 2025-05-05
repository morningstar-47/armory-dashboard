"use client"

import { UserProfile } from "@/components/user-profile"
import { useLanguage } from "@/contexts/language-context"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProfilePage() {
  const { t } = useLanguage()

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mx-auto max-w-4xl">
              <h1 className="text-2xl font-bold mb-6">{t("profile.title")}</h1>
              <UserProfile />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
