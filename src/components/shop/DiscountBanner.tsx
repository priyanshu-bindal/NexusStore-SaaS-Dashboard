"use client";

import Link from "next/link";

export default function DiscountBanner() {
    return (
        <section className="w-full py-10 my-8 bg-[#eef2ff] relative overflow-hidden rounded-2xl mx-auto max-w-[1440px]">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 opacity-10"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2070&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#c7d2fe] rounded-full blur-3xl opacity-50 z-0" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-[#e0e7ff] rounded-full blur-3xl opacity-50 z-0" />

            <div className="max-w-7xl mx-auto px-4 relative z-10 text-center flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left md:ml-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-800 text-xs font-bold tracking-wider uppercase mb-3">
                        Limited Time Offer
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                        Mid-Season Sale
                    </h2>
                    <p className="text-base text-slate-600 max-w-md leading-relaxed">
                        Get up to <span className="font-bold text-blue-600">50% OFF</span> on selected summer styles.
                    </p>
                </div>

                <div className="md:mr-12">
                    <Link
                        href="/shop?sort=price_asc"
                        className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                    >
                        Shop Sale
                    </Link>
                </div>
            </div>
        </section>
    );
}
