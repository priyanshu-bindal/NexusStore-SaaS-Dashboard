"use client";

import Link from "next/link";
import Image from "next/image";

export default function SplitFeatureBanner() {
    return (
        <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[400px]">
                {/* Text Content */}
                <div className="bg-[#FFF9EE] rounded-[32px] p-8 md:p-16 flex flex-col justify-center items-start h-full">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#5C3D2E] mb-6 leading-tight">
                        Minimalist <br />
                        Living Spaces
                    </h2>
                    <p className="text-[#8B6E5F] text-lg mb-8 max-w-md">
                        Crafted for comfort. Designed for the modern home explorer.
                    </p>
                    <Link
                        href="/shop?category=home"
                        className="text-[#5C3D2E] font-bold text-lg underline decoration-2 underline-offset-4 hover:text-black transition-colors"
                    >
                        Explore Collection
                    </Link>
                </div>

                {/* Image */}
                <div className="relative rounded-[32px] overflow-hidden h-[300px] lg:h-full">
                    <Image
                        src="https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?q=80&w=2000&auto=format&fit=crop"
                        alt="Minimalist Living Space"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                </div>
            </div>
        </section>
    );
}
