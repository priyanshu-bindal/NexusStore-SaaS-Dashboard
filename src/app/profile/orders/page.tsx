import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

import { OrderFilters } from "@/components/profile/OrderFilters";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
    searchParams
}: {
    searchParams: Promise<{ filter?: string }>
}) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    const resolvedParams = await searchParams;
    const filter = resolvedParams.filter || "all";

    let whereClause: any = { userId: session.user.id };

    if (filter === "delivered") {
        whereClause.status = "DELIVERED";
    } else if (filter === "cancelled") {
        whereClause.status = "CANCELLED";
    } else if (filter === "in_progress") {
        whereClause.status = { notIn: ["DELIVERED", "CANCELLED"] };
    }

    const orders = await db.order.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED":
                return "bg-green-50 text-green-700 ring-green-600/20";
            case "CANCELLED":
                return "bg-slate-100 text-slate-600 ring-slate-500/10";
            case "IN_PROGRESS":
            case "PENDING":
                return "bg-blue-50 text-blue-600 ring-blue-600/10";
            default: // Processing, etc.
                return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-slate-900 text-3xl font-black leading-tight tracking-[-0.033em]">My Orders</h1>
                    <p className="text-slate-500 mt-1 text-base font-normal">Manage and track your recent purchases</p>
                </div>
                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-bold w-fit border border-blue-100">
                    {orders.length} {filter === 'all' ? 'Total Orders' : 'Orders'}
                </div>
            </div>

            {/* Filter Tabs */}
            <OrderFilters />

            <div className="flex flex-col gap-5">
                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                        <p className="text-slate-500 text-lg">You haven't placed any orders yet.</p>
                        <Link href="/shop" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Start Shopping</Link>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow">
                            <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:px-6 bg-slate-50 border-b border-slate-200">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                    <span className="text-slate-900 font-bold text-base">Order #{order.id.slice(-6).toUpperCase()}</span>
                                    <span className="hidden sm:inline text-slate-300">•</span>
                                    <span className="text-slate-500 text-sm">Placed on {formatDate(order.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                        {/* Status Dot / Icon */}
                                        {order.status === "DELIVERED" && <span className="text-[14px] leading-none">✓</span>}
                                        {order.status === "IN_PROGRESS" && (
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                                            </span>
                                        )}
                                        {order.status.replace("_", " ")}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6 md:items-center">
                                {/* Product Thumbnails */}
                                <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 flex-1 min-w-0 no-scrollbar">
                                    {order.orderItems.map((item) => (
                                        <div key={item.id} className="shrink-0 size-16 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative group">
                                            {item.product.images?.[0] ? (
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    className={`size-full object-cover ${order.status === 'CANCELLED' ? 'grayscale opacity-70' : ''}`}
                                                />
                                            ) : (
                                                <div className="size-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs">No Img</div>
                                            )}
                                            {/* Quantity Badge if > 1 */}
                                            {item.quantity > 1 && (
                                                <div className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[10px] px-1 font-bold rounded-tl-md">
                                                    x{item.quantity}
                                                </div>
                                            )}
                                            {/* Size Badge */}
                                            {item.size && (
                                                <div className="absolute top-0 right-0 bg-white/90 text-slate-900 text-[9px] px-1 font-bold border-l border-b border-slate-200 rounded-bl-md">
                                                    {item.size}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col items-start md:items-end min-w-[120px]">
                                    <p className={`text-slate-900 text-lg font-bold ${order.status === 'CANCELLED' ? 'line-through text-slate-400' : ''}`}>
                                        {formatCurrency(Number(order.totalAmount))}
                                    </p>
                                    <p className="text-slate-500 text-sm">{order.orderItems.length} items</p>
                                </div>

                                <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t border-slate-100 md:border-t-0">
                                    {/* Show Track Order for Active Orders, View Details for Completed/Cancelled */}
                                    {['IN_PROGRESS', 'PENDING', 'PAID'].includes(order.status) ? (
                                        <Link href={`/profile/orders/${order.id}`} className="flex-1 md:flex-none justify-center items-center h-10 px-4 rounded-lg bg-[#2563eb] text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap flex">
                                            Track Order
                                        </Link>
                                    ) : (
                                        <Link href={`/profile/orders/${order.id}`} className="flex-1 md:flex-none justify-center items-center h-10 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap flex">
                                            View Details
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
