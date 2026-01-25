"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type CartItemInput = {
    productId: string;
    quantity: number;
};

export async function createOrder(cartItems: CartItemInput[]) {
    try {
        if (!cartItems || cartItems.length === 0) {
            return { error: "Cart is empty" };
        }

        // 1. Fetch products to get prices, stock, and storeId
        const productIds = cartItems.map((item) => item.productId);
        const products = await db.product.findMany({
            where: {
                id: { in: productIds },
            },
            select: {
                id: true,
                price: true,
                stock: true,
                name: true,
                storeId: true, // Fetch storeId
            }
        });

        if (products.length !== cartItems.length) {
            return { error: "Some products not found. Please refresh your cart." };
        }

        // 2. Group items by storeId
        const itemsByStore: Record<string, { productId: string; quantity: number; price: number }[]> = {};

        // This map is needed to validate stock for all items first
        for (const item of cartItems) {
            const product = products.find((p) => p.id === item.productId);
            if (!product) continue;

            if (product.stock < item.quantity) {
                return { error: `Not enough stock for ${product.name}` };
            }

            if (!itemsByStore[product.storeId]) {
                itemsByStore[product.storeId] = [];
            }

            itemsByStore[product.storeId].push({
                productId: product.id,
                quantity: item.quantity,
                price: Number(product.price),
            });
        }

        const createdOrderIds: string[] = [];

        // 3. Transaction
        await db.$transaction(async (tx) => {
            // Iterate over each store to create an order
            for (const [storeId, storeItems] of Object.entries(itemsByStore)) {

                // Calculate total for this store's order
                const storeTotal = storeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                // Create Order for this Store
                const newOrder = await tx.order.create({
                    data: {
                        storeId: storeId,
                        totalAmount: storeTotal,
                        status: "PAID",
                        orderItems: {
                            create: storeItems.map(item => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                price: item.price
                            })),
                        },
                    },
                });

                createdOrderIds.push(newOrder.id);
            }

            // Update Stock (outside the store loop, but inside transaction for efficiency? 
            // Actually, we can just loop through original cartItems to be simple)
            for (const item of cartItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }
        });

        revalidatePath("/dashboard/products");
        revalidatePath("/shop");

        // distinct IDs if multiple orders
        return { success: true, orderId: createdOrderIds[0] };
    } catch (error) {
        console.error("Order creation failed:", error);
        return { error: "Something went wrong while placing the order." };
    }
}
