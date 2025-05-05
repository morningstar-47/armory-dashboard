import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/postgres"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: NextRequest) {
  try {
    // Get token from request
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ valid: false, error: "No token provided" }, { status: 400 })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string
        email: string
        role: string
      }

      // Check if user exists and is active
      const users = await query<{ status: string }>("SELECT status FROM users WHERE id = $1", [decoded.id])

      if (users.length === 0 || users[0].status !== "active") {
        return NextResponse.json({ valid: false, error: "User not found or inactive" }, { status: 401 })
      }

      // Update last active timestamp
      await query("UPDATE users SET last_active = NOW() WHERE id = $1", [decoded.id])

      return NextResponse.json({ valid: true, user: decoded })
    } catch (error) {
      console.error("Token verification error:", error)
      return NextResponse.json({ valid: false, error: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ valid: false, error: "Server error" }, { status: 500 })
  }
}
