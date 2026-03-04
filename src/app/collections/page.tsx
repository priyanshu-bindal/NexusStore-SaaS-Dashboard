"use client";

import CollectionHero from "@/components/collections/CollectionHero";
import CollectionFilterBar from "@/components/collections/CollectionFilterBar";
import CollectionGrid from "@/components/collections/CollectionGrid";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { SearchInput } from "@/components/shop/SearchInput";

import { Suspense, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export const dynamic = "force-dynamic";

function CollectionsContent() {
    const { count, setIsOpen } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="bg-white text-slate-900 font-sans antialiased min-h-screen">
            {/* Minimalist Top Nav (Global) */}
            <nav className="fixed top-0 inset-x-0 z-[60] h-16 bg-white/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
                <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
                    {/* Left: Menu & Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-full"
                        >
                            <Menu size={24} />
                        </button>
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src="/logo-icon.png"
                                alt="Shopystore Icon"
                                className="h-10 w-auto object-contain"
                            />
                            <span className="text-xl md:text-2xl font-bold font-sans tracking-tight text-primary">ShopyStore</span>
                        </Link>
                    </div>

                    {/* Center: Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium hover:text-[#d97706] transition-colors">Home</Link>
                        <Link href="/shop" className="text-sm font-medium hover:text-[#d97706] transition-colors">Shop</Link>
                        <Link href="/collections" className="text-sm font-medium text-black">Collections</Link>
                        <Link href="/about" className="text-sm font-medium hover:text-[#d97706] transition-colors">About</Link>
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
                                <span className="absolute top-1 right-1 w-4 h-4 bg-[#d97706] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {count}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            <CollectionHero />
            <CollectionFilterBar />
            <CollectionGrid />

            {/* Footer */}
            <footer className="bg-slate-900 text-white pt-20 pb-10">
                <div className="max-w-[1600px] mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">S</span>
                                </div>
                                <span className="text-xl font-bold tracking-tight">Shopystore</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed">Refining the essential wardrobe with modern cuts and sustainable materials.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Shop</h4>
                            <ul className="space-y-4 text-slate-400 text-sm">
                                <li><a href="#" className="hover:text-white transition">New Arrivals</a></li>
                                <li><a href="#" className="hover:text-white transition">Best Sellers</a></li>
                                <li><a href="#" className="hover:text-white transition">Accessories</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Support</h4>
                            <ul className="space-y-4 text-slate-400 text-sm">
                                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                                <li><a href="#" className="hover:text-white transition">Shipping & Returns</a></li>
                                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Stay Connected</h4>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-600 transition">IG</a>
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-600 transition">TW</a>
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-600 transition">YT</a>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                        <p>&copy; 2024 Shopystore. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function CollectionsPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <CollectionsContent />
        </Suspense>
    );
}
