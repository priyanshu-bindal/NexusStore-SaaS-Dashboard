"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function createProduct(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "Unauthenticated" };
        }

        const store = await db.store.findFirst({
            where: { userId: session.user.id }
        });

        if (!store) {
            return { error: "Store not found" };
        }

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const price = formData.get("price") as string;
        const stock = formData.get("stock") as string;
        const category = formData.get("category") as string;
        const imageUrl = formData.get("imageUrl") as string;

        if (!name || !price || !stock) {
            return { error: "Missing required fields" };
        }

        // Convert decimal and int
        const priceDecimal = new Prisma.Decimal(price);
        const stockInt = parseInt(stock);

        await db.product.create({
            data: {
                name,
                description: description || "",
                price: priceDecimal,
                stock: stockInt,
                category: category || null,
                storeId: store.id,
                images: imageUrl ? [imageUrl] : []
            }
        });

        revalidatePath("/products");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Create Product Error:", error);
        return { error: "Failed to create product" };
    }
}
