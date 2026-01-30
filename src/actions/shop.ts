"use server";

import { db } from "@/lib/db";
import { Prisma } from "@/generated/client";

type GetProductsParams = {
    page?: number;
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    brand?: string;
    color?: string;
    sort?: string;
};

export async function getProductsAction(params: GetProductsParams) {
    const { q, category, minPrice, maxPrice, brand, color, sort, page = 1 } = params;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // Filters Construction (Matching ShopPage logic)
    const where: Prisma.ProductWhereInput = {
        AND: [
            // Search Query
            q ? {
                OR: [
                    { name: { contains: q, mode: "insensitive" } },
                    { description: { contains: q, mode: "insensitive" } },
                ],
            } : {},
            // Category (Mapped)
            category ? {
                OR: [
                    { category: { equals: category, mode: "insensitive" } },
                    // Smart Mapping for Collections
                    ...(category.toLowerCase() === "clothing" ? [
                        { category: { contains: "shirt", mode: "insensitive" } },
                        { category: { contains: "jeans", mode: "insensitive" } },
                        { category: { contains: "dress", mode: "insensitive" } },
                        { category: { contains: "top", mode: "insensitive" } },
                        { category: { contains: "pants", mode: "insensitive" } },
                        { category: { contains: "jacket", mode: "insensitive" } },
                    ] : []),
                    ...(category.toLowerCase() === "shoes" ? [
                        { category: { contains: "sneaker", mode: "insensitive" } },
                        { category: { contains: "boot", mode: "insensitive" } },
                        { category: { contains: "sandal", mode: "insensitive" } },
                        { category: { contains: "heel", mode: "insensitive" } },
                    ] : []),
                    ...(category.toLowerCase() === "accessories" ? [
                        { category: { contains: "bag", mode: "insensitive" } },
                        { category: { contains: "hat", mode: "insensitive" } },
                        { category: { contains: "scarf", mode: "insensitive" } },
                        { category: { contains: "jewelry", mode: "insensitive" } },
                    ] : []),
                    // Also check description for broader match
                    { description: { contains: category, mode: "insensitive" } }
                ]
            } : {},
            // Price Range
            {
                price: {
                    gte: minPrice ? Number(minPrice) : 0,
                    lte: maxPrice ? Number(maxPrice) : 50000,
                }
            },
            // Brand
            brand ? { brand: { equals: brand, mode: "insensitive" } } : {},
            // Colors (Array contains)
            color ? { colors: { has: color } } : {},
        ]
    };

    // Sorting Logic
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };

    try {
        const products = await db.product.findMany({
            where,
            orderBy,
            take: pageSize,
            skip,
            include: { store: true }
        });

        // Format products for client
        const formattedProducts = products.map((product) => ({
            ...product,
            price: product.price.toNumber(),
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            // Ensure these optional fields exist to match client type
            rating: 4.5,
            isBestSeller: false,
        }));

        return { products: formattedProducts };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { products: [] };
    }
}
