import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that don't require authentication
const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/reset-password",
  "/", // Allow access to the landing page
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check if the route is public
  if (
    publicRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.includes("/_next/") ||
    pathname.includes("/favicon.ico")
  ) {
    return NextResponse.next()
  }

  // For frontend routes, check the cookie
  const authCookie = req.cookies.get("auth_token")

  if (!authCookie?.value) {
    const url = new URL("/auth/login", req.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // We'll validate the token in the API routes instead of here
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
