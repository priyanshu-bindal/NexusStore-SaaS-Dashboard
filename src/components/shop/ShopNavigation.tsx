"use client";

import { SlidersHorizontal, Search, ChevronDown } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ShopNavigationProps {
    onFilterClick: () => void;
}

const categories = [
    {
        id: "all",
        label: "All",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=100&auto=format&fit=crop"
    },
    {
        id: "clothing",
        label: "Clothing",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=100&auto=format&fit=crop"
    },
    {
        id: "shoes",
        label: "Shoes",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=100&auto=format&fit=crop"
    },
    {
        id: "accessories",
        label: "Accessories",
        image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=100&auto=format&fit=crop"
    },
    {
        id: "new-in",
        label: "New In",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=100&auto=format&fit=crop"
    }
];

export default function ShopNavigation({ onFilterClick }: ShopNavigationProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeCategory = searchParams.get("category") || "all";
    const sort = searchParams.get("sort") || "relevance";

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (category === "all") {
            params.delete("category");
        } else {
            params.set("category", category);
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", e.target.value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all duration-300">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Category Pills with Images */}
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat.id || (cat.id === "all" && !searchParams.get("category"));

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={cn(
                                        "flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border",
                                        isActive
                                            ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-black/10"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0">
                                        <Image
                                            src={cat.image}
                                            alt={cat.label}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="whitespace-nowrap">{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Actions: Search, Sort, Filter */}
                    <div className="flex items-center gap-3 w-full md:w-auto">


                        <div className="relative hidden sm:block">
                            <select
                                value={sort}
                                onChange={handleSortChange}
                                className="appearance-none bg-transparent font-bold text-sm pl-2 pr-8 focus:outline-none cursor-pointer"
                            >
                                <option value="relevance">Sort by: Relevance</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="newest">Newest First</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                        </div>

                        <button
                            onClick={onFilterClick}
                            className="p-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-colors relative group"
                        >
                            <SlidersHorizontal size={20} className="text-slate-700" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white hidden group-hover:block animate-ping" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
