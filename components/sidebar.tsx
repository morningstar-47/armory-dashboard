"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FileText, AlertTriangle, Database, Settings, Shield, Map, Users, ClipboardList } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { usePermissions } from "@/contexts/permissions-context"

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { canAccess } = usePermissions()

  // Define all navigation items with their permission requirements
  const allNavItems = [
    { name: t("nav.dashboard"), href: "/", icon: BarChart3, resource: "dashboard" },
    { name: t("nav.reports"), href: "/reports", icon: FileText, resource: "reports" },
    { name: t("nav.alerts"), href: "/alerts", icon: AlertTriangle, resource: "alerts" },
    { name: t("nav.map"), href: "/map", icon: Map, resource: "map" },
    { name: t("nav.data"), href: "/data-collection", icon: Database, resource: "data" },
    { name: t("nav.users"), href: "/users", icon: Users, resource: "users" },
    { name: t("nav.audit"), href: "/audit", icon: ClipboardList, resource: "audit" },
    { name: t("nav.settings"), href: "/settings", icon: Settings, resource: "settings" },
  ]

  // Filter navigation items based on user permissions
  const navItems = allNavItems.filter((item) => canAccess(item.resource as any))

  return (
    <div className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800">
      <div className="flex items-center h-16 px-4 border-b border-zinc-800">
        <Shield className="h-6 w-6 text-emerald-500 mr-2" />
        <span className="text-lg font-bold text-white">ARMORY</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center px-3 py-2 text-sm text-zinc-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
          <span>{t("common.status")}</span>
        </div>
      </div>
    </div>
  )
}
