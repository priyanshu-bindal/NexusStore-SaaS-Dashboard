import NextAuth from "next-auth"
import { authConfig } from "./src/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl
    const userRole = req.auth?.user?.role

    // Routes that require authentication for any user
    const isCustomerProtectedRoute = [
        "/checkout",
        "/profile",
        "/myaccount",
        "/orders"
    ].some((route) => pathname.startsWith(route))

    // Dashboard routes specific to merchants
    const isDashboardRoute = pathname.startsWith("/dashboard")

    // 1. Unauthenticated users hitting /checkout, /profile, or /dashboard redirect to /sign-in
    if (!isLoggedIn && (isCustomerProtectedRoute || isDashboardRoute)) {
        return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    // 2. Customers who visit /dashboard should be redirected to /sign-in
    // Merchants access their dashboard at /dashboard/* only after auth with role=MERCHANT (or ADMIN if applicable).
    if (isLoggedIn && isDashboardRoute) {
        if (userRole !== "MERCHANT" && (userRole as string) !== "ADMIN") {
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }
    }

    // 3. Merchants who visit /shop should work fine (handled implicitly by NextResponse.next() below)
    // 4. Guests can browse storefront at root domain (handled implicitly by NextResponse.next() below)

    return NextResponse.next()
})

// Matcher config - apply middleware to specific routes
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes except those we explicitly want, though those don't match our matcher mostly)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
