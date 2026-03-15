export const revalidate = 3600;

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetails from "@/components/shop/ProductDetails";
import { getProductRecommendations } from "@/actions/recommendations";
import { Suspense } from "react";
import { ProductReviews } from "@/components/reviews/ProductReviews";
import { getProductReviews } from "@/actions/review";
import { auth } from "@/auth";

interface ProductPageProps {
    params: Promise<{
        productId: string;
    }>;
}

export async function generateStaticParams() {
    const topProducts = await db.product.findMany({
        where: { status: "ACTIVE" },
        orderBy: { orderItems: { _count: 'desc' } },
        take: 100,
        select: { id: true },
    });

    return topProducts.map((product) => ({
        productId: product.id,
    }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { productId } = await params;
    const product = await db.product.findUnique({
        where: { id: productId },
        select: { name: true, description: true, images: true }
    });

    if (!product) {
        return {
            title: "Product Not Found | ShopyStore",
            description: "The requested product could not be found.",
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    return {
        title: `${product.name} | ShopyStore`,
        description: product.description.substring(0, 160),
        alternates: {
            canonical: `${baseUrl}/shop/${productId}`,
        },
        openGraph: {
            title: product.name,
            description: product.description.substring(0, 160),
            url: `${baseUrl}/shop/${productId}`,
            images: product.images[0] ? [
                {
                    url: product.images[0],
                    width: 800,
                    height: 600,
                    alt: product.name,
                }
            ] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.description.substring(0, 160),
            images: product.images[0] ? [product.images[0]] : [],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { productId } = await params;

    // Fetch Product, Recommendations, and Aggregated Rating in parallel
    const [product, relatedProducts, reviewStats] = await Promise.all([
        db.product.findUnique({
            where: { id: productId },
            include: { store: true }
        }),
        getProductRecommendations(productId, 4), // Hybrid scoring
        db.review.aggregate({
            where: { productId },
            _avg: { rating: true },
            _count: { id: true },
        })
    ]);

    if (!product) {
        notFound();
    }

    const avgRating = reviewStats._avg.rating || 0;
    const totalReviews = reviewStats._count.id || 0;

    // Serialize Data
    // We sanitize nulls to empty strings for specific fields to satisfy component props
    const serializedProduct = {
        ...product,
        price: product.price.toNumber(),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        category: product.category || "",
        brand: product.brand || "",
        isBestSeller: false
    };

    const serializedRelated = relatedProducts.map(p => ({
        ...p,
        price: p.price.toNumber(),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        category: p.category || "",
        brand: p.brand || ""
    }));

    return (
        <div className="min-h-screen bg-white">
            <ProductDetails
                product={serializedProduct}
                relatedProducts={serializedRelated}
                avgRating={avgRating}
                totalReviews={totalReviews}
            />

            <Suspense fallback={
                <div className="max-w-[1248px] mx-auto px-[18px] py-10 space-y-8 animate-pulse">
                    <div className="h-8 w-48 bg-slate-200 rounded-lg" />
                    <div className="h-32 bg-slate-200 rounded-2xl" />
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="h-24 bg-slate-200 rounded-xl" />
                        ))}
                    </div>
                </div>
            }>
                <ReviewsContainer productId={productId} />
            </Suspense>
        </div>
    );
}

// --------------------------------------------------------------------------
// Async Server Component for Fetching Reviews
// --------------------------------------------------------------------------
async function ReviewsContainer({ productId }: { productId: string }) {
    const session = await auth();
    const reviews = await getProductReviews(productId);

    return (
        <div className="max-w-[1248px] mx-auto px-[18px] pb-24">
            <ProductReviews
                productId={productId}
                reviews={reviews}
                currentUser={session?.user && session.user.id ? { id: session.user.id, name: session.user.name, image: session.user.image } : null}
            />
        </div>
    );
}
