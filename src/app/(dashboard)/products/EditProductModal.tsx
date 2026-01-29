"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Pencil, Save, X } from "lucide-react";
import { updateProduct } from "@/actions/product-actions";

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    stock: z.coerce.number().min(0, "Stock cannot be negative"),
    description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface EditProductModalProps {
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        stock: number;
    };
}

import { type SubmitHandler } from "react-hook-form";

export function EditProductModal({ product }: EditProductModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductFormValues>({
        // @ts-ignore - known react-hook-form/zod type mismatch with coerce
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
        },
    });

    const onSubmit = async (data: ProductFormValues) => {
        setIsLoading(true);
        try {
            const result = await updateProduct(product.id, {
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
            });

            if (result.success) {
                // In a real app, use a toast here
                // toast.success("Product updated");
                setIsOpen(false);
            } else {
                alert("Failed to update product");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                title="Edit Product"
            >
                <Pencil size={16} />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-900">Edit Product</h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit as any)} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                        <input
                            {...register("name")}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] outline-none transition-all"
                            placeholder="e.g. Premium T-Shirt"
                        />
                        {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Price ($)</label>
                            <input
                                {...register("price")}
                                type="number"
                                step="0.01"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#135bec] outline-none transition-all"
                            />
                            {errors.price && <p className="text-xs text-red-500 font-medium">{errors.price.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Stock</label>
                            <input
                                {...register("stock")}
                                type="number"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#135bec] outline-none transition-all"
                            />
                            {errors.stock && <p className="text-xs text-red-500 font-medium">{errors.stock.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                        <textarea
                            {...register("description")}
                            rows={3}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#135bec] outline-none transition-all resize-none"
                            placeholder="Product description..."
                        />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-[#135bec] hover:bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-70 transition-all"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
