import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/postgres"
import { randomBytes } from "crypto"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    // Vérifier les champs requis
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe
    const users = await query<{ id: string }>("SELECT id FROM users WHERE email = $1", [email])

    if (users.length === 0) {
      // Ne pas révéler si l'email existe ou non
      return NextResponse.json({ success: true })
    }

    const userId = users[0].id

    // Générer un token de réinitialisation
    const resetToken = randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date()
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1) // Expire dans 1 heure

    // Stocker le token dans la base de données
    await query("UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3", [
      resetToken,
      resetTokenExpiry,
      userId,
    ])

    // Dans une application réelle, envoyer un email avec le lien de réinitialisation
    // Pour cet exemple, nous allons simplement retourner le token
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`

    console.log("Password reset link:", resetLink)

    // Enregistrer l'action dans les logs
    await query("INSERT INTO audit_logs (user_id, action, resource, details) VALUES ($1, $2, $3, $4)", [
      userId,
      "reset_password_request",
      "auth",
      "Password reset requested",
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
