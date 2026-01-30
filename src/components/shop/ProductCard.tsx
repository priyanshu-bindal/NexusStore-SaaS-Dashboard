"use client";

import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export interface ProductCardProps {
    product: {
        id: string;
        name: string;
        description: string;
        price: number | string;
        images: string[];
        rating?: number;
        reviewCount?: number;
        isBestSeller?: boolean;
        stock: number;
        brand?: string | null;
        createdAt?: Date | string;
    };
    view?: "grid" | "list";
}

export function ProductCard({ product, view = "grid" }: ProductCardProps) {
    const { addToCart } = useCart();
    const price = Number(product.price);

    // Check if product is new (created within last 30 days)
    const isNew = product.createdAt
        ? new Date(product.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
        : false;

    // Use placeholder if no images
    const mainImage = product.images?.[0] || "/placeholder.jpg"; // Updated: Use first image from array

    return (
        <div className="group flex flex-col cursor-pointer">
            {/* Image Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                {/* Badges */}
                <div className="absolute top-0 left-0 z-10 p-3 flex flex-col gap-2 items-start">
                    {isNew && (
                        <div className="bg-transparent text-xs font-bold uppercase tracking-wider text-black/70 mix-blend-multiply">
                            NEW ARRIVAL
                        </div>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                        <div className="bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-red-600">
                            Low Stock
                        </div>
                    )}
                </div>

                <Link href={`/shop/${product.id}`} className="block h-full w-full">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                </Link>

                {/* Wishlist Button - Top Right */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        // Wishlist logic
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full text-white/70 hover:text-white hover:bg-black/20 transition-all"
                >
                    <Heart size={20} />
                </button>

                {/* Quick Add - Slide Up */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 bg-gradient-to-t from-black/50 to-transparent">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product as any);
                        }}
                        className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="mt-3 flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    <Link href={`/shop/${product.id}`}>
                        {product.name}
                    </Link>
                </h3>
                <p className="text-xs text-slate-500 font-medium">{product.brand || "Men's Collection"}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-slate-900">
                        ₹{price.toFixed(0)}
                    </span>
                    {/* Optional: Mock original price for "Discount" look if needed based on reference showing strikethrough */}
                    {/* <span className="text-xs text-slate-400 line-through">₹{(price * 1.2).toFixed(0)}</span> */}
                </div>
            </div>
        </div>
    );
}
