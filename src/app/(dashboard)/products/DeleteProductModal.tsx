"use client";

import { useState } from "react";
import { Loader2, Trash2, AlertTriangle, X } from "lucide-react";
import { deleteProduct } from "@/actions/product-actions";

interface DeleteProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void; // Called after successful delete to update UI (optimistic or real)
    product: { id: string; name: string };
    isOptimistic?: boolean; // If we want to handle optimistic UI internally or externally
}

export function DeleteProductModal({ isOpen, onClose, onConfirm, product }: DeleteProductModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleDelete = async () => {
        setIsLoading(true);
        setError(""); // Clear previous errors
        try {
            const result = await deleteProduct(product.id);
            if (result.success) {
                onConfirm(); // Trigger parent cleanup / toast
                onClose();
            } else {
                setError(result.message || "Failed to delete product");
            }
        } catch (error) {
            console.error(error);
            setError("An error occurred while deleting.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Modal Content */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
                <div className="p-6 text-center">
                    <div className="size-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-red-50/50">
                        <AlertTriangle size={28} strokeWidth={2.5} />
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-2">Delete Product?</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                        Are you sure you want to delete <span className="font-bold text-slate-800">"{product.name}"</span>?
                        This action cannot be undone and will remove it from your store immediately.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100/80 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 disabled:opacity-70 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
