"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlassProductCard from "./GlassProductCard";

// Mock Data matching the user's request image for visual fidelity
const featuredProducts = [
    {
        id: "feat-1",
        name: "Classic Aviators",
        price: 129.00,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "feat-2",
        name: "Modern Analog",
        price: 89.00,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "feat-3",
        name: "Runner X2",
        price: 150.00,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "feat-4",
        name: "Pro Audio Z",
        price: 299.00,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"
    }
];

export default function FeaturedProductsSection() {
    return (
        <section className="w-full py-12 max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex items-center justify-end mb-8">
                <Link
                    href="/shop"
                    className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                    View More
                    <ArrowRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                    <GlassProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
