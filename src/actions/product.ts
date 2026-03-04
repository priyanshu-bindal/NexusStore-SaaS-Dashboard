"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Type definition for the action input
type CreateProductInput = {
    name: string;
    description: string;
    price: number;
    stock: number;
    images?: string[];
    category?: string;
};

export async function createProduct(data: CreateProductInput) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { error: "Unauthorized" };
        }

        // 1. Get the user's store
        const store = await db.store.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        });

        if (!store) {
            return { error: "Store not found. Please complete onboarding first." };
        }

        // 2. Create the product
        // Note: Prices are stored as Decimals in Prisma. 
        // We pass 'number' from the UI and Prisma handles the conversion if valid.
        const product = await db.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price, // Prisma/Decimal will handle number -> Decimal
                stock: data.stock,
                images: data.images || [],
                category: data.category,
                storeId: store.id
            }
        });

        // 3. Revalidate the shop page and dashboard products list
        revalidatePath("/shop");
        revalidatePath("/dashboard/products");

        return { success: true, product };
    } catch (error) {
        console.error("Create Product Error:", error);
        return { error: "Failed to create product" };
    }
}

export async function deleteProduct(formData: FormData) {
    try {
        const productId = formData.get("id") as string;
        const session = await auth();

        if (!session?.user?.id) return { error: "Unauthorized" };

        const store = await db.store.findUnique({
            where: { userId: session.user.id },
        });

        if (!store) return { error: "Store not found" };

        // Verify product belongs to this store
        const product = await db.product.findUnique({
            where: { id: productId },
        });

        if (!product || product.storeId !== store.id) {
            return { error: "Unauthorized deletion" };
        }

        await db.product.delete({
            where: { id: productId },
        });

        revalidatePath("/dashboard/products");
        revalidatePath("/shop");

        return { success: true };
    } catch (error) {
        return { error: "Failed to delete" };
    }
}
