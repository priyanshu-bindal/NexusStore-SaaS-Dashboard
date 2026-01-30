"use client";

import { Plus, Heart, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getProductsAction } from "@/actions/shop";
import { useSearchParams } from "next/navigation";

/* Type definition matches what getProductsAction returns */
type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    createdAt: string;
    updatedAt: string;
    storeId: string;
    isBestSeller?: boolean; // mocked in action
};

export default function CollectionGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    // Fetch on mount AND when URL params change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Read params from URL
                const category = searchParams.get("category") || undefined;
                const sort = searchParams.get("sort") || "newest"; // Default sort

                // Fetch products with filters
                const { products: fetchedProducts } = await getProductsAction({
                    category,
                    sort,
                    page: 1 // Default to page 1 for now (expand later if Load More needed) 
                });

                setProducts(fetchedProducts as Product[]);
            } catch (err) {
                console.error("Failed to fetch products for collection:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <p className="text-lg font-medium">No products found.</p>
                <p className="text-sm">Try clearing your filters.</p>
            </div>
        );
    }

    return (
        <main className="max-w-[1600px] mx-auto px-4 md:px-8 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">

                {products.map((product, index) => {
                    const image = product.images?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80";

                    return (
                        <React.Fragment key={product.id}>
                            <div className="group">
                                <div className="relative bg-slate-100 rounded-[2rem] overflow-hidden aspect-square mb-4">
                                    <Image
                                        src={image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition duration-500 group-hover:scale-105"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                    <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-blue-600 hover:text-white z-10">
                                        <Heart size={20} />
                                    </button>

                                    {/* Mock 'Best Seller' logic or usage of mocked field */}
                                    {product.isBestSeller && (
                                        <span className="absolute top-4 left-4 bg-black/80 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase z-10">Best Seller</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-start px-2">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition cursor-pointer line-clamp-1" title={product.name}>
                                            {product.name}
                                        </h3>
                                        <p className="text-slate-500 text-sm">${product.price.toFixed(2)}</p>
                                    </div>
                                    <button className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition hover:rotate-90 shrink-0">
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* BANNER INSERTION - After 4th item (index 3) */}
                            {index === 3 && (
                                <div className="col-span-1 sm:col-span-2 rounded-[2.5rem] relative overflow-hidden h-full min-h-[400px] group">
                                    <img
                                        src="https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?auto=format&fit=crop&w=800&q=80"
                                        alt="Denim Revolution"
                                        className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8 md:p-12">
                                        <span className="bg-white text-black text-xs font-bold uppercase px-3 py-1 rounded-full w-fit mb-4">Limited Edition</span>
                                        <h3 className="text-3xl font-extrabold text-white mb-2">Denim<br />Revolution</h3>
                                        <p className="text-white/80 mb-6 max-w-sm">Timeless quality meets modern cuts.</p>
                                        <button className="bg-white text-black px-6 py-3 rounded-full font-bold w-fit hover:bg-blue-600 hover:text-white transition">Shop Denim</button>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}

            </div>

            {/* Load More Mock */}
            <div className="mt-20 text-center">
                <button className="border border-slate-200 bg-white text-slate-900 px-10 py-4 rounded-full font-bold hover:bg-slate-900 hover:text-white transition shadow-sm">
                    Load More Products
                </button>
            </div>
        </main>
    );
}
