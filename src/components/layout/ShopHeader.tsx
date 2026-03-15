"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export function ShopHeader() {
    const { count, setIsOpen } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (searchOpen) inputRef.current?.focus();
    }, [searchOpen]);

    const handleClose = () => {
        setSearchOpen(false);
        setQuery("");
    };

    const handleSubmit = () => {
        const trimmed = query.trim();
        if (!trimmed) return;
        router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
        handleClose();
    };

    return (
        <nav className="fixed top-0 inset-x-0 z-[60] h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-none transition-all duration-300">
            <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between relative">

                {/* Animated search overlay */}
                {searchOpen && (
                    <div className="absolute inset-0 z-50 flex items-center px-4 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
                        <Search className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSubmit();
                                if (e.key === "Escape") handleClose();
                            }}
                            placeholder="Search products..."
                            className="flex-1 mx-3 bg-transparent outline-none text-sm placeholder:text-slate-400"
                        />
                        <button
                            onClick={handleClose}
                            aria-label="Close search"
                            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Left: Menu & Logo */}
                <div className="flex items-center gap-4">
                    <button
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                        aria-haspopup="true"
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

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Search icon — always visible */}
                    <button
                        onClick={() => setSearchOpen(true)}
                        aria-label="Open search"
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <Search size={20} className="text-slate-600" />
                    </button>

                    <Link href="/profile" aria-label="User profile" className="p-2 hover:bg-slate-100 rounded-full hidden sm:block">
                        <User size={22} className="text-slate-600" />
                    </Link>
                    <button
                        aria-label="Open cart"
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
                <div id="mobile-menu" className="lg:hidden absolute top-16 inset-x-0 bg-white border-t border-slate-100 p-4 shadow-lg flex flex-col gap-4">
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
