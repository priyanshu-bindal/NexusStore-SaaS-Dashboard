"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addReview(productId: string, rating: number, comment: string) {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return { error: "You must be logged in to review a product." };
    }

    if (rating < 1 || rating > 5) {
        return { error: "Invalid rating. Must be between 1 and 5 stars." };
    }

    try {
        const userId = session.user.id;

        // Check if user already reviewed
        const existingReview = await db.review.findFirst({
            where: {
                userId,
                productId,
            },
        });

        if (existingReview) {
            return { error: "You have already reviewed this product." };
        }

        await db.review.create({
            data: {
                userId,
                productId,
                rating,
                comment,
            },
        });

        revalidatePath(`/shop/${productId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to add review:", error);
        return { error: "Failed to post review. Please try again." };
    }
}

export async function getProductReviews(productId: string) {
    try {
        const reviews = await db.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return reviews;
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        return [];
    }
}
