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

        // Parse arrays
        const imagesRaw = formData.get("images") as string;
        const sizesRaw = formData.get("sizes") as string;

        const images = imagesRaw ? JSON.parse(imagesRaw) : [];
        const sizes = sizesRaw ? JSON.parse(sizesRaw) : [];

        if (!name || !price || !stock || !category) {
            console.log("Missing fields:", { name, price, stock, category });
            return { error: "Missing required fields" };
        }

        // Convert decimal and int
        const priceDecimal = new Prisma.Decimal(price);
        const stockInt = parseInt(stock);

        console.log("Creating product with data:", {
            name, description, price: priceDecimal, stock: stockInt, category, storeId: store.id, images: images.length, sizes: sizes.length
        });

        await db.product.create({
            data: {
                name,
                description: description || "",
                price: priceDecimal,
                stock: stockInt,
                category, // Ensure category is passed directly if required
                storeId: store.id,
                images: images,
                sizes: sizes,
            }
        });

        revalidatePath("/products");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Create Product Error Full:", error);
        return { error: `Failed to create product: ${(error as Error).message}` };
    }
}
