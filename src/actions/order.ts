"use server";
// Force rebuild

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createOrder(items: { productId: string; quantity: number; size?: string }[]) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            throw new Error("Unauthorized: You must be logged in to place an order.");
        }

        return await db.$transaction(async (tx) => {
            // 1. Fetch products to get real prices and check stock
            const productIds = items.map(i => i.productId);
            const products = await tx.product.findMany({
                where: { id: { in: productIds } }
            });

            // Check for missing products
            const foundIds = products.map(p => p.id);
            const missingIds = productIds.filter(id => !foundIds.includes(id));

            if (missingIds.length > 0) {
                return {
                    error: "Some items in your cart are no longer available. We have updated your cart.",
                    missingIds
                };
            }

            // 2. Validate Stock & Calculate Total
            let totalAmount = 0;
            const orderItemsData = [];

            for (const item of items) {
                const product = products.find(p => p.id === item.productId);

                if (!product) {
                    throw new Error(`Product not found: ${item.productId}`);
                }

                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}. Requested: ${item.quantity}, Available: ${product.stock}`);
                }

                // Calculate price
                const price = Number(product.price);
                totalAmount += price * item.quantity;

                orderItemsData.push({
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price,
                    size: item.size // Add size here
                });

                // Decrement Stock
                const updatedProduct = await tx.product.update({
                    where: { id: product.id },
                    data: { stock: { decrement: item.quantity } }
                });

                // Auto-Status Update: If stock hits 0, set to OUT_OF_STOCK
                if (updatedProduct.stock === 0) {
                    await tx.product.update({
                        where: { id: product.id },
                        data: { status: 'OUT_OF_STOCK' }
                    });
                }
            }

            if (orderItemsData.length === 0) {
                throw new Error("No valid products found");
            }

            // 3. Create Order
            const order = await tx.order.create({
                data: {
                    storeId: products[0].storeId,
                    totalAmount: totalAmount,
                    status: "PAID",
                    userId: session?.user?.id,
                    orderItems: {
                        create: orderItemsData
                    }
                }
            });

            return { success: true, orderId: order.id };
        });

    } catch (error: any) {
        console.error("Create Order Error:", error);
        return { error: error.message || "Failed to create order" };
    } finally {
        revalidatePath("/orders");
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/products");
    }
}

export async function updateOrderStatus(orderId: string, newStatus: string, fulfillmentStatus?: string) {
    if (!orderId || !newStatus) return { error: "Missing fields" };

    console.log("Updating Order:", { orderId, newStatus, fulfillmentStatus });

    try {
        await db.$transaction(async (tx) => {
            // 1. Fetch current order status to prevent double-restocking
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: { orderItems: true }
            });

            if (!order) throw new Error("Order not found");

            // 2. Handle Cancellation Reversal (Stock Restoration)
            // Only restore if transitioning TO CANCELLED and wasn't ALREADY CANCELLED
            if (newStatus === 'CANCELLED' && order.status !== 'CANCELLED') {
                console.log("Restoring stock for cancelled order:", orderId);

                for (const item of order.orderItems) {
                    const restoredProduct = await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { increment: item.quantity } }
                    });

                    // Auto-Status Update: If stock > 0, set back to ACTIVE
                    if (restoredProduct.stock > 0 && restoredProduct.status === 'OUT_OF_STOCK') {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: { status: 'ACTIVE' }
                        });
                    }
                }
            }

            // 3. Update Order Status & Create Timeline Event
            const dataToUpdate: any = { status: newStatus };
            if (fulfillmentStatus) {
                dataToUpdate.fulfillmentStatus = fulfillmentStatus;
            }

            await tx.order.update({
                where: { id: orderId },
                data: dataToUpdate,
            });

            // Create Timeline Event
            await tx.timelineEvent.create({
                data: {
                    orderId: orderId,
                    status: newStatus,
                    note: `Status updated to ${newStatus}`
                }
            });
        });

        console.log("Update Success");

        revalidatePath(`/orders/${orderId}`);
        revalidatePath("/orders");
        revalidatePath("/dashboard/products"); // Ensure inventory reflects changes
        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { error: "Failed to update status" };
    }
}
