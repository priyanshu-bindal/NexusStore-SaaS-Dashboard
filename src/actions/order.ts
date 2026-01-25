"use server";
// Force rebuild

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createOrder(items: { productId: string; quantity: number }[]) {
    try {
        const session = await auth();
        // 1. Fetch products to get real prices (security)
        const productIds = items.map(i => i.productId);
        const products = await db.product.findMany({
            where: { id: { in: productIds } }
        });

        // 2. Calculate Total & Prepare Order Items
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) continue;

            const price = Number(product.price);
            totalAmount += price * item.quantity;

            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price // Store snapshot of price
            });
        }

        if (orderItemsData.length === 0) {
            return { error: "No valid products found" };
        }

        // 3. Create Order
        const order = await db.order.create({
            data: {
                storeId: products[0].storeId, // Assuming single store for now
                totalAmount: totalAmount,
                status: "PAID", // Mocking payment success
                userId: session?.user?.id, // Link to user if logged in
                orderItems: {
                    create: orderItemsData
                }
            }
        });

        revalidatePath("/orders");
        revalidatePath("/dashboard");

        return { success: true, orderId: order.id };
    } catch (error) {
        console.error("Create Order Error:", error);
        return { error: "Failed to create order" };
    }
}

export async function updateOrderStatus(orderId: string, newStatus: string, fulfillmentStatus?: string) {
    if (!orderId || !newStatus) return { error: "Missing fields" };

    console.log("Updating Order:", { orderId, newStatus, fulfillmentStatus });

    try {
        const dataToUpdate: any = { status: newStatus };
        if (fulfillmentStatus) {
            dataToUpdate.fulfillmentStatus = fulfillmentStatus;
        }

        const result = await db.order.update({
            where: { id: orderId },
            data: dataToUpdate,
        });

        console.log("Update Success:", result);

        revalidatePath(`/orders/${orderId}`);
        revalidatePath("/orders"); // Update list view as well
        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { error: "Failed to update status" };
    }
}
