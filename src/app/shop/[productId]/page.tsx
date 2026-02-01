// Force dynamic rendering for fresh data
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/shop/ProductDetails";
import { getProductRecommendations } from "@/actions/recommendations";
import { Suspense } from "react";
import { ProductReviews } from "@/components/reviews/ProductReviews";
import { getProductReviews } from "@/actions/review";
import { auth } from "@/auth";

interface ProductPageProps {
    params: {
        productId: string;
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { productId } = await params;

    // 1. Fetch Product and Recommendations in parallel using hybrid algorithm
    const [product, relatedProducts] = await Promise.all([
        db.product.findUnique({
            where: { id: productId },
            include: { store: true }
        }),
        getProductRecommendations(productId, 4) // Hybrid scoring: 40% category, 20% price, 15% brand, 15% attributes, 10% popularity
    ]);

    if (!product) {
        notFound();
    }

    // 3. Serialize Data
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

    // 2. Fetch Aggregated Rating
    const reviewStats = await db.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { id: true },
    });
    const avgRating = reviewStats._avg.rating || 0;
    const totalReviews = reviewStats._count.id || 0;

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
