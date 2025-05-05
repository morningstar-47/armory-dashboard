import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// Environment variables with fallbacks for preview mode
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Singleton pattern for client-side Supabase client
let clientInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

/**
 * Get a Supabase client for use in client components
 */
export const getSupabaseClient = () => {
  if (!clientInstance) {
    clientInstance = createClientComponentClient<Database>({
      supabaseUrl,
      supabaseKey: supabaseAnonKey,
      options: {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      },
    })
  }
  return clientInstance
}

/**
 * Create a new Supabase client for use in server components
 */
export const createServerSupabaseClient = () => {
  return createServerComponentClient<Database>({
    cookies,
    options: {
      supabaseUrl,
      supabaseKey: supabaseAnonKey,
    },
  })
}

/**
 * Check if we're in preview mode (no real Supabase connection)
 */
export const isPreviewMode = () => {
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === "https://example.supabase.co"
  )
}

/**
 * Create a mock Supabase client for testing or preview
 */
export const createMockSupabaseClient = () => {
  // This is a simplified mock - expand as needed
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
        }),
        maybeSingle: async () => ({ data: null, error: null }),
      }),
      insert: async () => ({ data: null, error: null }),
      update: () => ({
        eq: async () => ({ data: null, error: null }),
      }),
      delete: () => ({
        eq: async () => ({ data: null, error: null }),
      }),
    }),
  }
}
