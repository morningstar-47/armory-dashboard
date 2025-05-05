"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatsCards } from "@/components/stats-cards"
import { ActivityFeed } from "@/components/activity-feed"

export default function Dashboard() {
  const [language, setLanguage] = useState("en")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header language={language} setLanguage={setLanguage} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
            <StatsCards />
            <ActivityFeed />
          </div>
        </main>
      </div>
    </div>
  )
}
