"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { useUser, type UserRole } from "@/contexts/user-context"

// Define permission types
export type ResourceType = "dashboard" | "reports" | "alerts" | "map" | "data" | "users" | "settings" | "audit"

export type ActionType = "view" | "create" | "edit" | "delete" | "approve" | "export" | "manage"

export type Permission = `${ResourceType}:${ActionType}`

type PermissionsContextType = {
  can: (permission: Permission) => boolean
  canAccess: (resource: ResourceType) => boolean
  canAny: (permissions: Permission[]) => boolean
  canAll: (permissions: Permission[]) => boolean
  userPermissions: Permission[]
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined)

// Define role-based permissions
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

// Define which resources are accessible based on having any permission for that resource
const resourceAccessMap: Record<ResourceType, Permission[]> = {
  dashboard: ["dashboard:view"],
  reports: ["reports:view", "reports:create", "reports:edit", "reports:delete", "reports:approve", "reports:export"],
  alerts: ["alerts:view", "alerts:create", "alerts:edit", "alerts:delete", "alerts:approve"],
  map: ["map:view", "map:create", "map:edit", "map:delete"],
  data: ["data:view", "data:create", "data:edit", "data:delete", "data:export"],
  users: ["users:view", "users:create", "users:edit", "users:delete", "users:manage"],
  settings: ["settings:view", "settings:edit", "settings:manage"],
  audit: ["audit:view", "audit:export"],
}

export const PermissionsProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useUser()

  // Get permissions based on user role
  const userPermissions = useMemo(() => {
    if (!currentUser) return []
    return rolePermissions[currentUser.role] || []
  }, [currentUser])

  // Check if user has a specific permission
  const can = (permission: Permission): boolean => {
    if (!currentUser) return false
    return userPermissions.includes(permission)
  }

  // Check if user can access a resource (has any permission for it)
  const canAccess = (resource: ResourceType): boolean => {
    if (!currentUser) return false
    const requiredPermissions = resourceAccessMap[resource]
    return requiredPermissions.some((permission) => userPermissions.includes(permission))
  }

  // Check if user has any of the given permissions
  const canAny = (permissions: Permission[]): boolean => {
    if (!currentUser) return false
    return permissions.some((permission) => userPermissions.includes(permission))
  }

  // Check if user has all of the given permissions
  const canAll = (permissions: Permission[]): boolean => {
    if (!currentUser) return false
    return permissions.every((permission) => userPermissions.includes(permission))
  }

  return (
    <PermissionsContext.Provider value={{ can, canAccess, canAny, canAll, userPermissions }}>
      {children}
    </PermissionsContext.Provider>
  )
}

export const usePermissions = () => {
  const context = useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider")
  }
  return context
}
