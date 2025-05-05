"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"
import { usePermissions, type Permission, type ResourceType, type ActionType } from "@/contexts/permissions-context"
import { useUser, type UserRole } from "@/contexts/user-context"
import { Check, X } from "lucide-react"

export function PermissionsManagement() {
  const { t } = useLanguage()
  const { userPermissions } = usePermissions()
  const { currentUser } = useUser()
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin")

  // Resources and actions for display
  const resources: ResourceType[] = ["dashboard", "reports", "alerts", "map", "data", "users", "settings", "audit"]

  const actions: ActionType[] = ["view", "create", "edit", "delete", "approve", "export", "manage"]

  // Role-based permissions (same as in permissions-context.tsx)
  const rolePermissions: Record<UserRole, Permission[]> = {
    admin: [
      // Admins have full access to everything
      "dashboard:view",
      "reports:view",
      "reports:create",
      "reports:edit",
      "reports:delete",
      "reports:approve",
      "reports:export",
      "alerts:view",
      "alerts:create",
      "alerts:edit",
      "alerts:delete",
      "alerts:approve",
      "map:view",
      "map:create",
      "map:edit",
      "map:delete",
      "data:view",
      "data:create",
      "data:edit",
      "data:delete",
      "data:export",
      "users:view",
      "users:create",
      "users:edit",
      "users:delete",
      "users:manage",
      "settings:view",
      "settings:edit",
      "settings:manage",
      "audit:view",
      "audit:export",
    ],
    commander: [
      // Commanders have broad access but can't manage users or system settings
      "dashboard:view",
      "reports:view",
      "reports:create",
      "reports:edit",
      "reports:approve",
      "reports:export",
      "alerts:view",
      "alerts:create",
      "alerts:edit",
      "alerts:approve",
      "map:view",
      "map:create",
      "map:edit",
      "data:view",
      "data:create",
      "data:edit",
      "data:export",
      "users:view",
      "settings:view",
      "audit:view",
    ],
    analyst: [
      // Analysts focus on data and reports
      "dashboard:view",
      "reports:view",
      "reports:create",
      "reports:edit",
      "reports:export",
      "alerts:view",
      "alerts:create",
      "map:view",
      "data:view",
      "data:create",
      "data:edit",
      "data:export",
      "settings:view",
    ],
    field: [
      // Field operatives have limited access
      "dashboard:view",
      "reports:view",
      "reports:create",
      "alerts:view",
      "alerts:create",
      "map:view",
      "data:view",
      "data:create",
      "settings:view",
    ],
  }

  // Check if a specific permission is granted for the selected role
  const isPermissionGranted = (resource: ResourceType, action: ActionType): boolean => {
    const permission = `${resource}:${action}` as Permission
    return rolePermissions[selectedRole].includes(permission)
  }

  // Format resource name for display
  const formatResourceName = (resource: string): string => {
    return resource.charAt(0).toUpperCase() + resource.slice(1)
  }

  // Format action name for display
  const formatActionName = (action: string): string => {
    return action.charAt(0).toUpperCase() + action.slice(1)
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">{t("permissions.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="role-select">{t("permissions.role")}</Label>
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
            <SelectTrigger id="role-select" className="w-full md:w-[240px] bg-zinc-800 border-zinc-700">
              <SelectValue placeholder={t("permissions.role")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">{t("role.admin")}</SelectItem>
              <SelectItem value="commander">{t("role.commander")}</SelectItem>
              <SelectItem value="analyst">{t("role.analyst")}</SelectItem>
              <SelectItem value="field">{t("role.field")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 font-medium text-zinc-400">{t("permissions.resource")}</th>
                {actions.map((action) => (
                  <th key={action} className="text-center py-3 px-2 font-medium text-zinc-400">
                    {formatActionName(action)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource} className="border-b border-zinc-800">
                  <td className="py-3 px-4 font-medium">{formatResourceName(resource)}</td>
                  {actions.map((action) => (
                    <td key={`${resource}-${action}`} className="text-center py-3 px-2">
                      {isPermissionGranted(resource, action) ? (
                        <Check className="h-5 w-5 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-zinc-600 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentUser?.role === "admin" && (
          <div className="mt-6 flex justify-end">
            <Button className="bg-emerald-600 hover:bg-emerald-700">{t("common.save")}</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
