"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const carouselSlides = [
    {
        id: 1,
        title: "Summer Essentials",
        subtitle: "The 2024 Collection",
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop",
        cta: "Shop Collection",
        href: "/shop?category=clothing"
    },
    {
        id: 2,
        title: "Urban Minimalism",
        subtitle: "Clean Lines. Pure Comfort.",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        cta: "Explore Now",
        href: "/shop?category=new-in"
    },
    {
        id: 3,
        title: "Active Performance",
        subtitle: "Move Without Limits",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
        cta: "Shop Sport",
        href: "/shop?category=activewear"
    },
    {
        id: 4,
        title: "Evening Elegance",
        subtitle: "For Special Moments",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
        cta: "View Collection",
        href: "/shop?category=formal"
    },
    {
        id: 5,
        title: "Denim Revolution",
        subtitle: "Timeless Quality",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2070&auto=format&fit=crop",
        cta: "Shop Denim",
        href: "/shop?category=denim"
    }
];

const sideBanners = [
    {
        id: 1,
        title: "New Arrivals",
        subtitle: "Just Landed",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
        href: "/shop?sort=newest",
        darkText: true
    },
    {
        id: 2,
        title: "Accessories",
        subtitle: "Complete The Look",
        image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=2070&auto=format&fit=crop",
        href: "/shop?category=accessories",
        darkText: false
    }
];

export default function HeroGrid() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-advance carousel
    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselSlides.length);
        }, 1500);

        return () => clearInterval(timer);
    }, [isHovered]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % carouselSlides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1));
    };

    return (
        <section className="w-full max-w-[1440px] px-6 pt-6 pb-8 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[60%_calc(40%-1.5rem)] gap-6 h-[600px] md:h-[500px]">
                {/* 60% Image Carousel */}
                <div
                    className="h-full relative overflow-hidden group rounded-2xl"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {carouselSlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                                }`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover object-center absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                            <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-12 text-white items-start">
                                <div className="flex flex-col items-start w-full">
                                    <span className="uppercase tracking-[0.2em] text-xs font-bold mb-4 block">
                                        {slide.subtitle}
                                    </span>
                                    <h2 className="text-4xl md:text-5xl font-sans font-extrabold mb-6 max-w-lg leading-tight text-white drop-shadow-sm">
                                        {slide.title}
                                    </h2>
                                    <Link
                                        href={slide.href}
                                        className="inline-flex items-center gap-2 bg-primary text-secondary px-8 py-3 rounded-full font-bold hover:bg-primary-hover transition-colors shadow-lg"
                                    >
                                        {slide.cta}
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Navigation Controls */}
                    <div className="absolute bottom-6 right-6 flex gap-2">
                        <button
                            onClick={prevSlide}
                            className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors border border-white/20"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors border border-white/20"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-12 flex gap-2">
                        {carouselSlides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-300",
                                    idx === currentIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* 40% Side Banners */}
                <div className="h-full flex flex-col gap-6 min-w-0">
                    {sideBanners.map((banner) => (
                        <Link
                            key={banner.id}
                            href={banner.href}
                            className="relative flex-1 rounded-2xl overflow-hidden group w-full"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url('${banner.image}')` }}
                            />
                            {/* Overlay */}
                            <div
                                className="absolute inset-0 pointer-events-none transition-opacity"
                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 60%)' }}
                            />

                            <div className="absolute w-full h-full p-6 flex flex-col justify-end items-start transition-transform duration-300 group-hover:translate-x-2">
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-1 text-white">
                                    {banner.subtitle}
                                </span>
                                <h3 className="text-xl md:text-2xl font-extrabold mb-4 text-white">
                                    {banner.title}
                                </h3>
                                <div className="px-5 py-2 rounded-full text-[10px] md:text-xs font-bold transition-colors bg-white text-black hover:bg-slate-100">
                                    Shop Now
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
