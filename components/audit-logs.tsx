"use client"

import { useState } from "react"
import { Search, Download, User, Clock, FileText, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { usePermissions } from "@/contexts/permissions-context"

// Mock audit log data
const auditLogs = [
  {
    id: "log-001",
    user: "Alexander Mitchell",
    userId: "1",
    action: "login",
    resource: "system",
    timestamp: "2023-07-21T08:42:13Z",
    ipAddress: "192.168.1.1",
    details: "User logged in successfully",
  },
  {
    id: "log-002",
    user: "Sarah Chen",
    userId: "2",
    action: "view",
    resource: "reports",
    timestamp: "2023-07-21T09:15:22Z",
    ipAddress: "192.168.1.2",
    details: "User viewed intelligence report REP-2023-0721",
  },
  {
    id: "log-003",
    user: "Alexander Mitchell",
    userId: "1",
    action: "create",
    resource: "alerts",
    timestamp: "2023-07-21T10:30:45Z",
    ipAddress: "192.168.1.1",
    details: "User created new alert ALT-20230721-001",
  },
  {
    id: "log-004",
    user: "Marcus Rodriguez",
    userId: "3",
    action: "edit",
    resource: "data",
    timestamp: "2023-07-21T11:05:18Z",
    ipAddress: "192.168.1.3",
    details: "User updated target location data for Target Alpha",
  },
  {
    id: "log-005",
    user: "James Blackwood",
    userId: "4",
    action: "delete",
    resource: "users",
    timestamp: "2023-07-21T12:22:37Z",
    ipAddress: "192.168.1.4",
    details: "Administrator deleted user account for John Smith",
  },
  {
    id: "log-006",
    user: "Sarah Chen",
    userId: "2",
    action: "export",
    resource: "reports",
    timestamp: "2023-07-21T13:45:09Z",
    ipAddress: "192.168.1.2",
    details: "User exported intelligence reports to PDF",
  },
  {
    id: "log-007",
    user: "Alexander Mitchell",
    userId: "1",
    action: "approve",
    resource: "reports",
    timestamp: "2023-07-21T14:10:33Z",
    ipAddress: "192.168.1.1",
    details: "User approved intelligence report REP-2023-0715",
  },
  {
    id: "log-008",
    user: "Elena Petrova",
    userId: "5",
    action: "login",
    resource: "system",
    timestamp: "2023-07-21T15:30:21Z",
    ipAddress: "192.168.1.5",
    details: "Failed login attempt - incorrect password",
  },
]

export function AuditLogs() {
  const { t } = useLanguage()
  const { can } = usePermissions()
  const [searchQuery, setSearchQuery] = useState("")
  const [resourceFilter, setResourceFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")

  // Filter logs based on search query and filters
  const filteredLogs = auditLogs.filter((log) => {
    // Apply search filter
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply resource filter
    const matchesResource = resourceFilter === "all" || log.resource === resourceFilter

    // Apply action filter
    const matchesAction = actionFilter === "all" || log.action === actionFilter

    return matchesSearch && matchesResource && matchesAction
  })

  // Get unique resources and actions for filters
  const uniqueResources = Array.from(new Set(auditLogs.map((log) => log.resource)))
  const uniqueActions = Array.from(new Set(auditLogs.map((log) => log.action)))

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  // Get badge color for action
  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-emerald-500 hover:bg-emerald-600"
      case "edit":
        return "bg-blue-500 hover:bg-blue-600"
      case "delete":
        return "bg-red-500 hover:bg-red-600"
      case "approve":
        return "bg-purple-500 hover:bg-purple-600"
      case "export":
        return "bg-amber-500 hover:bg-amber-600"
      case "login":
        return "bg-zinc-500 hover:bg-zinc-600"
      case "view":
        return "bg-zinc-500 hover:bg-zinc-600"
      default:
        return "bg-zinc-500 hover:bg-zinc-600"
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("common.search")}
            className="pl-8 bg-zinc-800 border-zinc-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={resourceFilter} onValueChange={setResourceFilter}>
            <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700">
              <SelectValue placeholder={t("audit.resource")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resources</SelectItem>
              {uniqueResources.map((resource) => (
                <SelectItem key={resource} value={resource}>
                  {resource.charAt(0).toUpperCase() + resource.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700">
              <SelectValue placeholder={t("audit.action")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {can("audit:export") && (
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {t("audit.export")}
            </Button>
          )}
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">{t("audit.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-4 font-medium text-zinc-400">{t("audit.timestamp")}</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-400">{t("audit.user")}</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-400">{t("audit.action")}</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-400">{t("audit.resource")}</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-400">{t("audit.ipAddress")}</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-400">{t("audit.details")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-zinc-800">
                    <td className="py-3 px-4 text-zinc-400">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-zinc-500" />
                        {formatDate(log.timestamp)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-zinc-500" />
                        {log.user}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getActionColor(log.action)}>
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {log.resource === "reports" ? (
                          <FileText className="h-4 w-4 mr-2 text-zinc-500" />
                        ) : log.resource === "users" ? (
                          <User className="h-4 w-4 mr-2 text-zinc-500" />
                        ) : (
                          <Shield className="h-4 w-4 mr-2 text-zinc-500" />
                        )}
                        {log.resource.charAt(0).toUpperCase() + log.resource.slice(1)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{log.ipAddress}</td>
                    <td className="py-3 px-4 text-zinc-400">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
