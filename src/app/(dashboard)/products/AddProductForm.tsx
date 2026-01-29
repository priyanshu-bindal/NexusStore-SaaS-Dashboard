import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Link as LinkIcon, Bold, Italic, List, Code } from "lucide-react";
import { createProduct } from "@/actions/create-product";
import { useRouter } from "next/navigation";

// Form Schema
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Price must be a positive number"),
    stock: z.string().min(1, "Stock is required").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Stock must be a positive integer"),
    category: z.string().optional(),
    imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal(""))
});

export function AddProductForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: "",
            stock: "",
            category: "",
            imageUrl: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description || "");
        formData.append("price", values.price);
        formData.append("stock", values.stock);
        if (values.category) formData.append("category", values.category);
        if (values.imageUrl) formData.append("imageUrl", values.imageUrl);

        const result = await createProduct(formData);
        setIsLoading(false);

        if (result?.error) {
            alert(result.error);
        } else {
            form.reset();
            onSuccess();
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 bg-white">
            {/* Scrollable Body */}
            <div className="px-6 py-2 overflow-y-auto flex-1 space-y-3 custom-scrollbar">

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

                {/* Image URL */}
                <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700" htmlFor="product-image-url">Image URL</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <LinkIcon size={14} />
                        </span>
                        <input
                            {...form.register("imageUrl")}
                            id="product-image-url"
                            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-transparent outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    {form.formState.errors.imageUrl && (
                        <p className="text-xs text-red-500">{form.formState.errors.imageUrl.message}</p>
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
                            rows={2}
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
