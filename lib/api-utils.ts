import { getSupabaseClient } from "@/lib/supabase"

export async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {},
): Promise<{ data: T | null; error: Error | null }> {
  const supabase = getSupabaseClient()

  try {
    // Get the session
    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      return { data: null, error: new Error("No active session") }
    }

    // Add authorization header
    const headers = new Headers(options.headers || {})
    headers.set("Authorization", `Bearer ${sessionData.session.access_token}`)

    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    console.error("API request error:", error)
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) }
  }
}
