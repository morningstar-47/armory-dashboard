import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/postgres"
import { hashPassword } from "@/lib/postgres"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json()

    // Vérifier les champs requis
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Vérifier si l'email existe déjà
    const existingUsers = await query<{ id: string }>("SELECT id FROM users WHERE email = $1", [email])

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    // Hacher le mot de passe
    const hashedPassword = hashPassword(password)

    // Créer l'utilisateur
    const userId = uuidv4()
    await query(
      "INSERT INTO users (id, email, password, first_name, last_name, role, status, clearance) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [userId, email, hashedPassword, firstName, lastName, "analyst", "active", "confidential"],
    )

    // Enregistrer l'action dans les logs
    await query("INSERT INTO audit_logs (user_id, action, resource, details) VALUES ($1, $2, $3, $4)", [
      userId,
      "register",
      "auth",
      "User registered",
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
