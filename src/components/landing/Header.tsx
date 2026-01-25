
"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#dbdfe6] bg-white/80 backdrop-blur-md">
            <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="text-primary size-8">
                        <svg
                            fill="currentColor"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">NexusStore</h2>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="#"
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        Documentation
                    </Link>
                    <Link
                        href="#"
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        Features
                    </Link>
                    <Link
                        href="#"
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        Pricing
                    </Link>
                </nav>
                <div className="flex items-center gap-3">
                    <Link
                        href="/sign-in"
                        className="hidden sm:flex text-sm font-bold px-4 py-2 rounded-lg bg-[#f0f2f4] hover:bg-[#e2e4e7] transition-colors cursor-pointer"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/get-started"
                        className="flex text-sm font-bold px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                        Get Started
                    </Link>
                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="size-6" />
                    </button>
                </div>
            </div>
            {/* Mobile Menu simple implementation */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-[#dbdfe6] bg-white p-4 flex flex-col gap-4">
                    <Link
                        href="#"
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        Documentation
                    </Link>
                    <Link
                        href="#"
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        Features
                    </Link>
                    <Link
                        href="#"
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        Pricing
                    </Link>
                    <button className="text-sm font-bold px-4 py-2 rounded-lg bg-[#f0f2f4] hover:bg-[#e2e4e7] transition-colors text-left">
                        Sign In
                    </button>
                </div>
            )}
        </header>
    );
}
