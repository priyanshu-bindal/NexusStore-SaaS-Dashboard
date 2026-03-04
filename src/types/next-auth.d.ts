import { Role } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
    role: Role
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        role: Role
    }
}
