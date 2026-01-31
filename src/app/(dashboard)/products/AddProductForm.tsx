"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, X, Bold, Italic, List, Code } from "lucide-react";
import { createProduct } from "@/actions/create-product";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { toast } from "sonner";

// Form Schema
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.string().min(1, "Price is required"),
    stock: z.string().min(1, "Stock is required"),
    category: z.string().min(1, "Category is required"),
    images: z.array(z.string()).min(1, "At least one image is required"),
    sizes: z.array(z.string()).optional()
});

const CATEGORIES = [
    "Clothing",
    "Shoes",
    "Accessories",
    "Electronics",
    "Home",
    "Beauty",
    "Sports",
    "Other"
];

export function AddProductForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [sizeInput, setSizeInput] = useState("");
    const [showSizes, setShowSizes] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: "",
            stock: "",
            category: "",
            images: [],
            sizes: []
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description || "");
        formData.append("price", values.price);
        formData.append("stock", values.stock);
        formData.append("category", values.category);

        // Serialize arrays
        formData.append("images", JSON.stringify(values.images));
        formData.append("sizes", JSON.stringify(values.sizes || []));

        const result = await createProduct(formData);
        setIsLoading(false);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Product created successfully");
            form.reset();
            onSuccess();
        }
    };

    const addSize = () => {
        if (!sizeInput.trim()) return;
        const currentSizes = form.getValues("sizes") || [];
        if (!currentSizes.includes(sizeInput.trim())) {
            form.setValue("sizes", [...currentSizes, sizeInput.trim()]);
        }
        setSizeInput("");
    };

    const removeSize = (sizeToRemove: string) => {
        const currentSizes = form.getValues("sizes") || [];
        form.setValue("sizes", currentSizes.filter(s => s !== sizeToRemove));
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 bg-white">
            {/* Scrollable Body */}
            <div className="px-6 py-2 overflow-y-auto flex-1 space-y-6 custom-scrollbar">

                {/* Images */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Product Images</label>
                    <ImageUpload
                        value={form.watch("images")}
                        onChange={(urls) => form.setValue("images", urls)}
                        onRemove={(url) => form.setValue("images", form.watch("images").filter((current) => current !== url))}
                    />
                    {form.formState.errors.images && (
                        <p className="text-xs text-red-500">{form.formState.errors.images.message}</p>
                    )}
                </div>

                {/* Product Title */}
                <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700" htmlFor="product-name">Product Title</label>
                    <input
                        {...form.register("name")}
                        id="product-name"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-transparent outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                        placeholder="e.g. Premium Wireless Headphones"
                    />
                    {form.formState.errors.name && (
                        <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                    )}
                </div>

                {/* Price & Stock Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-700" htmlFor="price">Price ($)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                            <input
                                {...form.register("price")}
                                id="price"
                                type="number"
                                step="0.01"
                                className="w-full pl-6 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-transparent outline-none transition-all text-sm text-slate-900"
                                placeholder="0.00"
                            />
                        </div>
                        {form.formState.errors.price && (
                            <p className="text-xs text-red-500">{form.formState.errors.price.message}</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-700" htmlFor="stock">Inventory</label>
                        <input
                            {...form.register("stock")}
                            id="stock"
                            type="number"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-transparent outline-none transition-all text-sm text-slate-900"
                            placeholder="0"
                        />
                        {form.formState.errors.stock && (
                            <p className="text-xs text-red-500">{form.formState.errors.stock.message}</p>
                        )}
                    </div>
                </div>

                {/* Category Select */}
                <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700" htmlFor="category">Category</label>
                    <select
                        {...form.register("category")}
                        id="category"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-transparent outline-none transition-all text-sm text-slate-900"
                    >
                        <option value="">Select a category</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {form.formState.errors.category && (
                        <p className="text-xs text-red-500">{form.formState.errors.category.message}</p>
                    )}
                </div>

                {/* Sizes Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showSizes}
                            onChange={(e) => setShowSizes(e.target.checked)}
                            id="has-sizes"
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="has-sizes" className="text-sm font-medium text-slate-700">This product has sizes (e.g. S, M, L)</label>
                    </div>

                    {showSizes && (
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                            <div className="flex gap-2">
                                <input
                                    value={sizeInput}
                                    onChange={(e) => setSizeInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === ",") {
                                            e.preventDefault();
                                            addSize();
                                        }
                                    }}
                                    placeholder="Type size and press Enter (e.g. XL)"
                                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#135bec] outline-none text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={addSize}
                                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Add
                                </button>
                            </div>

                            {/* Size Tags */}
                            <div className="flex flex-wrap gap-2">
                                {form.watch("sizes")?.map((size) => (
                                    <span key={size} className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {size}
                                        <button type="button" onClick={() => removeSize(size)} className="text-slate-400 hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                                {(!form.watch("sizes") || form.watch("sizes")?.length === 0) && (
                                    <span className="text-xs text-slate-400 italic">No sizes added yet</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Description with Toolbar */}
                <div className="space-y-1 pb-1">
                    <label className="block text-xs font-semibold text-slate-700" htmlFor="description">Description</label>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-2 py-1 flex gap-1">
                            <button type="button" className="p-1 hover:bg-white rounded text-slate-600"><Bold size={14} /></button>
                            <button type="button" className="p-1 hover:bg-white rounded text-slate-600"><Italic size={14} /></button>
                            <button type="button" className="p-1 hover:bg-white rounded text-slate-600"><List size={14} /></button>
                            <div className="w-px h-4 bg-slate-200 mx-1"></div>
                            <button type="button" className="p-1 hover:bg-white rounded text-slate-600"><Code size={14} /></button>
                        </div>
                        <textarea
                            {...form.register("description")}
                            id="description"
                            rows={3}
                            className="w-full px-3 py-2 bg-white border-none focus:ring-0 outline-none transition-all text-sm text-slate-900 resize-none"
                            placeholder="Tell us more about the product..."
                        />
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#135bec] hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-sm"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                    Create Product
                </button>
            </div>
        </form>
    );
}
