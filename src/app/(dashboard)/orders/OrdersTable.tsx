"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { formatCurrency, cn, getStatusStyles, getFulfillmentStyles } from "../../../lib/utils";
import {
    Search,
    Filter,
    MoreVertical,
    Printer,
    CheckCircle,
    Trash2,
    X,
    SlidersHorizontal,
    Plus,
    Calendar,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import Link from "next/link";

interface Order {
    id: string;
    totalAmount: any; // Decimal or number
    status: string;
    fulfillmentStatus: string;
    createdAt: Date | string;
}

export default function OrdersTable({ orders, totalPages, currentPage }: { orders: Order[], totalPages: number, currentPage: number }) {
    const router = useRouter();
    // ... (existing code skipped for brevity in tool call, but context needs interface update)
    // actually I can't skip context easily with replace_file_content if I want to update interface AND the row render. 
    // I will use multi_replace.
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        startTransition(() => {
            router.replace(`?${params.toString()}`, { scroll: false });
        });
    };

    // Selection State
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

    // Search & Filter State
    const searchTerm = searchParams.get("q") || "";
    const statusFilter = searchParams.get("status") || "All";

    // Handle Search
    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        startTransition(() => {
            router.replace(`?${params.toString()}`, { scroll: false });
        });
    }, 300);

    // Handle Status Filter
    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(searchParams);
        if (status !== "All") {
            params.set("status", status);
        } else {
            params.delete("status");
        }
        startTransition(() => {
            router.replace(`?${params.toString()}`, { scroll: false });
        });
    };

    // Selection Logic
    const toggleSelectAll = () => {
        if (selectedOrders.length === orders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.map(o => o.id));
        }
    };

    const toggleSelectOrder = (id: string) => {
        if (selectedOrders.includes(id)) {
            setSelectedOrders(selectedOrders.filter(o => o !== id));
        } else {
            setSelectedOrders([...selectedOrders, id]);
        }
    };

    // Derived State for UI
    const allSelected = orders.length > 0 && selectedOrders.length === orders.length;
    const isIndeterminate = selectedOrders.length > 0 && selectedOrders.length < orders.length; // HTML doesn't support indeterminate prop easily in React without ref, simplifying

    // Filtered Orders (Client-side Search fallback if needed, but we rely on Server for filtering ideally. 
    // Since we receive 'orders' which are ALREADY filtered by page.tsx (ideally), we just render them.
    // However, if page.tsx passes ALL orders (as per prompt "Fetch all orders"), we might need client filtering 
    // OR page.tsx should filter. 
    // Prompt says: "Implement the search bar... to update the URL parameters". 
    // Usually implies server filtering. I will implement CLIENT filtering here if the prop is clean "all orders", 
    // BUT for scalability server-side is better. 
    // Let's assume page.tsx passes filtered orders. 
    // WAIT, prompt says "Fetch all orders from Prisma... Filter & Search: Implement the search bar... to update URL". 
    // If I fetch ALL, I should filter CLIENT SIDE? No, usually URL params mean Server Side. 
    // But for this "mock" feel with small data, I can do client side filtering if the prop is full history.
    // Let's assume the passed `orders` are potentially ALL orders and filter here for immediate responsiveness? 
    // No, standard is Server. 
    // I will assume `orders` passed to me are already what matches the criteria (Server Side Filtering).
    // If not, I'll add client filtering. 
    // Actually, prompt says "Fetch all orders from Prisma... including id...". 
    // I will stick to CLIENT filtering of the passed array for maximum speed/interactivity as requested by "No-Scroll" context 
    // UNLESS the array is huge. "Pagination... is necessary". 
    // Okay, I will implement filtering on the passed `orders` array for now, assuming `orders` is the CURRENT PAGE of orders.
    // Wait, if I update URL, the page reloads (soft nav) and server fetches new data. 
    // So Client Component just RENDERS what it gets.
    // Correct.

    return (
        <>
            {/* Page Header removed (Moved to Server Component) */}

            {/* Filters Container */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-[#10b981] focus:border-[#10b981] outline-none transition-all"
                            placeholder="Search by Order ID, Customer..."
                            type="text"
                            defaultValue={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            className="text-sm border-slate-200 rounded-lg bg-slate-50 focus:ring-[#10b981] focus:border-[#10b981] outline-none min-w-[140px] px-3 py-2.5"
                            defaultValue={statusFilter}
                            onChange={(e) => handleStatusChange(e.target.value)}
                        >
                            <option value="All">Status: All</option>
                            <option value="PAID">Paid</option>
                            <option value="PENDING">Pending</option>
                            <option value="REFUNDED">Refunded</option>
                        </select>
                        <select className="text-sm border-slate-200 rounded-lg bg-slate-50 focus:ring-[#10b981] focus:border-[#10b981] outline-none min-w-[160px] px-3 py-2.5">
                            <option>Fulfillment: All</option>
                            <option>Unfulfilled</option>
                            <option>Partially Fulfilled</option>
                            <option>Fulfilled</option>
                        </select>
                        <div className="relative">
                            <input
                                className="text-sm border-slate-200 rounded-lg bg-slate-50 focus:ring-[#10b981] focus:border-[#10b981] px-3 py-2.5 outline-none"
                                type="date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors">
                            <SlidersHorizontal size={18} />
                            Advanced
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] overflow-hidden relative min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 w-12">
                                    <input
                                        className="rounded border-slate-300 text-[#10b981] focus:ring-[#10b981] size-4"
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fulfillment</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <OrderRow
                                        key={order.id}
                                        order={order}
                                        selected={selectedOrders.includes(order.id)}
                                        onSelect={() => toggleSelectOrder(order.id)}
                                        fulfillmentStatus={order.fulfillmentStatus || "Unfulfilled"}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white">
                    <button
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                            .map((p, i, arr) => (
                                <div key={p} className="flex items-center">
                                    {i > 0 && arr[i - 1] !== p - 1 && <span className="text-slate-300 px-2">...</span>}
                                    <button
                                        onClick={() => handlePageChange(p)}
                                        className={cn(
                                            "size-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                                            currentPage === p
                                                ? "bg-[#10b981] text-white font-bold"
                                                : "hover:bg-slate-50 text-slate-600"
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
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Bulk Action Overlay */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-6 px-6 py-4 bg-slate-900 text-white rounded-2xl shadow-2xl transition-all duration-300 ${selectedOrders.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{selectedOrders.length} orders selected</span>
                </div>
                <div className="w-px h-6 bg-slate-700"></div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors">
                        <Printer size={18} />
                        Print Labels
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors">
                        <CheckCircle size={18} />
                        Mark Fulfilled
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors">
                        <Trash2 size={18} />
                        Delete
                    </button>
                </div>
                <div className="w-px h-6 bg-slate-700"></div>
                <button
                    onClick={() => setSelectedOrders([])}
                    className="p-1 hover:bg-slate-800 rounded-full transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
        </>
    );
}

// Helper Components
function OrderRow({ order, selected, onSelect, fulfillmentStatus }: { order: Order, selected: boolean, onSelect: () => void, fulfillmentStatus: string }) {
    return (
        <tr className={`transition-colors ${selected ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}>
            <td className="px-6 py-4">
                <input
                    className="rounded border-slate-300 text-[#10b981] focus:ring-[#10b981] size-4"
                    type="checkbox"
                    checked={selected}
                    onChange={onSelect}
                />
            </td>
            <td className="px-6 py-4 font-mono font-bold text-sm text-slate-900">
                <Link href={`/orders/${order.id}`} className="hover:text-[#10b981] hover:underline transition-colors">
                    #NX-{order.id.slice(-4).toUpperCase()}
                </Link>
            </td>
            <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                {order.createdAt as string}
            </td>
            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                Guest Customer
            </td>
            <td className="px-6 py-4">
                <StatusBadge status={order.status} />
            </td>
            <td className="px-6 py-4">
                <FulfillmentBadge status={fulfillmentStatus} />
            </td>
            <td className="px-6 py-4 text-sm font-bold text-slate-900">
                {formatCurrency(Number(order.totalAmount))}
            </td>
            <td className="px-6 py-4 text-right">
                <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical size={18} />
                </button>
            </td>
        </tr>
    );
}

// function removed
// ... (skip lines)

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide", getStatusStyles(status))}>
            {status}
        </span>
    );
}

function FulfillmentBadge({ status }: { status: string }) {
    return (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide", getFulfillmentStyles(status))}>
            {status}
        </span>
    )
}
