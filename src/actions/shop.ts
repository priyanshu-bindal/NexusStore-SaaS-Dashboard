"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

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
                    { name: { contains: q, mode: "insensitive" as Prisma.QueryMode } },
                    { description: { contains: q, mode: "insensitive" as Prisma.QueryMode } },
                ],
            } : {},
            // Category (Mapped)
            category ? {
                OR: [
                    { category: { equals: category, mode: "insensitive" as Prisma.QueryMode } },
                    // Smart Mapping for Collections
                    ...(category.toLowerCase() === "clothing" ? [
                        { category: { contains: "shirt", mode: "insensitive" as Prisma.QueryMode } },
                        { category: { contains: "jeans", mode: "insensitive" as Prisma.QueryMode } },
                        { category: { contains: "dress", mode: "insensitive" as Prisma.QueryMode } },
                        { category: { contains: "top", mode: "insensitive" as Prisma.QueryMode } },
                        { category: { contains: "pants", mode: "insensitive" as Prisma.QueryMode } },
                        { category: { contains: "jacket", mode: "insensitive" as Prisma.QueryMode } },
                    ] : []),
                    ...(category.toLowerCase() === "shoes" ? [
                        { category: { contains: "sneaker", mode: "insensitive" as Prisma.QueryMode } },
                        { category: { contains: "boot", mode: "insensitive" as Prisma.QueryMode } },
                        { category: { contains: "sandal", mode: "insensitive" as Prisma.QueryMode } },
                        { category: { contains: "heel", mode: "insensitive" as Prisma.QueryMode } },
                    ] : []),
                    ...(category.toLowerCase() === "accessories" ? [
                        { category: { contains: "bag", mode: "insensitive" as Prisma.QueryMode } },
                        { category: { contains: "hat", mode: "insensitive" as Prisma.QueryMode } },
                        { category: { contains: "scarf", mode: "insensitive" as Prisma.QueryMode } },
                        { category: { contains: "jewelry", mode: "insensitive" as Prisma.QueryMode } },
                    ] : []),
                    // Also check description for broader match
                    { description: { contains: category, mode: "insensitive" as Prisma.QueryMode } }
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
            brand ? { brand: { equals: brand, mode: "insensitive" as Prisma.QueryMode } } : {},
            // Colors (Array contains)
            color ? { colors: { has: color } } : {},
        ]
    };

    // Sorting Logic
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };

    // Add secondary sort for stability
    const finalOrderBy: Prisma.ProductOrderByWithRelationInput[] = [
        orderBy,
        { id: "asc" }
    ];

    try {
        const products = await db.product.findMany({
            where,
            orderBy: finalOrderBy,
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
