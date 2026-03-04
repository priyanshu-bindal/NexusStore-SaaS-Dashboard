"use client";

import type {
    StorefrontSectionData,
    HeroBannerContent,
    PromoContent,
    StatsContent,
    ScrollingTickerContent,
    BentoGridContent,
    AnimatedPromoCardContent,
} from "@/types/storefront";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ─── Hero Banner ──────────────────────────────────────────────────────────────
function HeroBannerRenderer({ content }: { content: HeroBannerContent }) {
    return (
        <section
            className="relative w-full min-h-[420px] md:min-h-[560px] flex items-center overflow-hidden bg-slate-900"
            style={
                content.imageUrl
                    ? {
                        backgroundImage: `url(${content.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }
                    : undefined
            }
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

            <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-16 py-20">
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-2xl mb-4">
                    {content.headline}
                </h1>
                {content.subheadline && (
                    <p className="text-lg md:text-xl text-white/80 max-w-xl mb-8">
                        {content.subheadline}
                    </p>
                )}
                {content.ctaLabel && content.ctaLink && (
                    <Link
                        href={content.ctaLink}
                        className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-8 py-3.5 rounded-full hover:bg-slate-100 transition-colors text-sm shadow-xl"
                    >
                        {content.ctaLabel}
                    </Link>
                )}
            </div>
        </section>
    );
}

// ─── Promo Strip ──────────────────────────────────────────────────────────────
function PromoStripRenderer({ content }: { content: PromoContent }) {
    const bg = content.bgColor || "#F59E0B";
    return (
        <div
            className="w-full py-3 px-6 text-center text-sm font-semibold"
            style={{ backgroundColor: bg, color: isLight(bg) ? "#1e1e1e" : "#ffffff" }}
        >
            {content.linkUrl ? (
                <Link href={content.linkUrl} className="hover:underline">
                    {content.message}
                </Link>
            ) : (
                <span>{content.message}</span>
            )}
        </div>
    );
}

// ─── Platform Stats ──────────────────────────────────────────────────────────
function StatsRenderer({ content }: { content: StatsContent }) {
    if (!content.stats?.length) return null;
    return (
        <section className="bg-slate-950 py-16">
            <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                {content.stats.map((stat, i) => (
                    <div key={i}>
                        <p className="text-4xl md:text-5xl font-black text-white mb-2">
                            {stat.value}
                        </p>
                        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

// ─── Utility: detect light vs dark hex color ─────────────────────────────────
function isLight(hex: string): boolean {
    const c = hex.replace("#", "");
    if (c.length < 6) return true;
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    // Perceived luminance
    return 0.299 * r + 0.587 * g + 0.114 * b > 128;
}

// ─── Scrolling Ticker ─────────────────────────────────────────────────────────
function ScrollingTickerRenderer({ content }: { content: ScrollingTickerContent }) {
    const bg = content.bgColor || "#000000";
    const textCol = content.textColor || "#ffffff";
    const speed = content.speed || 50; // pixels per second roughly

    return (
        <div
            className="w-full overflow-hidden whitespace-nowrap py-3 border-y border-opacity-10"
            style={{ backgroundColor: bg, borderColor: textCol }}
        >
            <motion.div
                className="inline-flex gap-8 items-center"
                animate={{ x: [0, -1000] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 1000 / speed, // lower speed = longer duration
                }}
            >
                {/* Duplicate text multiple times to ensure seamless scrolling */}
                {[...Array(10)].map((_, i) => (
                    <span
                        key={i}
                        className="text-sm md:text-base font-bold uppercase tracking-[0.2em]"
                        style={{ color: textCol }}
                    >
                        {content.text}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

// ─── Bento Grid 4x4 ──────────────────────────────────────────────────────────
function BentoGridRenderer({ content }: { content: BentoGridContent }) {
    if (!content.largeItem || !content.smallItems?.length) return null;

    return (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto lg:h-[600px]">
                    {/* Large Featured Card */}
                    <Link
                        href={content.largeItem.linkUrl || "#"}
                        className="group relative overflow-hidden rounded-2xl md:rounded-[32px] h-[400px] lg:h-full bg-slate-200 shadow-sm"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url(${content.largeItem.imageUrl})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 md:p-12">
                            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                                {content.largeItem.title}
                            </h3>
                            <span className="inline-flex items-center text-sm font-bold text-white bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                                Explore Selection &rarr;
                            </span>
                        </div>
                    </Link>

                    {/* 4x4 Grid of Small Cards */}
                    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[500px] lg:h-full">
                        {content.smallItems.slice(0, 4).map((item, i) => (
                            <Link
                                key={i}
                                href={item.linkUrl || "#"}
                                className="group relative overflow-hidden rounded-2xl md:rounded-[32px] bg-slate-200 shadow-sm"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 p-5 w-full">
                                    <h4 className="text-lg md:text-xl font-bold text-white leading-tight">
                                        {item.title}
                                    </h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── Animated Promo Card ──────────────────────────────────────────────────────
function AnimatedPromoCardRenderer({ content }: { content: AnimatedPromoCardContent }) {
    const images = content.images?.filter(Boolean) || [];
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance images every 3 seconds
    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    if (!images.length) return null;

    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                <Link href={content.linkUrl || "#"} className="block group">
                    <div className="relative w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-slate-100 h-[500px] md:h-[700px] flex items-center justify-center shadow-2xl shadow-blue-900/10">
                        {/* Image sequence */}
                        <AnimatePresence mode="popLayout">
                            <motion.img
                                key={currentIndex}
                                src={images[currentIndex]}
                                alt={content.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            />
                        </AnimatePresence>

                        {/* Overlay text */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                        <div className="relative z-10 text-center px-6 scale-95 origin-center group-hover:scale-100 transition-transform duration-500">
                            {content.subtitle && (
                                <p className="text-white/90 text-sm md:text-base font-bold uppercase tracking-[0.3em] mb-4">
                                    {content.subtitle}
                                </p>
                            )}
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-lg">
                                {content.title}
                            </h2>
                        </div>

                        {/* Dots indicator */}
                        {images.length > 1 && (
                            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
                                {images.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-white" : "w-1.5 bg-white/50"}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Link>
            </div>
        </section>
    );
}

// ─── Main renderer — iterates active sections in order ───────────────────────
interface Props {
    sections: StorefrontSectionData[];
}

export default function DynamicStorefront({ sections }: Props) {
    if (!sections.length) return null;

    return (
        <>
            {sections.map((section) => {
                switch (section.type) {
                    case "HERO":
                        return <HeroBannerRenderer key={section.id} content={section.content as HeroBannerContent} />;
                    case "PROMO":
                        return <PromoStripRenderer key={section.id} content={section.content as PromoContent} />;
                    case "STATS":
                        return <StatsRenderer key={section.id} content={section.content as StatsContent} />;
                    case "SCROLLING_TICKER":
                        return <ScrollingTickerRenderer key={section.id} content={section.content as ScrollingTickerContent} />;
                    case "BENTO_GRID_4X4":
                        return <BentoGridRenderer key={section.id} content={section.content as BentoGridContent} />;
                    case "ANIMATED_PROMO_CARD":
                        return <AnimatedPromoCardRenderer key={section.id} content={section.content as AnimatedPromoCardContent} />;
                    default:
                        return null;
                }
            })}
        </>
    );
}
