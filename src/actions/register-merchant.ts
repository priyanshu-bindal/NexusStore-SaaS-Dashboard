"use server"

import { merchantRegistrationSchema } from "@/lib/validations/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function registerMerchant(prevState: unknown, formData: FormData) {
    try {
        const raw = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            confirmPassword: formData.get("confirmPassword") as string,
            description: formData.get("description") as string | null,
        }

        const validated = merchantRegistrationSchema.safeParse(raw)
        if (!validated.success) {
            return { error: validated.error.issues[0].message }
        }

        const existing = await db.user.findUnique({
            where: { email: validated.data.email }
        })
        if (existing) {
            return { error: "An account with this email already exists." }
        }

        const hashedPassword = await bcrypt.hash(validated.data.password, 12)

        await db.user.create({
            data: {
                name: validated.data.name,
                email: validated.data.email,
                password: hashedPassword, // Matches schema.prisma field: password
                role: "MERCHANT",
                storeStatus: "PENDING",   // Matches schema.prisma field: storeStatus
            }
        })

        return { success: true }

    } catch (error) {
        console.error("REGISTRATION ERROR:", error)
        return { error: "Registration failed. Please try again." }
    }
}
