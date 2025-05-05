import { getSupabaseClient, isPreviewMode } from "@/lib/supabase"

type AuditAction = "view" | "create" | "edit" | "delete" | "approve" | "export" | "login" | "logout"
type AuditResource = "dashboard" | "reports" | "alerts" | "map" | "data" | "users" | "settings" | "system"

export async function logUserAction(
  userId: string,
  action: AuditAction,
  resource: AuditResource,
  details?: string,
  ipAddress?: string,
): Promise<{ success: boolean; error?: any }> {
  try {
    // In preview mode, just log to console
    if (isPreviewMode()) {
      console.log(`[AUDIT LOG] User ${userId} performed ${action} on ${resource}${details ? `: ${details}` : ""}`)
      return { success: true }
    }

    const supabase = getSupabaseClient()

    const { error } = await supabase.from("audit_logs").insert([
      {
        user_id: userId,
        action,
        resource,
        details,
        ip_address: ipAddress || "127.0.0.1",
      },
    ])

    if (error) {
      console.error("Error logging user action:", error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error during audit logging:", error)
    return { success: false, error }
  }
}
