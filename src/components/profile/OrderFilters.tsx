"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function OrderFiltersContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentFilter = searchParams.get("filter") || "all";

    const handleFilterChange = (filter: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (filter === "all") {
            params.delete("filter");
        } else {
            params.set("filter", filter);
        }
        router.push(`/profile/orders?${params.toString()}`);
    };

    const tabs = [
        { id: "all", label: "All Orders" },
        { id: "in_progress", label: "In Progress" },
        { id: "delivered", label: "Delivered" },
        { id: "cancelled", label: "Cancelled" },
    ];

    return (
        <div className="mb-6 overflow-x-auto no-scrollbar">
            <div className="flex border-b border-slate-200 min-w-max">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleFilterChange(tab.id)}
                        className={`relative px-1 pb-3 pt-2 mr-8 font-medium text-sm border-b-2 transition-colors ${currentFilter === tab.id
                            ? "text-amber-600 border-amber-600 font-bold"
                            : "text-slate-500 border-transparent hover:text-slate-900 hover:border-slate-300"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export function OrderFilters() {
    return (
        <Suspense fallback={<div className="h-12 w-full animate-pulse bg-slate-50 rounded" />}>
            <OrderFiltersContent />
        </Suspense>
    );
}
