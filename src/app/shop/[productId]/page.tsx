// Force dynamic rendering for fresh data
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/shop/ProductDetails";
import { getProductRecommendations } from "@/actions/recommendations";

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

    return (
        <div className="min-h-screen bg-white">
            <ProductDetails
                product={serializedProduct}
                relatedProducts={serializedRelated}
            />
        </div>
    );
}
