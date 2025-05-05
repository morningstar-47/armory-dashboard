export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource: string
          details: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource: string
          details?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource?: string
          details?: string | null
          ip_address?: string | null
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: string
          status: string
          clearance: string
          avatar_url: string | null
          created_at: string
          updated_at: string
          last_active: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: string
          status: string
          clearance: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_active: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: string
          status?: string
          clearance?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_active?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
