"use client";

import { X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const brands = ["Lumina", "Nike", "Adidas", "Zara", "H&M", "Uniqlo"];

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    const toggleBrand = (brand: string) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 backdrop-blur-sm",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={cn(
                    "fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Filters</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Price Range */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Price Range</h3>
                        <div className="px-2">
                            <input
                                type="range"
                                min="0"
                                max="500"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black"
                            />
                            <div className="flex justify-between mt-4 text-sm font-medium text-slate-600">
                                <span>$0</span>
                                <span>${priceRange[1]}</span>
                            </div>
                        </div>
                    </div>

                    {/* Brands */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Brands</h3>
                        <div className="space-y-3">
                            {brands.map((brand) => (
                                <button
                                    key={brand}
                                    onClick={() => toggleBrand(brand)}
                                    className="flex items-center justify-between w-full group"
                                >
                                    <span className={cn(
                                        "text-sm transition-colors",
                                        selectedBrands.includes(brand) ? "text-slate-900 font-bold" : "text-slate-500 group-hover:text-slate-900"
                                    )}>
                                        {brand}
                                    </span>
                                    <div className={cn(
                                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                        selectedBrands.includes(brand)
                                            ? "bg-black border-black text-white"
                                            : "border-slate-300 group-hover:border-slate-400"
                                    )}>
                                        {selectedBrands.includes(brand) && <Check size={12} />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-full border border-slate-300 text-slate-700 font-bold text-sm hover:bg-white transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-full bg-black text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
