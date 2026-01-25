"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const storeSchema = z.object({
    name: z.string().min(3, "Store name must be at least 3 characters"),
    description: z.string().optional(),
});

export type StoreState = {
    errors?: {
        name?: string[];
        description?: string[];
        _form?: string[];
    };
    message?: string | null;
};

export async function createStore(
    prevState: StoreState,
    formData: FormData
): Promise<StoreState> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            message: "Unauthenticated. Please log in.",
        };
    }

    const validatedFields = storeSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to create store.",
        };
    }

    const { name, description } = validatedFields.data;

    try {
        const existingStore = await db.store.findUnique({
            where: {
                userId: session.user.id,
            },
        });

        if (existingStore) {
            return {
                message: "You already have a store created.",
            }
        }

        await db.store.create({
            data: {
                name,
                description,
                userId: session.user.id,
            },
        });
    } catch (error) {
        console.error("Store creation error:", error);
        return {
            message: "Database error: Failed to create store.",
        };
    }

    revalidatePath("/dashboard");
    return {
        message: "Store created successfully!"
    }
}
