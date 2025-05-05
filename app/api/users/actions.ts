"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { logUserAction } from "@/lib/audit-logger"
import type { Database } from "@/types/supabase"

// Environment variables with fallbacks for preview mode
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Create a new user (admin only)
export async function createUser(
  adminUserId: string,
  email: string,
  password: string,
  userData: { firstName: string; lastName: string; role: string; clearance: string; status: string },
) {
  try {
    const supabase = createServerComponentClient<Database>({
      cookies,
      options: {
        supabaseUrl,
        supabaseKey: supabaseAnonKey,
      },
    })

    // Verify the admin status of the requesting user
    const { data: adminData, error: adminError } = await supabase
      .from("users")
      .select("role")
      .eq("id", adminUserId)
      .single()

    if (adminError || !adminData || adminData.role !== "admin") {
      return { success: false, error: "Unauthorized: Only admins can create users" }
    }

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: userData.firstName,
        last_name: userData.lastName,
      },
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: "Failed to create user" }
    }

    // Create the user profile in the database
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        email: email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        status: userData.status,
        clearance: userData.clearance,
        last_active: new Date().toISOString(),
      },
    ])

    if (profileError) {
      // If profile creation fails, try to delete the auth user to maintain consistency
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { success: false, error: profileError.message }
    }

    // Log user creation
    await logUserAction(adminUserId, "create", "users", `Admin created new user: ${email}`)

    return { success: true, userId: authData.user.id }
  } catch (error) {
    console.error("Unexpected error during user creation:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Update a user (admin only for role/clearance changes)
export async function updateUser(
  requestingUserId: string,
  userId: string,
  userData: { firstName?: string; lastName?: string; role?: string; clearance?: string; status?: string },
) {
  try {
    const supabase = createServerComponentClient<Database>({
      cookies,
      options: {
        supabaseUrl,
        supabaseKey: supabaseAnonKey,
      },
    })

    // Verify the permissions of the requesting user
    const { data: requestingUserData, error: requestingUserError } = await supabase
      .from("users")
      .select("role")
      .eq("id", requestingUserId)
      .single()

    if (requestingUserError || !requestingUserData) {
      return { success: false, error: "Unauthorized: User not found" }
    }

    // Only admins can change roles, clearance, or status
    if ((userData.role || userData.clearance || userData.status) && requestingUserData.role !== "admin") {
      return { success: false, error: "Unauthorized: Only admins can change roles, clearance, or status" }
    }

    // Users can only update their own basic info unless they're admins
    if (requestingUserId !== userId && requestingUserData.role !== "admin") {
      return { success: false, error: "Unauthorized: You can only update your own information" }
    }

    // Update user metadata if needed
    if (userData.firstName || userData.lastName) {
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          first_name: userData.firstName,
          last_name: userData.lastName,
        },
      })
    }

    // Update user profile in the database
    const updateData: Record<string, any> = {}
    if (userData.firstName) updateData.first_name = userData.firstName
    if (userData.lastName) updateData.last_name = userData.lastName
    if (userData.role) updateData.role = userData.role
    if (userData.clearance) updateData.clearance = userData.clearance
    if (userData.status) updateData.status = userData.status

    const { error: updateError } = await supabase.from("users").update(updateData).eq("id", userId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    // Log user update
    await logUserAction(
      requestingUserId,
      "edit",
      "users",
      `User ${userId} updated by ${requestingUserId === userId ? "themselves" : "admin"}`,
    )

    return { success: true }
  } catch (error) {
    console.error("Unexpected error during user update:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Delete a user (admin only)
export async function deleteUser(adminUserId: string, userId: string) {
  try {
    const supabase = createServerComponentClient<Database>({
      cookies,
      options: {
        supabaseUrl,
        supabaseKey: supabaseAnonKey,
      },
    })

    // Verify the admin status of the requesting user
    const { data: adminData, error: adminError } = await supabase
      .from("users")
      .select("role")
      .eq("id", adminUserId)
      .single()

    if (adminError || !adminData || adminData.role !== "admin") {
      return { success: false, error: "Unauthorized: Only admins can delete users" }
    }

    // Delete user from the database first
    const { error: dbError } = await supabase.from("users").delete().eq("id", userId)

    if (dbError) {
      return { success: false, error: dbError.message }
    }

    // Delete user from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      return { success: false, error: authError.message }
    }

    // Log user deletion
    await logUserAction(adminUserId, "delete", "users", `Admin deleted user: ${userId}`)

    return { success: true }
  } catch (error) {
    console.error("Unexpected error during user deletion:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
