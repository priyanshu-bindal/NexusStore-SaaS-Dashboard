"use client";

import Link from "next/link";
import Image from "next/image";

export default function StyleGridBanner() {
    return (
        <section className="w-full py-12 max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">

                {/* Card 1: Image with Floating Content */}
                <Link href="/shop?category=shoes" className="group relative rounded-[32px] overflow-hidden h-96 md:h-full block">
                    <Image
                        src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop"
                        alt="Autumn Lookbook"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                    {/* Floating Card */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 transition-transform duration-300 group-hover:-translate-y-2">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Autumn Lookbook</h3>
                        <p className="text-slate-600 text-sm">Style inspiration for the cozy season.</p>
                    </div>
                </Link>

                {/* Card 2: Text/Minimal Card */}
                <Link href="/shop?category=streetwear" className="group relative rounded-[32px] overflow-hidden h-96 md:h-full bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-8">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        {/* Abstract background decorative element if needed */}
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor" className="text-slate-900">
                            <circle cx="50" cy="50" r="40" />
                        </svg>
                    </div>

                    <div className="mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Curated Collection</span>
                        <h3 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                            Streetwear <br /> Essentials
                        </h3>
                        <p className="text-slate-500 mb-6">
                            Bold prints and urban silhouettes for the modern creative.
                        </p>
                    </div>

                    <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                    </div>
                </Link>

                {/* Card 3: Image with Floating Content */}
                <Link href="/shop?category=eco" className="group relative rounded-[32px] overflow-hidden h-96 md:h-full block">
                    <Image
                        src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1000&auto=format&fit=crop"
                        alt="Sustainability First"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                    {/* Floating Card */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 transition-transform duration-300 group-hover:-translate-y-2">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Sustainability First</h3>
                        <p className="text-slate-600 text-sm">100% organic cotton and fair trade.</p>
                    </div>
                </Link>

            </div>
        </section>
    );
}
