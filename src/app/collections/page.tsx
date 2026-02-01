"use client";

import CollectionHero from "@/components/collections/CollectionHero";
import CollectionFilterBar from "@/components/collections/CollectionFilterBar";
import CollectionGrid from "@/components/collections/CollectionGrid";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { SearchInput } from "@/components/shop/SearchInput";

export const dynamic = "force-dynamic";

export default function CollectionsPage() {
    const { count, setIsOpen } = useCart();

    return (
        <div className="bg-white text-slate-900 font-sans antialiased min-h-screen">
            {/* Minimalist Top Nav (Global) */}
            <nav className="fixed top-0 inset-x-0 z-[60] h-16 bg-white/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
                <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
                    {/* Left: Menu & Logo */}
                    <div className="flex items-center gap-4">
                        <button

                            className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-full"
                        >
                            <Menu size={24} />
                        </button>
                        <Link href="/shop" className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-xl shadow-lg">
                                <svg className="size-6 text-white" fill="currentColor" viewBox="0 0 48 48">
                                    <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-sans font-bold tracking-tight text-slate-900">Nexus<span className="text-blue-600">Store</span></span>
                        </Link>
                    </div>

                    {/* Center: Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium hover:text-[#2563eb] transition-colors">Home</Link>
                        <Link href="/shop" className="text-sm font-medium hover:text-[#2563eb] transition-colors">Shop</Link>
                        <Link href="/collections" className="text-sm font-medium text-black">Collections</Link>
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

            <CollectionHero />
            <CollectionFilterBar />
            <CollectionGrid />

            {/* Footer */}
            <footer className="bg-slate-900 text-white pt-20 pb-10">
                <div className="max-w-[1600px] mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <span className="text-xl font-bold tracking-tight">NexusStore</span>
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
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 transition">IG</a>
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 transition">TW</a>
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 transition">YT</a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
                        <p>&copy; 2024 NexusStore. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
