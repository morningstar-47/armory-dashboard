"use client"

import type React from "react"

import { usePermissions, type Permission, type ResourceType } from "@/contexts/permissions-context"

export function usePermissionCheck() {
  const { can, canAccess, canAny, canAll, userPermissions } = usePermissions()

  // Check if user can perform an action on a resource
  const checkPermission = (
    resource: ResourceType,
    action: "view" | "create" | "edit" | "delete" | "approve" | "export" | "manage",
  ): boolean => {
    return can(`${resource}:${action}` as Permission)
  }

  // Check if component should be rendered based on permission
  const renderIfCan = (permission: Permission, fallback: React.ReactNode = null) => {
    return (component: React.ReactNode) => {
      return can(permission) ? component : fallback
    }
  }

  return {
    can,
    canAccess,
    canAny,
    canAll,
    userPermissions,
    checkPermission,
    renderIfCan,
  }
}
