"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { AddProductForm } from "./AddProductForm";

export function AddProductModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-[#135bec] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_14px_0_rgba(19,91,236,0.39)] hover:shadow-[0_6px_20px_rgba(19,91,236,0.23)] hover:bg-blue-600 transition-all flex items-center gap-2"
            >
                <Plus size={18} />
                Add Product
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 flex items-start justify-between border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Add New Product</h2>
                                <p className="text-sm text-slate-500 mt-0.5">Fill in the details to create a new product.</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <AddProductForm onSuccess={() => setIsOpen(false)} onCancel={() => setIsOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
}
