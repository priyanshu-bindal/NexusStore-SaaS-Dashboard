"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

type Product = {
    id: string;
    name: string;
    price: number | string;
    image: string;
};

export default function GlassProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    return (
        <div className="group relative bg-white rounded-[32px] p-4 flex flex-col shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            {/* Image Area */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-slate-50">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 px-1">
                <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1">{product.name}</h3>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-slate-500 font-medium">
                        ${Number(product.price).toFixed(2)}
                    </span>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                        }}
                        className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/20"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
