import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    providers: [], // Providers defined in auth.ts for Node runtime compatibility
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role as any; // Cast to avoid type mismatch if prisma not generated yet
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
} satisfies NextAuthConfig
