"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { formatCurrency, cn } from "@/lib/utils";
import {
    Search,
    Filter,
    MoreVertical,
    Plus,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Package
} from "lucide-react";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string | null;
    createdAt: string;
    displaySku: string; // Calculated field
    images: string[];
}

export default function ProductsTable({ products, totalPages, currentPage }: { products: Product[], totalPages: number, currentPage: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get("q") || "";

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    }, 300);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.replace(`?${params.toString()}`, { scroll: false }); // "No-Scroll" logic
    };

    const getStockBadge = (stock: number) => {
        if (stock > 10) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">IN STOCK</span>
        if (stock > 0) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">LOW STOCK</span>
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">OUT OF STOCK</span>
    };

    return (
        <>
            {/* Filters Container */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-[#10b981] focus:border-[#10b981] outline-none transition-all"
                            placeholder="Search by Product Name, SKU..."
                            type="text"
                            defaultValue={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    {/* Add Category Filter if needed later */}
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors">
                        <Filter size={18} />
                        Filter
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] overflow-hidden relative min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden relative">
                                                    {product.images && product.images[0] ? (
                                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{product.name}</p>
                                                    <p className="text-xs text-slate-500 truncate max-w-[200px]">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-slate-600">
                                            {product.displaySku}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {product.category || "Uncategorized"}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {getStockBadge(product.stock)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                            {formatCurrency(product.price)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-1.5 hover:bg-red-50 rounded text-red-300 hover:text-red-500 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Pagination Footer */}
            <div className="flex items-center justify-between mt-4">
                <button
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} /> Previous
                </button>

                <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                        .map((p, i, arr) => (
                            <div key={p} className="flex items-center">
                                {i > 0 && arr[i - 1] !== p - 1 && <span className="text-slate-400 px-2">...</span>}
                                <button
                                    onClick={() => handlePageChange(p)}
                                    className={cn(
                                        "size-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all",
                                        currentPage === p
                                            ? "bg-[#10b981] text-white shadow-md shadow-emerald-500/20"
                                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    {p}
                                </button>
                            </div>
                        ))}
                </div>

                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next <ChevronRight size={16} />
                </button>
            </div>
        </>
    );
}
