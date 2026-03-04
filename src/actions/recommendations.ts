"use server";

import { db } from "@/lib/db";

interface ScoredProduct {
    product: any;
    score: number;
}

/**
 * Hybrid Recommendation Algorithm
 * Implements weighted scoring based on multiple factors
 */
export async function getProductRecommendations(
    productId: string,
    limit: number = 4
) {
    try {
        // 1. Fetch current product
        const currentProduct = await db.product.findUnique({
            where: { id: productId },
        });

        if (!currentProduct) {
            return [];
        }

        // 2. Get pool of potential recommendations
        const potentialProducts = await db.product.findMany({
            where: {
                id: { not: productId },
                status: "ACTIVE",
            },
            take: 100, // Get larger pool for scoring
        });

        // 3. Apply hybrid scoring algorithm
        const scoredProducts: ScoredProduct[] = potentialProducts.map((product) => {
            let score = 0;

            // --- CATEGORY MATCH (40% weight) ---
            if (product.category === currentProduct.category && product.category !== null) {
                score += 40;
            }

            // --- PRICE RANGE MATCH (20% weight) ---
            const currentPrice = currentProduct.price.toNumber();
            const productPrice = product.price.toNumber();
            const priceDiff = Math.abs(productPrice - currentPrice);
            const priceRatio = priceDiff / currentPrice;

            if (priceRatio <= 0.3) score += 20; // Within 30%
            else if (priceRatio <= 0.5) score += 15; // Within 50%
            else if (priceRatio <= 0.7) score += 10; // Within 70%

            // --- BRAND MATCH (15% weight) ---
            if (product.brand && currentProduct.brand && product.brand === currentProduct.brand) {
                score += 15;
            }

            // --- COLOR/ATTRIBUTES MATCH (15% weight) ---
            // Color overlap
            const currentColors = currentProduct.colors || [];
            const productColors = product.colors || [];
            const colorOverlap = currentColors.filter((color: string) =>
                productColors.includes(color)
            ).length;
            score += Math.min(colorOverlap * 5, 15);

            // --- POPULARITY/RATING (10% weight) ---
            // New arrivals bonus (created within last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const isNew = new Date(product.createdAt) > thirtyDaysAgo;

            if (isNew) score += 5;

            // Stock availability bonus
            if (product.stock > 0) score += 5;

            return { product, score };
        });

        // 4. Sort by score and return top N
        const recommendations = scoredProducts
            .filter(item => item.score > 0) // Only return items with some relevance
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((item) => item.product);

        return recommendations;
    } catch (error) {
        console.error("Error getting recommendations:", error);
        return [];
    }
}

/**
 * Get "Frequently Bought Together" recommendations
 * Based on collaborative filtering
 */
export async function getFrequentlyBoughtTogether(
    productId: string,
    limit: number = 3
) {
    try {
        // Get orders that contain current product
        const ordersWithProduct = await db.order.findMany({
            where: {
                orderItems: {
                    some: {
                        productId: productId,
                    },
                },
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
            take: 50,
        });

        // Count frequency of other products in these orders
        const productFrequency = new Map<string, number>();

        ordersWithProduct.forEach((order) => {
            order.orderItems.forEach((item) => {
                if (item.productId !== productId) {
                    const count = productFrequency.get(item.productId) || 0;
                    productFrequency.set(item.productId, count + 1);
                }
            });
        });

        // If no collaborative data, fall back to category-based
        if (productFrequency.size === 0) {
            return getProductRecommendations(productId, limit);
        }

        // Sort by frequency and get product details
        const sortedProductIds = Array.from(productFrequency.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([id]) => id);

        const products = await db.product.findMany({
            where: {
                id: { in: sortedProductIds },
                status: "ACTIVE",
            },
        });

        return products;
    } catch (error) {
        console.error("Error getting frequently bought together:", error);
        return [];
    }
}

/**
 * Category-based simple recommendations (fallback)
 */
export async function getCategoryBasedRecommendations(
    productId: string,
    category: string | null,
    limit: number = 4
) {
    if (!category) {
        return [];
    }

    try {
        const products = await db.product.findMany({
            where: {
                id: { not: productId },
                category: category,
                status: "ACTIVE",
            },
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        });

        return products;
    } catch (error) {
        console.error("Error getting category recommendations:", error);
        return [];
    }
}
