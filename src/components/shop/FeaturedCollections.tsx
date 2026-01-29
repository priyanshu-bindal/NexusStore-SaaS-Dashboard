"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollectionItem {
    id: number;
    title: string;
    image: string;
    href: string;
    description?: string;
    highlight?: boolean;
}

interface FeaturedCollectionsProps {
    banners?: CollectionItem[];
}

const defaultBanners: CollectionItem[] = [
    {
        id: 1,
        title: "New Arrivals",
        description: "Fresh styles for the new season",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        href: "/shop?category=new-in"
    },
    {
        id: 2,
        title: "Best Sellers",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
        href: "/shop?sort=popularity"
    },
    {
        id: 3,
        title: "Accessories",
        image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=1000&auto=format&fit=crop",
        href: "/shop?category=accessories"
    },
    {
        id: 4,
        title: "Limited Edition",
        image: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=1000&auto=format&fit=crop",
        href: "/shop?category=limited"
    },
    {
        id: 5,
        title: "Flash Sale",
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
        href: "/shop?sort=price_asc",
        highlight: true
    }
];

export default function FeaturedCollections({ banners = defaultBanners }: FeaturedCollectionsProps) {
    return (
        <section className="w-full py-8 md:py-12 bg-white">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Curated Collections</h2>
                    <Link href="/collections" className="text-sm font-bold text-slate-500 hover:text-black transition-colors flex items-center gap-1">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[600px] auto-rows-[200px] md:auto-rows-auto">
                    {banners.map((item, index) => {
                        // First item is Main Feature (2x2)
                        const isMain = index === 0;

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={cn(
                                    "group relative rounded-2xl overflow-hidden block bg-slate-100",
                                    isMain ? "md:col-span-2 md:row-span-2" : "col-span-1 row-span-1"
                                )}
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${item.image}')` }}
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-6">
                                    <h3 className={cn(
                                        "font-bold text-white mb-1",
                                        isMain ? "text-3xl md:text-4xl" : "text-xl",
                                        item.highlight ? "text-red-400" : ""
                                    )}>
                                        {item.title}
                                    </h3>

                                    {isMain && item.description && (
                                        <p className="text-white/80 text-lg mb-4 max-w-md hidden md:block">
                                            {item.description}
                                        </p>
                                    )}

                                    <div className={cn(
                                        "flex items-center gap-2 text-white font-medium transition-all duration-300",
                                        isMain
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                                    )}>
                                        <span className="text-sm uppercase tracking-wider">Shop Now</span>
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
