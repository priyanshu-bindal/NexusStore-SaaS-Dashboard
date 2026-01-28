"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteProduct(productId: string) {
    try {
        await db.product.delete({
            where: { id: productId }
        });

        // Revalidate multiple paths to ensure total consistency
        revalidatePath("/dashboard/products");
        revalidatePath("/dashboard"); // For "Active Listings" / "Total Products" cards
        revalidatePath("/shop"); // Remove from customer view

        return { success: true, message: "Product deleted successfully" };
    } catch (error) {
        console.error("Failed to delete product:", error);
        return { success: false, message: "Failed to delete product" };
    }
}

export async function updateProduct(productId: string, data: { name?: string; price?: number; stock?: number; description?: string }) {
    try {
        // Build update data
        const updateData: any = { ...data };

        // Stock Sync Logic: If stock is explicitly provided, we check logic
        if (data.stock !== undefined) {
            // Logic: 0 stock = "OUT_OF_STOCK". > 0 stock = "ACTIVE" (unless we controlled status explicitly, but for now we inferred it)
            // However, schema says status is a String default "ACTIVE". 
            // Let's assume we toggle it for cleanliness, though user didn't ask for explicit Status field edit, just auto-sync.
            /*
               The user requested: "Add logic that automatically changes the status to 'OUT_OF_STOCK' if the stock count reaches 0."
               Warning: The schema implementation I saw earlier used `status String @default("ACTIVE")`.
               I will adhere to the user request.
            */
            if (data.stock === 0) {
                updateData.status = "OUT_OF_STOCK";
            } else {
                updateData.status = "ACTIVE";
            }
        }

        await db.product.update({
            where: { id: productId },
            data: updateData
        });

        revalidatePath("/dashboard/products");
        revalidatePath("/dashboard");
        revalidatePath("/shop");

        return { success: true, message: "Product updated successfully" };
    } catch (error) {
        console.error("Failed to update product:", error);
        return { success: false, message: "Failed to update product" };
    }
}
