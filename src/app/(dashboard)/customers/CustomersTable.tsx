"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { formatCurrency, cn } from "../../../lib/utils";
import {
    MoreVertical,
    Filter,
    ChevronLeft,
    ChevronRight,
    Search
} from "lucide-react";

interface CustomerUser {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt: string; // Formatted date
    totalOrders: number;
    totalSpent: number;
    lastSeen: string; // "2 hours ago" etc
}

export default function CustomersTable({ users, totalPages, currentPage, totalCustomers }: { users: CustomerUser[], totalPages: number, currentPage: number, totalCustomers: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Search State
    const searchTerm = searchParams.get("q") || "";

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        params.delete("page"); // Reset to page 1
        startTransition(() => {
            router.replace(`?${params.toString()}`, { scroll: false });
        });
    }, 300);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        startTransition(() => {
            router.replace(`?${params.toString()}`, { scroll: false });
        });
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-[#10b981] focus:border-[#10b981] transition-all outline-none"
                        placeholder="Search by name, email or ID..."
                        type="text"
                        defaultValue={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <Filter size={18} />
                        Filters
                    </button>
                    <button className="px-3 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        Date Range
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Orders</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Total Spent</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Last Seen</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="table-row-hover cursor-pointer group transition-colors hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                                                {user.image ? (
                                                    <img alt={user.name || "Customer"} className="w-full h-full object-cover" src={user.image} />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                                        {(user.name || user.email || "?").charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-bold text-slate-900 group-hover:text-[#10b981] transition-colors">
                                                {user.name || "Guest"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{user.email || "No Email"}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{user.totalOrders}</td>
                                    <td className="px-6 py-4 text-sm font-black text-slate-900">{formatCurrency(user.totalSpent)}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold",
                                            user.lastSeen === "Just now" ? "bg-emerald-50 text-emerald-700" : "text-slate-500"
                                        )}>
                                            {user.lastSeen}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    No customers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                    Showing {(currentPage - 1) * 6 + 1} to {Math.min(currentPage * 6, totalCustomers)} of {totalCustomers} results
                </span>
                <div className="flex items-center gap-2">
                    <button
                        className="size-8 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                        .map((p, i, arr) => (
                            <div key={p} className="flex">
                                {i > 0 && arr[i - 1] !== p - 1 && <span className="text-slate-400 px-1 pt-1">...</span>}
                                <button
                                    onClick={() => handlePageChange(p)}
                                    className={cn(
                                        "size-8 rounded text-xs font-bold transition-colors",
                                        currentPage === p
                                            ? "bg-[#10b981] text-white"
                                            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    {p}
                                </button>
                            </div>
                        ))}

                    <button
                        className="size-8 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
