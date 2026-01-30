"use client";

import { ArrowRight } from "lucide-react";

export default function ComingSoonBanner() {
    return (
        <section className="relative w-full overflow-hidden rounded-3xl mt-12 mb-12">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop')", // Clothing store interior
                }}
            >
                <div className="absolute inset-0 bg-black/40" /> {/* Dark Overlay */}
            </div>

            {/* Content Content - Left Aligned */}
            <div className="relative z-10 p-8 md:p-12 lg:p-20 flex flex-col items-start justify-center h-full min-h-[500px] max-w-2xl">
                {/* Badge */}
                <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-6">
                    <span className="text-white text-sm font-medium tracking-wide">Coming Soon</span>
                </div>

                {/* Headline */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                    Reinvent Your <br /> Daily Routine
                </h2>

                {/* Subtext */}
                <p className="text-white/90 text-lg md:text-xl font-medium mb-10 max-w-lg">
                    Our new collection drops in 3 days. Sign up for early access and a 15% discount.
                </p>

                {/* Input Field */}
                <div className="flex w-full max-w-md gap-3 bg-white/10 backdrop-blur-sm p-2 rounded-2xl border border-white/10">
                    <input
                        type="email"
                        placeholder="Enter email"
                        className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-white/60 focus:outline-none text-lg"
                    />
                    <button className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors">
                        Join
                    </button>
                </div>
            </div>

            {/* Optional: Add gradient for text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none" />
        </section>
    );
}
