import { db } from "@/lib/db";
import ShopClient from "@/components/shop/ShopClient";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import DynamicStorefront from "@/components/DynamicStorefront";
import type { StorefrontSectionData, SectionType, SectionContent } from "@/types/storefront";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shop All Products | ShopyStore",
    description: "Browse our complete catalog of premium products, clothing, electronics and more curated from top sellers.",
};

export const revalidate = 3600;

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
    const where: any = {
        AND: [
            // Search Query
            q ? {
                OR: [
                    { name: { contains: q, mode: "insensitive" } },
                    { description: { contains: q, mode: "insensitive" } },
                ],
            } : {},
            // Category
            category ? { category: { equals: category, mode: "insensitive" } } : {},
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
    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };
    // "relevance" usually requires full-text search engine (Algolia/Typesense)
    // For simple Prisma, we default to newest or maybe sort by match? 
    // Prisma fulltext is experimental. Defaulting to created desc for relevance fallback.

    const finalOrderBy: any[] = [
        orderBy,
        { id: "asc" }
    ];

    // ── StorefrontSection: fetch ONLY active sections, ordered by position ──────
    // This is the critical query — `where: { isActive: true }` means toggling a
    // section to Inactive in the admin immediately stops it rendering here.
    const rawSections = await db.storefrontSection.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });

    const storefrontSections: StorefrontSectionData[] = rawSections.map((s: any) => ({
        id: s.id,
        type: s.type as SectionType,
        title: s.title,
        order: s.order,
        isActive: s.isActive,
        content: s.content as unknown as SectionContent,
        updatedAt: s.updatedAt,
    }));

    // Execute product query
    const [products, totalCount] = await Promise.all([
        db.product.findMany({
            where,
            orderBy: finalOrderBy,
            take: pageSize,
            skip,
            include: { store: true }
        }),
        db.product.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    // Serialization
    const formattedProducts = products.map((product: any) => ({
        ...product,
        price: product.price.toNumber(),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        rating: 4.5,
        reviewCount: Math.floor(Math.random() * 500) + 10,
        isBestSeller: Math.random() > 0.8,
    }));

    return (
        <>
            {/* ── Dynamic CMS Sections (renders HERO, PROMO, STATS if active) ── */}
            {/* Falls back gracefully to nothing if DB has no active sections */}
            <DynamicStorefront sections={storefrontSections} />

            {/* ── Product listing & existing hardcoded banners ── */}
            <ShopClient
                products={formattedProducts}
                totalPages={totalPages}
                currentPage={currentPage}
            />
        </>
    );
}

export default function ShopPage(props: any) {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ShopContent {...props} />
        </Suspense>
    );
}
