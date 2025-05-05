"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions, type Permission, type ResourceType } from "@/contexts/permissions-context"
import { AccessDenied } from "@/components/access-denied"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: Permission
  requiredResource?: ResourceType
  fallback?: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredResource,
  fallback = <AccessDenied />,
  redirectTo,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const { can, canAccess } = usePermissions()
  const router = useRouter()

  const hasAccess =
    isAuthenticated &&
    (!requiredPermission || can(requiredPermission)) &&
    (!requiredResource || canAccess(requiredResource))

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo || "/auth/login")
    } else if (!isLoading && isAuthenticated && !hasAccess && redirectTo) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, hasAccess, redirectTo, router])

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  if (!hasAccess) {
    return fallback
  }

  return <>{children}</>
}
