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
        <nav className="fixed top-0 inset-x-0 z-[60] h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-none transition-all duration-300">
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
                    <Link href="/" prefetch={true} className="group relative text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="/shop" prefetch={true} className="group relative text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                        Shop
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="/collections" prefetch={true} className="group relative text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                        Collections
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="/about" prefetch={true} className="group relative text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                        About
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </Link>
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
                            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-secondary text-[10px] font-bold flex items-center justify-center rounded-full">
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
