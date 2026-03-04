"use client";

import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const categories = [
    { label: "All Items", value: "" },
    { label: "Clothing", value: "clothing" },
    { label: "Shoes", value: "shoes" },
    { label: "Accessories", value: "accessories" },
    { label: "New In", value: "new-in" },
];

const sortOptions = [
    { label: "Recommended", value: "recommended" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Newest", value: "newest" },
];

export default function CollectionFilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category") || "";
    const currentSort = searchParams.get("sort") || "recommended";

    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    // Helpers
    const updateParam = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        if (key === "category") params.delete("page");

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [searchParams, router]);

    // Close sort dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || "Recommended";

    return (
        <div className="sticky top-16 z-[50] bg-white/95 backdrop-blur-sm border-b border-slate-100 mb-12 shadow-sm transition-all duration-300">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">

                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
                    {categories.map((cat) => (
                        <button
                            key={cat.label}
                            onClick={() => updateParam("category", cat.value)}
                            className={cn(
                                "px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 border",
                                currentCategory === cat.value
                                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-blue-900/10"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Filters & Sort */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">

                    <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors group">
                        <div className="p-2 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors">
                            <SlidersHorizontal size={18} />
                        </div>
                        <span>Filters</span>
                    </button>

                    <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                    {/* Custom Sort Dropdown */}
                    <div className="relative" ref={sortRef}>
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors focus:outline-none"
                        >
                            <span className="text-slate-500 font-medium">Sort by:</span>
                            <span>{selectedSortLabel}</span>
                            <ChevronDown
                                size={16}
                                className={cn("transition-transform duration-200", isSortOpen ? "rotate-180" : "")}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isSortOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <ul className="py-2">
                                    {sortOptions.map((option) => (
                                        <li key={option.value}>
                                            <button
                                                onClick={() => {
                                                    updateParam("sort", option.value);
                                                    setIsSortOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between",
                                                    currentSort === option.value
                                                        ? "text-blue-600 bg-blue-50"
                                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                )}
                                            >
                                                {option.label}
                                                {currentSort === option.value && <Check size={16} />}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
