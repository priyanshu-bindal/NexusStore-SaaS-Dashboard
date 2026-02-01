import { db } from "@/lib/db";
import ShopClient from "@/components/shop/ShopClient";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function ShopContent({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
        category?: string;
        minPrice?: string;
        maxPrice?: string;
        brand?: string;
        color?: string;
        sort?: string;
        page?: string;
    }>;
}) {
    const params = await searchParams;
    const { q, category, minPrice, maxPrice, brand, color, sort, page } = params;

    // Pagination Logic
    const currentPage = Number(page) || 1;
    const pageSize = 10;
    const skip = (currentPage - 1) * pageSize;

    // Filters Construction
    const where: Prisma.ProductWhereInput = {
        AND: [
            // Search Query
            q ? {
                OR: [
                    { name: { contains: q, mode: "insensitive" as Prisma.QueryMode } },
                    { description: { contains: q, mode: "insensitive" as Prisma.QueryMode } },
                ],
            } : {},
            // Category
            category ? { category: { equals: category, mode: "insensitive" as Prisma.QueryMode } } : {},
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
    // "relevance" usually requires full-text search engine (Algolia/Typesense)
    // For simple Prisma, we default to newest or maybe sort by match? 
    // Prisma fulltext is experimental. Defaulting to created desc for relevance fallback.

    const finalOrderBy: Prisma.ProductOrderByWithRelationInput[] = [
        orderBy,
        { id: "asc" }
    ];

    // Execute Query
    const [products, totalCount] = await Promise.all([
        db.product.findMany({
            where,
            orderBy: finalOrderBy,
            take: pageSize,
            skip,
            include: { store: true } // Optional: include store info if needed
        }),
        db.product.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    // Serialization
    const formattedProducts = products.map((product) => ({
        ...product,
        price: product.price.toNumber(),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        // Mock data for fields if empty during dev
        rating: 4.5,
        reviewCount: Math.floor(Math.random() * 500) + 10,
        isBestSeller: Math.random() > 0.8,
    }));

    return (
        <ShopClient
            products={formattedProducts}
            totalPages={totalPages}
            currentPage={currentPage}
        />
    );
}
