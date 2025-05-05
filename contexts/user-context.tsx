"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient, isPreviewMode } from "@/lib/supabase"
import { SessionExpired } from "@/components/session-expired"

export type UserRole = "admin" | "analyst" | "field" | "commander"
export type UserStatus = "active" | "inactive" | "suspended"
export type ClearanceLevel = "topsecret" | "secret" | "confidential"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  status: UserStatus
  clearance: ClearanceLevel
  avatar?: string
  lastActive: string
}

type UserContextType = {
  currentUser: User | null
  isAuthenticated: boolean
  users: User[]
  addUser: (user: Omit<User, "id" | "lastActive">) => Promise<boolean>
  updateUser: (id: string, userData: Partial<User>) => Promise<boolean>
  deleteUser: (id: string) => Promise<boolean>
  refreshCurrentUser: () => Promise<void>
  sessionExpired: boolean
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Mock users for preview mode
const mockUsers: User[] = [
  {
    id: "mock-user-1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@armory.com",
    role: "admin",
    status: "active",
    clearance: "topsecret",
    lastActive: new Date().toISOString(),
  },
  {
    id: "mock-user-2",
    firstName: "Field",
    lastName: "Agent",
    email: "field@armory.com",
    role: "field",
    status: "active",
    clearance: "secret",
    lastActive: new Date().toISOString(),
  },
  {
    id: "mock-user-3",
    firstName: "Intelligence",
    lastName: "Analyst",
    email: "analyst@armory.com",
    role: "analyst",
    status: "active",
    clearance: "confidential",
    lastActive: new Date().toISOString(),
  },
  {
    id: "mock-user-4",
    firstName: "Command",
    lastName: "Officer",
    email: "commander@armory.com",
    role: "commander",
    status: "active",
    clearance: "topsecret",
    lastActive: new Date().toISOString(),
  },
]

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser, isAuthenticated: authIsAuthenticated } = useAuth()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sessionExpired, setSessionExpired] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if we're in preview mode
  const preview = isPreviewMode()

  // Fetch current user data when auth user changes
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!authUser || !authIsAuthenticated) {
        setCurrentUser(null)
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        if (preview) {
          // In preview mode, use mock data
          console.log("Preview mode: Using mock user data")
          await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate loading

          // Use the first mock user as the current user
          const mockCurrentUser = mockUsers[0]
          setCurrentUser(mockCurrentUser)
          setUsers(mockUsers)
          setIsAuthenticated(true)
          setIsLoading(false)
          return
        }

        const supabase = getSupabaseClient()

        // First check if the user exists in the database
        const { data, error } = await supabase.from("users").select("*").eq("id", authUser.id).maybeSingle()

        if (error) {
          console.error("Error fetching current user:", error)

          // Check if the error is due to an expired session
          if (error.code === "PGRST116") {
            setSessionExpired(true)
          }

          setIsLoading(false)
          return
        }

        if (data) {
          // User exists, update the user data
          const user: User = {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            role: data.role,
            status: data.status,
            clearance: data.clearance,
            avatar: data.avatar_url,
            lastActive: data.last_active,
          }
          setCurrentUser(user)
          setIsAuthenticated(true)

          // Update last active timestamp
          await supabase.from("users").update({ last_active: new Date().toISOString() }).eq("id", authUser.id)
        } else {
          // User doesn't exist in the database yet, create a default user
          // This might happen if the user was created through Supabase Auth but not added to the users table
          console.log("User not found in database, creating default user")

          const newUser = {
            id: authUser.id,
            first_name: authUser.user_metadata?.first_name || "New",
            last_name: authUser.user_metadata?.last_name || "User",
            email: authUser.email || "",
            role: "analyst" as UserRole, // Default role
            status: "active" as UserStatus,
            clearance: "confidential" as ClearanceLevel,
            avatar_url: authUser.user_metadata?.avatar_url,
            last_active: new Date().toISOString(),
          }

          const { error: insertError } = await supabase.from("users").insert([newUser])

          if (insertError) {
            console.error("Error creating default user:", insertError)
            setIsLoading(false)
            return
          }

          // Set the current user with the newly created user data
          setCurrentUser({
            id: newUser.id,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
            clearance: newUser.clearance,
            avatar: newUser.avatar_url,
            lastActive: newUser.last_active,
          })
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Unexpected error fetching current user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentUser()
  }, [authUser, authIsAuthenticated, preview])

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthenticated || !currentUser) {
        return
      }

      try {
        if (preview) {
          // In preview mode, we've already set the users in the fetchCurrentUser function
          return
        }

        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("users").select("*")

        if (error) {
          console.error("Error fetching users:", error)
          return
        }

        if (data) {
          const formattedUsers: User[] = data.map((user) => ({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            role: user.role,
            status: user.status,
            clearance: user.clearance,
            avatar: user.avatar_url,
            lastActive: user.last_active,
          }))
          setUsers(formattedUsers)
        }
      } catch (error) {
        console.error("Unexpected error fetching users:", error)
      }
    }

    fetchUsers()
  }, [isAuthenticated, currentUser, preview])

  const refreshCurrentUser = async () => {
    if (preview) {
      // In preview mode, just return the mock current user
      return
    }

    if (authUser) {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

        if (error) {
          console.error("Error refreshing current user:", error)
          return
        }

        if (data) {
          const user: User = {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            role: data.role,
            status: data.status,
            clearance: data.clearance,
            avatar: data.avatar_url,
            lastActive: data.last_active,
          }
          setCurrentUser(user)
        }
      } catch (error) {
        console.error("Unexpected error refreshing current user:", error)
      }
    }
  }

  const addUser = async (user: Omit<User, "id" | "lastActive">) => {
    try {
      if (preview) {
        // In preview mode, simulate adding a user
        await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate loading

        const newUser: User = {
          id: `mock-user-${users.length + 1}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status,
          clearance: user.clearance,
          avatar: user.avatar,
          lastActive: new Date().toISOString(),
        }

        setUsers([...users, newUser])
        return true
      }

      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("users").insert([
        {
          id: crypto.randomUUID(),
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status,
          clearance: user.clearance,
          avatar_url: user.avatar,
          last_active: new Date().toISOString(),
        },
      ])

      if (error) {
        console.error("Error adding user:", error)
        return false
      }

      // Refresh users list
      const { data: updatedUsers, error: fetchError } = await supabase.from("users").select("*")

      if (fetchError) {
        console.error("Error fetching updated users:", fetchError)
        return false
      }

      if (updatedUsers) {
        const formattedUsers: User[] = updatedUsers.map((user) => ({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          status: user.status,
          clearance: user.clearance,
          avatar: user.avatar_url,
          lastActive: user.last_active,
        }))
        setUsers(formattedUsers)
      }

      return true
    } catch (error) {
      console.error("Unexpected error adding user:", error)
      return false
    }
  }

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      if (preview) {
        // In preview mode, simulate updating a user
        await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate loading

        const updatedUsers = users.map((user) => {
          if (user.id === id) {
            return {
              ...user,
              ...(userData.firstName !== undefined && { firstName: userData.firstName }),
              ...(userData.lastName !== undefined && { lastName: userData.lastName }),
              ...(userData.email !== undefined && { email: userData.email }),
              ...(userData.role !== undefined && { role: userData.role }),
              ...(userData.status !== undefined && { status: userData.status }),
              ...(userData.clearance !== undefined && { clearance: userData.clearance }),
              ...(userData.avatar !== undefined && { avatar: userData.avatar }),
            }
          }
          return user
        })

        setUsers(updatedUsers)

        // Update current user if it's the same user
        if (currentUser && currentUser.id === id) {
          const updatedUser = updatedUsers.find((user) => user.id === id)
          if (updatedUser) {
            setCurrentUser(updatedUser)
          }
        }

        return true
      }

      const supabase = getSupabaseClient()
      const updateData: any = {}

      if (userData.firstName !== undefined) updateData.first_name = userData.firstName
      if (userData.lastName !== undefined) updateData.last_name = userData.lastName
      if (userData.email !== undefined) updateData.email = userData.email
      if (userData.role !== undefined) updateData.role = userData.role
      if (userData.status !== undefined) updateData.status = userData.status
      if (userData.clearance !== undefined) updateData.clearance = userData.clearance
      if (userData.avatar !== undefined) updateData.avatar_url = userData.avatar

      const { error } = await supabase.from("users").update(updateData).eq("id", id)

      if (error) {
        console.error("Error updating user:", error)
        return false
      }

      // Refresh users list
      const { data: updatedUsers, error: fetchError } = await supabase.from("users").select("*")

      if (fetchError) {
        console.error("Error fetching updated users:", fetchError)
        return false
      }

      if (updatedUsers) {
        const formattedUsers: User[] = updatedUsers.map((user) => ({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          status: user.status,
          clearance: user.clearance,
          avatar: user.avatar_url,
          lastActive: user.last_active,
        }))
        setUsers(formattedUsers)

        // Update current user if it's the same user
        if (currentUser && currentUser.id === id) {
          const updatedUser = formattedUsers.find((user) => user.id === id)
          if (updatedUser) {
            setCurrentUser(updatedUser)
          }
        }
      }

      return true
    } catch (error) {
      console.error("Unexpected error updating user:", error)
      return false
    }
  }

  const deleteUser = async (id: string) => {
    try {
      if (preview) {
        // In preview mode, simulate deleting a user
        await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate loading
        setUsers(users.filter((user) => user.id !== id))
        return true
      }

      const supabase = getSupabaseClient()
      const { error } = await supabase.from("users").delete().eq("id", id)

      if (error) {
        console.error("Error deleting user:", error)
        return false
      }

      // Update users list
      setUsers(users.filter((user) => user.id !== id))
      return true
    } catch (error) {
      console.error("Unexpected error deleting user:", error)
      return false
    }
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        users,
        addUser,
        updateUser,
        deleteUser,
        refreshCurrentUser,
        sessionExpired,
        isLoading,
      }}
    >
      {sessionExpired && <SessionExpired />}
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
