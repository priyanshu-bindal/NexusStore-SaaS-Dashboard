"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const slides = [
    {
        id: 1,
        tag: "Summer 2024 Collection",
        title: "Elevate Your Lifestyle",
        description: "Discover curated premium electronics, fashion, and home essentials.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxiFBJv791OsoDP_ol0J2fDJxPFx-h04zE-k271twqIMAXinUi-2i15Sm90cttKcbLbZABRUUKUSAuAa9Hjro9HQL0sH8Z9jrUjPe3J7IxSfal69R5AHhsdebkxgS3sMc0j-J0TosXcec3D-7odYwOoqhK970mEQnVhMXNCnPzwXL2Xorxoxd_jh9tmdj06Dt2553RjSje9G0bki1gcj5wO2BzE7hC12CC2USmTgsAckmk9uq5fSlTyuETWXxPMgYwG-gOkCqKkJ6w",
        ctaPrimary: "Shop Now",
        ctaSecondary: "View Trends",
    },
    {
        id: 2,
        tag: "New Arrivals",
        title: "Next Gen Tech is Here",
        description: "Upgrade your workflow with the latest high-performance gadgets.",
        image: "https://images.unsplash.com/photo-1531297420497-35645db57550?q=80&w=2660&auto=format&fit=crop", // Tech image
        ctaPrimary: "Explore Tech",
        ctaSecondary: "Learn More",
    },
    {
        id: 3,
        tag: "Limited Time Offer",
        title: "Minimalist Fashion",
        description: "Redefine your style with our exclusive monochrome collection.",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop", // Fashion image
        ctaPrimary: "Browse Lookbook",
        ctaSecondary: "Shop Sale",
    },
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000); // 3 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 h-[300px] mb-12 group">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <div className="absolute inset-0 z-0">
                        <img
                            alt={slide.title}
                            className="w-full h-full object-cover opacity-60"
                            src={slide.image}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
                    </div>
                    <div className="relative z-10 px-8 md:px-16 h-full flex flex-col justify-center max-w-2xl">
                        <span className="inline-block px-3 py-1 bg-[#2563eb]/20 text-[#2563eb] text-xs font-bold uppercase tracking-widest rounded mb-3 w-fit">
                            {slide.tag}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
                            {slide.title}
                        </h1>
                        <p className="text-slate-300 text-base mb-6 max-w-md line-clamp-2">
                            {slide.description}
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-[#2563eb]/20 cursor-pointer text-sm">
                                {slide.ctaPrimary}
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer text-sm">
                                {slide.ctaSecondary}
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlide ? "w-8 bg-[#2563eb]" : "w-2 bg-white/50 hover:bg-white"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
