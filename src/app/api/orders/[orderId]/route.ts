import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        const order = await db.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                images: true,
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Serialize decimal values
        const serializedOrder = {
            ...order,
            totalAmount: Number(order.totalAmount),
            createdAt: order.createdAt.toISOString(),
            orderItems: order.orderItems.map(item => ({
                ...item,
                price: Number(item.price),
            }))
        };

        return NextResponse.json(serializedOrder);
    } catch (error) {
        console.error("Failed to fetch order:", error);
        return NextResponse.json(
            { error: "Failed to fetch order" },
            { status: 500 }
        );
    }
}
