"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User, Session } from "@supabase/supabase-js"
import { logUserAction } from "@/lib/audit-logger"
import { getSupabaseClient, isPreviewMode } from "@/lib/supabase"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{
    success: boolean
    error?: string
  }>
  // Admin-only function to create users
  createUser: (
    email: string,
    password: string,
    userData: { firstName: string; lastName: string; role: string; clearance: string; status: string },
  ) => Promise<{
    success: boolean
    error?: string
    userId?: string
  }>
  signOut: () => Promise<void>
  updatePassword: (password: string) => Promise<{
    success: boolean
    error?: string
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for preview mode
const MOCK_USER: User = {
  id: "mock-user-id",
  app_metadata: {},
  user_metadata: {
    first_name: "Admin",
    last_name: "User",
  },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "admin@armory.com",
  role: "authenticated",
  identities: [],
} as User

// Mock session for preview mode
const MOCK_SESSION: Session = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: "bearer",
  user: MOCK_USER,
} as Session

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Check if we're in preview mode
  const preview = isPreviewMode()

  // Initialize Supabase client
  const supabase = getSupabaseClient()

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true)

      try {
        if (preview) {
          // In preview mode, simulate a delay then set mock data
          await new Promise((resolve) => setTimeout(resolve, 1000))
          console.log("Preview mode: Using mock authentication data")
          setUser(MOCK_USER)
          setSession(MOCK_SESSION)
          setIsAuthenticated(true)
          setIsLoading(false)
          return
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error.message)
          setIsLoading(false)
          return
        }

        if (session) {
          setSession(session)
          setUser(session.user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Unexpected error during getSession:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Only set up auth state listener if not in preview mode
    if (!preview) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, newSession) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          setSession(newSession)
          setUser(newSession?.user || null)
          setIsAuthenticated(true)

          // Log sign in event
          if (event === "SIGNED_IN" && newSession?.user) {
            logUserAction(newSession.user.id, "login", "system", "User signed in")
          }
        } else if (event === "SIGNED_OUT") {
          // Log sign out event before clearing user
          if (user) {
            logUserAction(user.id, "logout", "system", "User signed out")
          }

          setSession(null)
          setUser(null)
          setIsAuthenticated(false)
          router.push("/auth/login")
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    // No cleanup needed for preview mode
    return () => {}
  }, [supabase, router, user, preview])

  const signIn = async (email: string, password: string, rememberMe = false) => {
    try {
      if (preview) {
        // In preview mode, simulate a successful login with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Preview mode: Simulating successful login")

        setUser(MOCK_USER)
        setSession(MOCK_SESSION)
        setIsAuthenticated(true)

        return { success: true }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // If rememberMe is true, set a longer session expiry
          ...(rememberMe && { expiresIn: 60 * 60 * 24 * 30 }), // 30 days
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      setSession(data.session)
      setUser(data.user)
      setIsAuthenticated(true)

      // Log successful sign in
      if (data.user) {
        logUserAction(data.user.id, "login", "system", "User signed in successfully")
      }

      return { success: true }
    } catch (error) {
      console.error("Unexpected error during sign in:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Admin-only function to create users
  const createUser = async (
    email: string,
    password: string,
    userData: { firstName: string; lastName: string; role: string; clearance: string; status: string },
  ) => {
    try {
      if (preview) {
        // In preview mode, simulate a successful user creation
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Preview mode: Simulating user creation", { email, userData })
        return { success: true, userId: `mock-user-${Date.now()}` }
      }

      // Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
          // Don't redirect for email confirmation
          emailRedirectTo: null,
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
        // This would require admin privileges in a real app
        return { success: false, error: profileError.message }
      }

      // Log user creation
      if (user) {
        await logUserAction(user.id, "create", "users", `Admin created new user: ${email}`)
      }

      return { success: true, userId: authData.user.id }
    } catch (error) {
      console.error("Unexpected error during user creation:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const signOut = async () => {
    try {
      if (preview) {
        // In preview mode, simulate a sign out
        await new Promise((resolve) => setTimeout(resolve, 500))
        console.log("Preview mode: Simulating sign out")
        setSession(null)
        setUser(null)
        setIsAuthenticated(false)
        router.push("/auth/login")
        return
      }

      // Log sign out event before signing out
      if (user) {
        await logUserAction(user.id, "logout", "system", "User signed out")
      }

      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
      setIsAuthenticated(false)
      router.push("/auth/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const updatePassword = async (password: string) => {
    try {
      if (preview) {
        // In preview mode, simulate a successful password update
        await new Promise((resolve) => setTimeout(resolve, 800))
        console.log("Preview mode: Simulating password update")
        return { success: true }
      }

      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        return { success: false, error: error.message }
      }

      // Log password update
      if (user) {
        await logUserAction(user.id, "edit", "users", "User updated password")
      }

      return { success: true }
    } catch (error) {
      console.error("Unexpected error during password update:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated,
        signIn,
        createUser,
        signOut,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
