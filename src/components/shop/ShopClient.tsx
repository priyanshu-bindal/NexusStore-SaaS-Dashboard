"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ShoppingBag, Menu, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
// import { useInView } from "react-intersection-observer"; // Removed to check if native observer is enough or if package is missing
import { getProductsAction } from "@/actions/shop";
import { motion } from "framer-motion";

// Components
import HeroGrid from "./HeroGrid";
import FilterDrawer from "./FilterDrawer";
import DiscountBanner from "./DiscountBanner";
import TrendBanner from "./TrendBanner";
import MiniBannerGrid from "./MiniBannerGrid";
import CategoryBanner from "./CategoryBanner";
import SplitFeatureBanner from "./SplitFeatureBanner";
import FeaturedProductsSection from "./FeaturedProductsSection";
import StyleGridBanner from "./StyleGridBanner";
import NewsletterSection from "./NewsletterSection";
import ComingSoonBanner from "./ComingSoonBanner";
import { ProductCard } from "./ProductCard";
import { SearchInput } from "./SearchInput";

type Product = {
    id: string;
    name: string;
    description: string;
    price: string | number;
    images: string[];
    category?: string | null;
    stock: number;
    rating?: number;
    isBestSeller?: boolean;
    brand?: string | null;
    createdAt?: Date | string;
};

export default function ShopClient({ products: initialProducts, totalPages = 1, currentPage = 1 }: { products: Product[], totalPages?: number, currentPage?: number }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { count, setIsOpen } = useCart();
    const searchParams = useSearchParams();
    const router = useRouter();

    // Check for active search or category filters
    const query = searchParams.get("q");
    const category = searchParams.get("category");
    const isFiltered = query || category;

    // Infinite Scroll State
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [page, setPage] = useState(1); // Start at 1 (initial load)
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // Reset state when filters change
    useEffect(() => {
        setProducts(initialProducts);
        setPage(1);
        setHasMore(initialProducts.length === 10); // If initial load is full page, assume more
        setLoading(false);
    }, [searchParams, initialProducts]);

    // Load More Function
    const loadMoreProducts = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        const nextPage = page + 1;

        // Construct params from URL
        const params = {
            page: nextPage,
            q: query || undefined,
            category: category || undefined,
            // Add other filters here from searchParams...
            minPrice: searchParams.get("minPrice") || undefined,
            maxPrice: searchParams.get("maxPrice") || undefined,
            brand: searchParams.get("brand") || undefined,
            color: searchParams.get("color") || undefined,
            sort: searchParams.get("sort") || undefined,
        };

        const { products: newProducts } = await getProductsAction(params);

        if (newProducts.length === 0) {
            setHasMore(false);
        } else {
            setProducts((prev) => [...prev, ...newProducts]);
            setPage(nextPage);
            if (newProducts.length < 10) setHasMore(false); // Less than pageSize means end
        }
        setLoading(false);
    };

    // Intersection Observer
    useEffect(() => {
        if (!isFiltered) return; // Only for filtered view? No, maybe all views if products > limit?

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                loadMoreProducts();
            }
        }, { threshold: 0.5, rootMargin: "100px" });

        const sentinel = document.getElementById("scroll-sentinel");
        if (sentinel) observer.observe(sentinel);

        return () => observer.disconnect();
    }, [page, hasMore, loading, isFiltered, query, category, searchParams]); // Dependencies

    return (
        <div className="bg-white text-slate-900 font-sans antialiased min-h-screen">
            {/* Minimalist Top Nav (Global) */}
            <nav className="fixed top-0 inset-x-0 z-[60] h-16 bg-white/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
                <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
                    {/* Left: Menu & Logo */}
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-full">
                            <Menu size={24} />
                        </button>
                        <Link href="/" className="flex items-center gap-2 text-[#2563eb]">
                            <div className="size-8">
                                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                                </svg>
                            </div>
                            <span className="font-bold text-xl tracking-tight hidden sm:block text-slate-900">NexusStore</span>
                        </Link>
                    </div>

                    {/* Center: Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium hover:text-[#2563eb] transition-colors">Home</Link>
                        <Link href="/shop" className="text-sm font-medium text-black">Shop</Link>
                        <Link href="/collections" className="text-sm font-medium hover:text-[#2563eb] transition-colors">Collections</Link>
                        <Link href="/about" className="text-sm font-medium hover:text-[#2563eb] transition-colors">About</Link>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:block flex-1 max-w-md mx-6">
                        <SearchInput />
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        <Link href="/profile" className="p-2 hover:bg-slate-100 rounded-full hidden sm:block">
                            <User size={22} />
                        </Link>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="p-2 hover:bg-slate-100 rounded-full relative"
                        >
                            <ShoppingBag size={22} />
                            {count > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-[#2563eb] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {count}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-16">
                {/* CONDITIONAL CONTENT */}
                {!isFiltered && (
                    <div className="animate-in fade-in duration-700">
                        <HeroGrid />
                        <div className="mt-8">
                            <MiniBannerGrid />
                            <CategoryBanner />
                            <SplitFeatureBanner />
                            <FeaturedProductsSection />
                            <StyleGridBanner />
                            <ComingSoonBanner />
                        </div>
                        <div className="px-4 md:px-8 mt-12 mb-12 space-y-8">
                            <DiscountBanner />
                            <TrendBanner />
                        </div>
                    </div>
                )}

                {/* CASE: Filtered/Search View */}
                {isFiltered && (
                    <div id="product-grid" className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 animate-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold mb-6">
                            {query ? `Search Results: "${query}"` : "Products"}
                        </h2>

                        {products.length === 0 && !loading ? (
                            <div className="text-center py-20 bg-slate-50 rounded-2xl">
                                <h3 className="text-lg font-bold">No products found</h3>
                                <p className="text-slate-500 mb-6">Try adjusting your filters.</p>
                                <button
                                    onClick={() => router.push('/shop')}
                                    className="px-6 py-2 bg-black text-white rounded-full text-sm font-bold"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
                                {products.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: (index % 10) * 0.1 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Loading / Sentinel */}
                        {hasMore && (
                            <div id="scroll-sentinel" className="py-12 flex justify-center w-full">
                                {loading ? (
                                    <Loader2 className="animate-spin text-slate-400" size={32} />
                                ) : (
                                    <div className="h-4 w-full" /> /* Invisible trigger */
                                )}
                            </div>
                        )}

                        {!hasMore && products.length > 0 && (
                            <div className="py-12 text-center text-slate-400 text-sm">
                                You've reached the end
                            </div>
                        )}
                    </div>
                )}
            </main>

            <NewsletterSection />
            <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-6 border-t border-slate-800">
                <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="size-6 text-white">
                            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                            </svg>
                        </div>
                        <span className="text-white font-bold">NexusStore</span>
                    </div>
                    <p className="text-xs">© 2024 NexusStore, Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
