"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TrendBanner() {
    return (
        <section className="w-full py-10 my-8 bg-slate-900 relative overflow-hidden rounded-2xl mx-auto max-w-[1440px]">
            {/* Background Pattern/Image */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop')", // High fashion monochrome feel
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    mixBlendMode: 'overlay'
                }}
            />

            <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="text-center md:text-left md:pl-12">
                    <span className="text-yellow-400 font-bold tracking-widest uppercase text-xs mb-2 block">
                        Trending Now
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        The Monochrome Edit
                    </h2>
                    <p className="text-slate-300 max-w-md">
                        Master the art of minimalism with our curated selection of black and white essentials.
                    </p>
                </div>

                <div className="md:pr-12">
                    <Link
                        href="/shop?category=clothing"
                        className="group flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-yellow-400 transition-all"
                    >
                        Explore Trend
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
