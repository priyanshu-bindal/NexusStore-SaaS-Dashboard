"use client";

import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Menu,
    Search,
    ShoppingBag,
    ShoppingCart,
    Star,
    User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation"; // Added import
import HeroSlider from "./HeroSlider";
import { useCart } from "@/context/CartContext";

type Product = {
    id: string;
    name: string;
    description: string;
    price: string | number;
    images: string[];
    category?: string | null;
    stock: number;
    rating?: number; // Optional until added to DB
    isBestSeller?: boolean; // Optional until added to DB
};

import { SearchInput } from "./SearchInput";

export default function ShopClient({ products }: { products: Product[] }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { count, setIsOpen, addToCart } = useCart();
    const searchParams = useSearchParams(); // Added hook
    const query = searchParams.get("q"); // Added hook

    // ... (rest of component)

    return (
        <div className="bg-[#f8fafc] text-slate-900 font-sans antialiased min-h-screen">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-8">
                        {/* Logo */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="text-[#2563eb] size-8">
                                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight hidden md:block">NexusStore</span>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-lg mx-8">
                            <SearchInput />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-5">
                            <Link
                                href="/profile"
                                className="hidden lg:flex items-center gap-1 font-medium text-sm text-slate-600 hover:text-[#2563eb] transition-colors"
                                title="My Account"
                            >
                                <User className="size-5" />
                                <span>My Account</span>
                            </Link>
                            <button
                                onClick={() => setIsOpen(true)}
                                className="relative p-2 text-slate-600 hover:text-[#2563eb] transition-colors"
                            >
                                <ShoppingBag className="size-6" />
                                {count > 0 && (
                                    <span className="absolute top-1 right-1 size-4 bg-[#2563eb] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                        {count}
                                    </span>
                                )}
                            </button>
                            <button
                                className="md:hidden text-slate-600"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <Menu className="size-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <HeroSlider />

                {/* Content Layout */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="sticky top-24 space-y-8">
                            {/* Categories */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                    Categories
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        "All Products",
                                        "Electronics",
                                        "Fashion",
                                        "Home & Living",
                                    ].map((cat, idx) => (
                                        <label
                                            key={idx}
                                            className="flex items-center gap-3 cursor-pointer group"
                                        >
                                            <input
                                                type="checkbox"
                                                defaultChecked={idx === 0}
                                                className="rounded text-[#2563eb] focus:ring-[#2563eb]/20 border-slate-300 size-4 accent-[#2563eb]"
                                            />
                                            <span className="text-slate-600 group-hover:text-[#2563eb] transition-colors text-sm">
                                                {cat}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                    Price Range
                                </h3>
                                <div className="space-y-4">
                                    <input
                                        className="w-full accent-[#2563eb] h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                        max="5000"
                                        min="0"
                                        type="range"
                                    />
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                                        <span>$0</span>
                                        <span>$5,000+</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                    Customer Rating
                                </h3>
                                <div className="space-y-2">
                                    <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#2563eb] transition-colors">
                                        <span className="flex text-yellow-400">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className="size-[18px] fill-current"
                                                    strokeWidth={0}
                                                />
                                            ))}
                                        </span>
                                        <span className="font-medium">& Up</span>
                                    </button>
                                </div>
                            </div>

                            {/* Member Special */}
                            <div className="p-4 bg-[#135bec]/5 rounded-2xl border border-[#135bec]/10">
                                <p className="text-xs font-bold text-[#135bec] uppercase tracking-widest mb-2">
                                    Member Special
                                </p>
                                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                    Get free shipping on all orders over $99. Join our loyalty
                                    program today.
                                </p>
                                <Link
                                    href="#"
                                    className="text-[#135bec] font-bold text-sm hover:underline"
                                >
                                    Learn More →
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {query ? `Results for "${query}"` : "Recommended for You"}
                                </h2>
                                <p className="text-sm text-slate-500">Showing {products.length} products</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <select className="bg-white border-slate-200 border rounded-lg text-sm focus:ring-[#2563eb]/20 focus:border-[#2563eb] px-4 py-2 outline-none">
                                    <option>Sort by: Popularity</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest First</option>
                                </select>
                            </div>
                        </div>

                        {products.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                                <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
                                <h3 className="mt-2 text-sm font-semibold text-slate-900">No products</h3>
                                <p className="mt-1 text-sm text-slate-500">Get started by creating a new product.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <Link
                                        href={`/shop/${product.id}`}
                                        key={product.id}
                                        className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-[#2563eb]/20 group block"
                                    >
                                        <div className="relative aspect-square overflow-hidden bg-slate-100">
                                            {product.images[0] && (
                                                <img
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    src={product.images[0]}
                                                />
                                            )}
                                            {!product.images[0] && (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                                    <ShoppingBag className="w-12 h-12" />
                                                </div>
                                            )}
                                            <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-red-500 transition-colors cursor-pointer z-10" onClick={(e) => e.preventDefault()}>
                                                <Heart className="size-5" />
                                            </button>
                                            {product.isBestSeller && (
                                                <div className="absolute bottom-3 left-3 bg-[#135bec] text-white text-[10px] font-bold px-2 py-1 rounded">
                                                    BEST SELLER
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center gap-1 mb-2">
                                                <span className="flex text-yellow-400">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star
                                                            key={s}
                                                            className="size-4 fill-current"
                                                            strokeWidth={0}
                                                        />
                                                    ))}
                                                </span>
                                                <span className="text-xs text-slate-400 font-medium">
                                                    ({product.rating || 0})
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                                                {product.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-black text-slate-900">
                                                    ${Number(product.price).toFixed(2)}
                                                </span>
                                                <button
                                                    className="flex items-center gap-2 bg-slate-900 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#2563eb] transition-colors cursor-pointer z-10 active:scale-95"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        addToCart(product);
                                                    }}
                                                >
                                                    <ShoppingCart className="size-[18px]" />
                                                    Quick Add
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="mt-12 flex items-center justify-center gap-2">
                            <button className="size-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-[#2563eb] hover:border-[#2563eb] transition-colors">
                                <ChevronLeft className="size-6" />
                            </button>
                            <button className="size-10 flex items-center justify-center rounded-lg bg-[#2563eb] text-white font-bold">
                                1
                            </button>
                            <span className="px-2 text-slate-400">...</span>
                            <button className="size-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-[#2563eb] hover:border-[#2563eb] transition-colors">
                                <ChevronRight className="size-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-slate-200 mt-20 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="text-[#2563eb] size-6">
                                    <svg
                                        fill="currentColor"
                                        viewBox="0 0 48 48"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                                    </svg>
                                </div>
                                <span className="text-lg font-bold">NexusStore</span>
                            </div>
                            <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-6">
                                The ultimate destination for tech enthusiasts, fashion forward
                                individuals, and home design lovers. Quality and trust in every
                                purchase.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
