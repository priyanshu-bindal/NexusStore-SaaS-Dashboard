import { db } from "@/lib/db";
import { ArrowLeft, ShoppingCart, Star, Check } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "@/components/shop/AddToCartButton";

// Force dynamic rendering for fresh data
export const dynamic = "force-dynamic";

interface ProductPageProps {
    params: {
        productId: string;
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { productId } = await params;

    // 1. Fetch Product
    const product = await db.product.findUnique({
        where: { id: productId },
        include: { store: true }
    });

    if (!product) {
        notFound();
    }

    // 2. Serialize Data
    const serializedProduct = {
        ...product,
        price: product.price.toNumber(),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans">
            {/* Simple Header */}
            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/shop" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
                        <ArrowLeft className="size-4" />
                        Back to Shop
                    </Link>
                    <Link href="/" className="text-xl font-bold text-[#2563eb] tracking-tight">NexusStore</Link>
                    <div className="w-24"></div> {/* Spacer */}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                        {/* Image Section */}
                        <div className="bg-slate-50 p-8 flex items-center justify-center min-h-[500px] border-r border-slate-100">
                            {serializedProduct.images[0] ? (
                                <img
                                    src={serializedProduct.images[0]}
                                    alt={serializedProduct.name}
                                    className="max-w-full max-h-[500px] object-contain shadow-2xl rounded-2xl"
                                />
                            ) : (
                                <div className="text-slate-300 flex flex-col items-center">
                                    <ShoppingCart className="size-24 mb-4" />
                                    <p>No Image Available</p>
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <div className="mb-6">
                                <Link href="#" className="text-[#2563eb] font-bold text-sm uppercase tracking-wider mb-2 inline-block hover:underline">
                                    {serializedProduct.category || "General"}
                                </Link>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
                                    {serializedProduct.name}
                                </h1>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="size-5 fill-current" strokeWidth={0} />)}
                                    </div>
                                    <span className="text-slate-400 text-sm font-medium">(4.8/5.0 based on 124 reviews)</span>
                                </div>
                                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                    {serializedProduct.description}
                                </p>
                            </div>

                            <div className="border-t border-slate-100 pt-8 mt-auto">
                                <div className="flex items-end justify-between mb-8">
                                    <div>
                                        <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Price</p>
                                        <p className="text-4xl font-black text-slate-900">${serializedProduct.price.toFixed(2)}</p>
                                    </div>
                                    {serializedProduct.stock > 0 ? (
                                        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-bold">
                                            <Check className="size-4" />
                                            In Stock ({serializedProduct.stock})
                                        </div>
                                    ) : (
                                        <div className="text-red-500 bg-red-50 px-3 py-1 rounded-full text-sm font-bold">
                                            Out of Stock
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <AddToCartButton product={serializedProduct} />
                                </div>
                                <p className="text-center text-slate-400 text-xs mt-4">
                                    Sold by <span className="text-slate-600 font-bold">{serializedProduct.store?.name}</span>. Secure checkout powered by NexusStore.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
