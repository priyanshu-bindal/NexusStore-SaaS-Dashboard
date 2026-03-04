"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

type Product = {
    id: string;
    name: string;
    price: number;
    images: string[];
    store?: { name: string };
    stock: number;
};

export default function AddToCartButton({ product, className, selectedSize, hasSizes, onMissingSize }: { product: Product, className?: string, selectedSize?: string | null, hasSizes?: boolean, onMissingSize?: () => void }) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = () => {
        // Validation: If product has sizes but none selected
        if (hasSizes && !selectedSize) {
            if (onMissingSize) {
                onMissingSize();
            } else {
                alert("Please select a size before adding to cart.");
            }
            return;
        }

        setIsAdding(true);
        addToCart(product, selectedSize);
        // Reset state after animation
        setTimeout(() => setIsAdding(false), 500);
    };

    return (
        <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={className || `flex-1 font-bold py-4 px-8 rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${isAdding
                ? "bg-blue-600 text-white shadow-blue-900/10 scale-95"
                : "bg-slate-900 hover:bg-[#2563eb] text-white shadow-blue-900/10"
                }`}
        >
            <ShoppingCart className={`size-5 ${isAdding ? "animate-bounce" : ""}`} />
            {isAdding ? "Added!" : "Add to Cart"}
        </button>
    );
}
