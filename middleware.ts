import NextAuth from "next-auth"
import { authConfig } from "./src/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    // Public routes that do not require authentication
    const publicRoutes = [
        "/",
        "/shop",
        "/collections",
        "/api/public"
    ]

    // Check if current path is a public route
    const isPublicRoute = publicRoutes.some((route) => {
        if (route === "/") return pathname === "/"
        return pathname.startsWith(route)
    })

    // Allow access to public routes regardless of auth status
    if (isPublicRoute) {
        return NextResponse.next()
    }

    // Protected routes that specifically require authentication
    const protectedRoutes = [
        "/checkout",
        "/dashboard",
        "/profile",
        "/myaccount",
        "/onboarding",
        "/orders",
        "/analytics"
    ]

    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    )

    // Redirect to sign-in if accessing protected route without auth
    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    return NextResponse.next()
})

// Matcher config - apply middleware to specific routes
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
