import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/postgres"
import jwt from "jsonwebtoken"
import { hashPassword } from "@/lib/postgres"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Check required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Verify credentials
    const hashedPassword = hashPassword(password)
    const users = await query<{
      id: string
      email: string
      first_name: string
      last_name: string
      role: string
      status: string
    }>("SELECT id, email, first_name, last_name, role, status FROM users WHERE email = $1 AND password = $2", [
      email,
      hashedPassword,
    ])

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = users[0]

    // Check if user is active
    if (user.status !== "active") {
      return NextResponse.json({ error: "Account is not active" }, { status: 403 })
    }

    // Create JWT token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" })

    // Update last activity
    await query("UPDATE users SET last_active = NOW() WHERE id = $1", [user.id])

    // Log the action
    await query("INSERT INTO audit_logs (user_id, action, resource, details) VALUES ($1, $2, $3, $4)", [
      user.id,
      "login",
      "auth",
      "User logged in",
    ])

    // Create response with HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    })

    // Set cookie
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
