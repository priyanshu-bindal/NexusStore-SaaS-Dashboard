"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/actions/order";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function OrderStatusUpdater({ orderId, currentStatus, currentFulfillmentStatus }: { orderId: string, currentStatus: string, currentFulfillmentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [fulfillmentStatus, setFulfillmentStatus] = useState(currentFulfillmentStatus);
    const [isPending, startTransition] = useTransition();

    const handleUpdate = () => {
        startTransition(async () => {
            await updateOrderStatus(orderId, status, fulfillmentStatus);
        });
    };

    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 w-full md:w-auto">
            <div className="flex gap-3 w-full md:w-auto">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Order Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={isPending}
                        className="w-full md:w-40 bg-slate-50 border-slate-200 rounded-xl text-sm font-medium focus:ring-[#10b981] focus:border-[#10b981] outline-none disabled:opacity-50 transition-all py-2"
                    >
                        <option value="PROCESSING">Processing</option>
                        <option value="PAID">Paid</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="REFUNDED">Refunded</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Fulfillment</label>
                    <select
                        value={fulfillmentStatus}
                        onChange={(e) => setFulfillmentStatus(e.target.value)}
                        disabled={isPending}
                        className="w-full md:w-40 bg-slate-50 border-slate-200 rounded-xl text-sm font-medium focus:ring-[#10b981] focus:border-[#10b981] outline-none disabled:opacity-50 transition-all py-2"
                    >
                        <option value="Unfulfilled">Unfulfilled</option>
                        <option value="Partially Fulfilled">Partially Fulfilled</option>
                        <option value="Fulfilled">Fulfilled</option>
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={handleUpdate}
                        disabled={isPending || (status === currentStatus && fulfillmentStatus === currentFulfillmentStatus)}
                        className={cn(
                            "bg-[#10b981] hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-semibold transition-all text-sm whitespace-nowrap shadow-lg shadow-emerald-500/20 flex items-center justify-center min-w-[120px] h-[38px]",
                            isPending && "opacity-80 cursor-wait",
                            (status === currentStatus && fulfillmentStatus === currentFulfillmentStatus && !isPending) && "opacity-50 cursor-not-allowed shadow-none bg-slate-400 hover:bg-slate-400"
                        )}
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            "Update Order"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
