"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselSlides.length);
        }, 5000); // Slower interval (5s instead of 3s)

        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % carouselSlides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1));
    };

    return (
        <section className="w-full max-w-[1440px] mx-auto px-4 md:px-6 pt-6 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 h-[600px] md:h-[500px]">

                {/* 60% Image Carousel */}
                <div className="lg:col-span-6 h-full relative rounded-2xl overflow-hidden group">
                    <AnimatePresence initial={false}>
                        <motion.div
                            key={currentIndex}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{
                                x: { type: "spring", stiffness: 40, damping: 20 },
                                opacity: { duration: 0.5 }
                            }}
                            className="absolute inset-0"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url('${carouselSlides[currentIndex].image}')` }}
                            />
                            <div className="absolute inset-0 bg-black/30" />

                            <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    <span className="uppercase tracking-widest text-sm font-bold mb-4 block">
                                        {carouselSlides[currentIndex].subtitle}
                                    </span>
                                    <h2 className="text-4xl md:text-5xl font-black mb-6 max-w-lg leading-tight">
                                        {carouselSlides[currentIndex].title}
                                    </h2>
                                    <Link
                                        href={carouselSlides[currentIndex].href}
                                        className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors"
                                    >
                                        {carouselSlides[currentIndex].cta}
                                        <ArrowRight size={18} />
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

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
                <div className="lg:col-span-4 h-full flex flex-col gap-4">
                    {sideBanners.map((banner) => (
                        <Link
                            key={banner.id}
                            href={banner.href}
                            className="relative flex-1 rounded-2xl overflow-hidden group"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url('${banner.image}')` }}
                            />
                            {/* Overlay */}
                            <div className={cn(
                                "absolute inset-0 transition-colors duration-300",
                                banner.darkText ? "bg-white/10 group-hover:bg-white/20" : "bg-black/20 group-hover:bg-black/30"
                            )} />

                            <div className={cn(
                                "absolute w-full h-full p-8 flex flex-col justify-end items-start transition-transform duration-300 group-hover:translate-x-2",
                                banner.darkText ? "text-slate-900" : "text-white"
                            )}>
                                <span className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                                    {banner.subtitle}
                                </span>
                                <h3 className="text-2xl font-bold mb-4">
                                    {banner.title}
                                </h3>
                                <div className={cn(
                                    "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors",
                                    banner.darkText ? "bg-slate-900 text-white" : "bg-white text-black"
                                )}>
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
