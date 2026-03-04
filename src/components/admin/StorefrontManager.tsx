"use client";

import { useState, useCallback, useTransition, useRef, useEffect } from "react";
import { LayoutGrid, Loader2, Plus, ChevronDown, Globe } from "lucide-react";
import { Toaster, toast } from "sonner";
import SectionCard from "./SectionCard";
import { createStorefrontSection } from "@/actions/storefront";
import type { StorefrontSectionData, SectionType } from "@/types/storefront";

interface Props {
    initialSections: StorefrontSectionData[];
}

export default function StorefrontManager({ initialSections }: Props) {
    const [sections, setSections] = useState(initialSections);

    // Sync local state when server data updates (after a revalidatePath)
    useEffect(() => {
        setSections(initialSections);
    }, [initialSections]);

    // Optimistic toggle: flip isActive locally
    const handleOptimisticToggle = useCallback((id: string) => {
        setSections((prev) =>
            prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
        );
    }, []);

    // Optimistic reorder: swap order values
    const handleOptimisticReorder = useCallback(
        (id: string, direction: "up" | "down") => {
            setSections((prev) => {
                const sorted = [...prev].sort((a, b) => a.order - b.order);
                const idx = sorted.findIndex((s) => s.id === id);
                const swapIdx = direction === "up" ? idx - 1 : idx + 1;
                if (swapIdx < 0 || swapIdx >= sorted.length) return prev;

                const next = sorted.map((s) => ({ ...s }));
                const tmpOrder = next[idx].order;
                next[idx].order = next[swapIdx].order;
                next[swapIdx].order = tmpOrder;
                return next.sort((a, b) => a.order - b.order);
            });
        },
        []
    );

    const sorted = [...sections].sort((a, b) => a.order - b.order);

    // ── Add New Section Logic ───────────────────────────────────────────────
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCreating, startCreating] = useTransition();
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCreate = (type: SectionType) => {
        setIsMenuOpen(false);
        startCreating(async () => {
            const result = await createStorefrontSection(type);
            if (result.success && result.section) {
                toast.success(`New ${type} section created!`);
                // Append locally so it shows immediately at the bottom
                setSections((prev) => [...prev, result.section as StorefrontSectionData]);

                // Optional: scroll to bottom
                setTimeout(() => {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }, 100);
            } else {
                toast.error("Failed to create section");
            }
        });
    };

    const SECTION_CHOICES: { type: SectionType; label: string; desc: string }[] = [
        { type: "HERO", label: "Hero Banner", desc: "Large image, headline & CTA" },
        { type: "PROMO", label: "Promo Strip", desc: "Thin colored announcement bar" },
        { type: "STATS", label: "Platform Stats", desc: "3 big numeric metric cards" },
        { type: "SCROLLING_TICKER", label: "Scrolling Ticker", desc: "Animated infinite CSS marquee" },
        { type: "BENTO_GRID_4X4", label: "Bento Grid", desc: "1 large card + 4 small image cards" },
        { type: "ANIMATED_PROMO_CARD", label: "Animated Promo", desc: "Auto-swapping image hover card" },
    ];

    return (
        <>
            <Toaster position="bottom-right" richColors />

            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-end gap-3 mb-6 relative" ref={menuRef}>
                <a
                    href="/shop"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-full transition-colors"
                >
                    <Globe size={16} />
                    Preview Live
                </a>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    disabled={isCreating}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-5 py-2.5 rounded-full transition-colors shadow-sm text-sm"
                >
                    {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    {isCreating ? "Creating..." : "Add New Section"}
                    <ChevronDown size={14} className={`transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute top-12 right-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Choose Section Type</h4>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto p-2">
                            {SECTION_CHOICES.map((choice) => (
                                <button
                                    key={choice.type}
                                    onClick={() => handleCreate(choice.type)}
                                    className="w-full text-left px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors group flex flex-col gap-0.5"
                                >
                                    <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                        {choice.label}
                                    </span>
                                    <span className="text-xs text-slate-500 block">
                                        {choice.desc}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="size-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                        <LayoutGrid size={28} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-1">No sections yet</h3>
                    <p className="text-sm text-slate-400 max-w-xs">
                        Run the seed script to add the default Hero, Promo, and Stats sections.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sorted.map((section, idx) => (
                        <SectionCard
                            key={section.id}
                            section={section}
                            isFirst={idx === 0}
                            isLast={idx === sorted.length - 1}
                            onOptimisticToggle={handleOptimisticToggle}
                            onOptimisticReorder={handleOptimisticReorder}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
