import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { authConfig } from "./auth.config"

import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: "jwt" },
    adapter: PrismaAdapter(db as any),
    ...authConfig,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // 1. Mock Validation Logic (Password check would go here)
                const merchantUser = { id: "merchant-123", name: "Merchant User", email: "merchant@example.com", role: "MERCHANT" };
                const customerUser = { id: "customer-123", name: "Customer User", email: "customer@example.com", role: "CUSTOMER" };

                let user = null;

                if (credentials?.email === merchantUser.email) user = merchantUser;
                else if (credentials?.email === customerUser.email) user = customerUser;

                if (!user) return null;

                // 2. Database Sync: Ensure this user exists in Supabase
                try {
                    const dbUser = await db.user.upsert({
                        where: { email: user.email },
                        update: {}, // Do nothing if they exist
                        create: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role as any, // Cast role for consistency
                        },
                    });
                    return dbUser;
                } catch (error) {
                    console.error("Auth DB Sync Error:", error);
                    return null;
                }
            },
        }),
    ],
})
