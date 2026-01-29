"use client";

import Link from "next/link";

export default function HeroSection() {
    return (
        <div className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop')"
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-in fade-in zoom-in duration-1000">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                    Summer Essentials
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-10 font-light max-w-2xl mx-auto">
                    Elevate your wardrobe with our latest sustainable fabrics and minimalist cuts.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => {
                            const grid = document.getElementById('product-grid');
                            grid?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-10 py-4 bg-white text-black rounded-full font-bold uppercase tracking-wider hover:bg-neutral-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
                    >
                        Shop Collection
                    </button>
                </div>
            </div>
        </div>
    );
}
