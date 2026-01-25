import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const role = (req.auth?.user as any)?.role;

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicRoute = ["/", "/sign-in", "/get-started"].includes(nextUrl.pathname);
    const isMerchantRoute = nextUrl.pathname.startsWith("/dashboard");
    const isCustomerRoute = nextUrl.pathname.startsWith("/shop") || nextUrl.pathname.startsWith("/checkout") || nextUrl.pathname.startsWith("/profile");

    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute) {
        // Redirect unauthenticated users to sign-in
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }
        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        return NextResponse.redirect(new URL(`/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl));
    }

    if (isLoggedIn) {
        // Prevent Role-Crossing
        if (role === "MERCHANT" && isCustomerRoute) {
            return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
        if (role === "CUSTOMER" && isMerchantRoute) {
            return NextResponse.redirect(new URL("/shop", nextUrl));
        }

        // Redirect logged-in users away from auth pages
        if (isPublicRoute && nextUrl.pathname === "/sign-in") {
            if (role === "MERCHANT") {
                return NextResponse.redirect(new URL("/dashboard", nextUrl));
            }
            if (role === "CUSTOMER") {
                return NextResponse.redirect(new URL("/shop", nextUrl));
            }
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api/auth|sign-in|onboarding|_next/static|_next/image|favicon.ico).*)"],
};
