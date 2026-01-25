"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/actions/product";
import { Loader2, Plus, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("0");
    const [imageUrl, setImageUrl] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Use placeholder if no image provided
        // Using DiceBear for consistent, reliable placeholders or Unsplash source
        const finalImage = imageUrl.trim() || `https://api.dicebear.com/7.x/shapes/svg?seed=${name}`;

        startTransition(async () => {
            const result = await createProduct({
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                images: [finalImage]
            });

            if (result.error) {
                alert(result.error);
            } else {
                router.push("/dashboard"); // Redirect to dashboard or products list
                router.refresh();
            }
        });
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
                <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
                    <p className="text-slate-500 mt-1">Create a new item for your store inventory.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Details */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Basic Details</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Premium Wool Sweater"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563eb] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Category (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Clothing"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563eb] transition-all"
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-sm font-bold text-slate-700">Description</label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your product features and benefits..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563eb] transition-all resize-y"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Inventory & Pricing */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Inventory & Pricing</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Price ($)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563eb] transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Stock Units</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    placeholder="100"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563eb] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Product Images</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Image URL</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="url"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563eb] transition-all"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 pl-1">Leave blank to generate a placeholder image automatically.</p>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    Create Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
