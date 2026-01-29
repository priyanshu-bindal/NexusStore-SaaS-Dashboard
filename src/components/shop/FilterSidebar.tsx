"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { ChevronDown, ChevronUp, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // -- URL Sync Helpers --
    const updateParam = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Always reset page to 1 when filtering
        params.set("page", "1");
        router.push(`?${params.toString()}`, { scroll: false });
    };

    // -- State for Filters --
    const [minPrice, setMinPrice] = useState(Number(searchParams.get("minPrice") || 0));
    const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice") || 5000));

    // -- Debounced Price Update --
    const debouncedPriceUpdate = useDebouncedCallback((min: number, max: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("minPrice", min.toString());
        params.set("maxPrice", max.toString());
        params.set("page", "1");
        router.push(`?${params.toString()}`, { scroll: false });
    }, 500);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
        const val = Number(e.target.value);
        if (type === "min") {
            setMinPrice(val);
            debouncedPriceUpdate(val, maxPrice);
        } else {
            setMaxPrice(val);
            debouncedPriceUpdate(minPrice, val);
        }
    };

    // -- Accordion State --
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        category: true,
        price: true,
        brand: true,
        rating: true,
        color: true,
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900">Filters</h3>
                <button
                    onClick={() => router.push("/shop")}
                    className="text-xs font-bold text-[#135bec] hover:underline uppercase tracking-wider"
                >
                    Clear All
                </button>
            </div>

            {/* Categories */}
            <FilterSection title="Category" isOpen={openSections.category} onToggle={() => toggleSection("category")}>
                <div className="space-y-2">
                    {["Electronics", "Fashion", "Home & Living", "Accessories"].map(cat => {
                        const isActive = searchParams.get("category") === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => updateParam("category", isActive ? null : cat)}
                                className={cn(
                                    "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-[#135bec]/10 text-[#135bec]"
                                        : "text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                <span>{cat}</span>
                            </button>
                        );
                    })}
                </div>
            </FilterSection>

            {/* Brand */}
            <FilterSection title="Brand" isOpen={openSections.brand} onToggle={() => toggleSection("brand")}>
                <div className="space-y-1">
                    {["SonicX", "AuraSound", "Sony", "Bose", "Apple"].map(brand => (
                        <label key={brand} className="flex items-center gap-3 cursor-pointer group py-1">
                            <input
                                type="checkbox"
                                checked={searchParams.get("brand") === brand}
                                onChange={() => updateParam("brand", searchParams.get("brand") === brand ? null : brand)}
                                className="rounded text-[#135bec] focus:ring-[#135bec]/20 border-slate-300 size-4 accent-[#135bec]"
                            />
                            <span className="text-slate-600 group-hover:text-[#135bec] transition-colors text-sm">{brand}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price Range" isOpen={openSections.price} onToggle={() => toggleSection("price")}>
                <div className="px-2 pt-4 pb-2">
                    <div className="relative h-1.5 w-full bg-slate-200 rounded-full mb-6">
                        {/* Visual Rail - Simplified for standard range input limitations */}
                        <div
                            className="absolute h-1.5 bg-[#135bec] rounded-full"
                            style={{
                                left: `${(minPrice / 5000) * 100}%`,
                                right: `${100 - (maxPrice / 5000) * 100}%`
                            }}
                        ></div>
                    </div>

                    {/* Dual Range Inputs using CSS overlay trick would go here, using simple inputs for robustness */}
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>Min: ${minPrice}</span>
                            </div>
                            <input
                                type="range" min="0" max="5000" step="10"
                                value={minPrice}
                                onChange={(e) => handlePriceChange(e, "min")}
                                className="w-full accent-[#135bec] h-1.5 bg-transparent appearance-none cursor-pointer z-20 relative"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>Max: ${maxPrice > 5000 ? "5000+" : maxPrice}</span>
                            </div>
                            <input
                                type="range" min="0" max="5000" step="10"
                                value={maxPrice}
                                onChange={(e) => handlePriceChange(e, "max")}
                                className="w-full accent-[#135bec] h-1.5 bg-transparent appearance-none cursor-pointer z-20 relative"
                            />
                        </div>
                    </div>
                </div>
            </FilterSection>

            {/* Colors */}
            <FilterSection title="Color" isOpen={openSections.color} onToggle={() => toggleSection("color")}>
                <div className="flex flex-wrap gap-3">
                    {[
                        { name: "Black", hex: "#000000" },
                        { name: "White", hex: "#ffffff", border: true },
                        { name: "Blue", hex: "#2563eb" },
                        { name: "Red", hex: "#ef4444" },
                        { name: "Green", hex: "#10b981" },
                    ].map((color) => {
                        const isSelected = searchParams.get("color") === color.name;
                        return (
                            <button
                                key={color.name}
                                onClick={() => updateParam("color", isSelected ? null : color.name)}
                                title={color.name}
                                className={cn(
                                    "size-8 rounded-full flex items-center justify-center transition-all relative ring-2 ring-offset-2",
                                    isSelected ? "ring-[#135bec] scale-110" : "ring-transparent hover:ring-slate-200",
                                    color.border && "border border-slate-200"
                                )}
                                style={{ backgroundColor: color.hex }}
                            >
                                {isSelected && (
                                    <Check size={14} className={cn(color.name === "White" ? "text-slate-900" : "text-white")} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </FilterSection>

        </aside>
    );
}

function FilterSection({ title, isOpen, onToggle, children }: { title: string, isOpen: boolean, onToggle: () => void, children: React.ReactNode }) {
    return (
        <div className="border-b border-slate-100 pb-4 last:border-0">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full py-2 group"
            >
                <span className="font-bold text-sm text-slate-900 group-hover:text-[#135bec] transition-colors">{title}</span>
                {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {isOpen && <div className="mt-2 animate-in slide-in-from-top-2 duration-200 fade-in">{children}</div>}
        </div>
    );
}
