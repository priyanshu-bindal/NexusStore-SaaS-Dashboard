"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function registerUser(data: {
    name: string;
    email: string;
    password: string;
}) {
    console.log("Starting registration for:", data.email); // Debug log

    try {
        // 1. Validate input
        const validated = registerSchema.safeParse(data);

        if (!validated.success) {
            console.error("Validation Error:", validated.error);
            return { success: false, error: validated.error.issues[0].message };
        }

        const { name, email, password } = validated.data;

        // 2. Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.warn("Registration failed: Email already in use -", email);
            return {
                success: false,
                error: "Email already in use",
            };
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create user
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "CUSTOMER", // Default role
            },
        });

        console.log("User created successfully:", user.id);

        return {
            success: true,
            message: "Account created successfully",
            userId: user.id,
        };
    } catch (error) {
        console.error("REGISTRATION ERROR:", error); // Critical for debugging
        return {
            success: false,
            error: "Failed to create account. Please try again.",
        };
    }
}
