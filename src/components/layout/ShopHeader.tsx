"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { SearchInput } from "@/components/shop/SearchInput";

export function ShopHeader() {
    const { count, setIsOpen } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
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
                    <Link href="/" className="flex items-center gap-3">
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
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-[#2563eb] transition-colors">Home</Link>
                    <Link href="/shop" className="text-sm font-medium text-slate-600 hover:text-[#2563eb] transition-colors">Shop</Link>
                    <Link href="/collections" className="text-sm font-medium text-slate-600 hover:text-[#2563eb] transition-colors">Collections</Link>
                    <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-[#2563eb] transition-colors">About</Link>
                </div>

                {/* Search Bar */}
                <div className="hidden md:block flex-1 max-w-md mx-6">
                    <SearchInput />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <Link href="/profile" className="p-2 hover:bg-slate-100 rounded-full hidden sm:block">
                        <User size={22} className="text-slate-600" />
                    </Link>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-2 hover:bg-slate-100 rounded-full relative"
                    >
                        <ShoppingBag size={22} className="text-slate-600" />
                        {count > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-[#2563eb] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                {count}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-16 inset-x-0 bg-white border-t border-slate-100 p-4 shadow-lg flex flex-col gap-4">
                    <Link href="/" className="text-sm font-medium">Home</Link>
                    <Link href="/shop" className="text-sm font-medium">Shop</Link>
                    <Link href="/collections" className="text-sm font-medium">Collections</Link>
                    <Link href="/about" className="text-sm font-medium">About</Link>
                    <Link href="/profile" className="text-sm font-medium pb-2 border-b border-slate-100">My Profile</Link>
                </div>
            )}
        </nav>
    );
}
