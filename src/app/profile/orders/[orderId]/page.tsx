import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Truck, Copy } from "lucide-react";
import { OrderTimeline } from "@/components/profile/OrderTimeline";

export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({
    params
}: {
    params: Promise<{ orderId: string }>
}) {
    const session = await auth();
    if (!session?.user?.id) return redirect("/sign-in");

    // Fix for Next.js 15 params awaiting if necessary, or just access directly for now 
    // (Assuming Next.js 14 based on recent knowledge, but standard access works)
    const { orderId } = await params;

    const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
            orderItems: {
                include: { product: true }
            }
        }
    });

    if (!order) return notFound();

    // Security check: ensure order belongs to user
    if (order.userId !== session.user.id) return notFound();

    // Helper for currency
    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

    // Mock Address (Schema doesn't seem to have address relation yet based on previous context, using static or user data)
    // If address exists on Order model, use it. Otherwise placeholder.
    // Parse Address from JSON
    const shippingAddress = order.shippingAddress as any;

    // Default fallback if no address saved (backwards compatibility)
    const addressData = shippingAddress ? {
        name: shippingAddress.name,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip,
        country: shippingAddress.country,
        phone: shippingAddress.phone
    } : {
        name: session.user.name || "N/A",
        street: "No address recorded",
        city: "",
        state: "",
        zip: "",
        country: "",
        phone: ""
    };

    // Determine layout based on status
    const isCancelled = order.status === "CANCELLED";

    return (
        <div className="flex-1 min-w-0">
            <div className="mb-6">
                <Link prefetch={false} href="/profile/orders" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-4">
                    <ArrowLeft size={16} />
                    Back to Orders
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-slate-900 text-3xl font-black leading-tight tracking-[-0.033em]">
                                Order #{order.id.slice(-6).toUpperCase()}
                            </h1>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ring-1 ring-inset uppercase ${isCancelled
                                ? "bg-red-50 text-red-600 ring-red-600/10"
                                : "bg-blue-50 text-blue-600 ring-blue-600/10"
                                }`}>
                                {order.status.replace("_", " ")}
                            </span>
                        </div>
                        {isCancelled && (
                            <p className="text-slate-500 text-base font-normal">
                                Cancelled on <span className="text-slate-900 font-semibold">
                                    {new Date(order.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </p>
                        )}
                        {!isCancelled && (
                            <p className="text-slate-500 text-base font-normal">
                                Estimated Delivery: <span className="text-slate-900 font-semibold">
                                    {new Date(new Date(order.createdAt).setDate(new Date(order.createdAt).getDate() + 5)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3">
                        {isCancelled ? (
                            <>
                                <button className="px-5 py-2.5 rounded-none border border-slate-200 bg-white text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors">
                                    REFUND DETAILS
                                </button>
                                <button className="px-5 py-2.5 rounded-none bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors shadow-sm">
                                    REORDER
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="px-5 py-2.5 rounded-none border border-slate-200 bg-white text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors">
                                    INVOICE
                                </button>
                                <button className="px-5 py-2.5 rounded-none border border-slate-200 bg-white text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors">
                                    SUPPORT
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {isCancelled && (
                <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-4">
                    <div className="shrink-0 size-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 mt-0.5">
                        <span className="font-bold text-sm">i</span>
                    </div>
                    <div>
                        <h4 className="text-red-900 font-bold mb-1">Order Cancelled</h4>
                        <p className="text-red-700 text-sm">
                            This order was cancelled by the customer on {new Date(order.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
                            A full refund of {fmt(Number(order.totalAmount))} has been processed.
                        </p>
                    </div>
                </div>
            )}

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-8">
                    {/* Shipment Status / Timeline */}
                    <OrderTimeline status={order.status} createdAt={order.createdAt} updatedAt={order.updatedAt} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Tracking History */}
                        <div className="bg-white rounded-none border-b border-l-0 border-r-0 border-t-0 border-slate-200 lg:border-none lg:bg-transparent lg:p-0">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Tracking History</h3>
                            <div className="relative pl-4 border-l-2 border-slate-200 space-y-8 ml-2">
                                {/* Dynamic Tracking Events */}
                                {(order.status !== "PENDING" || isCancelled) && (
                                    <div className="relative">
                                        <div className={`absolute -left-[21px] top-1.5 size-3 rounded-full border-2 border-white box-content ${isCancelled ? "bg-red-500" : "bg-[#2563eb]"}`}></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <p className="text-sm font-bold text-slate-900">
                                                    {isCancelled ? "Refund processed" : order.status.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                                </p>
                                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                                                    {new Date(order.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                {isCancelled ? `${fmt(Number(order.totalAmount))} credited to VISA ending in 4242` : "New York, NY, United States"}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {isCancelled && (
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1.5 size-3 rounded-full bg-slate-300 border-2 border-white box-content"></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <p className="text-sm font-bold text-slate-900">Order cancelled</p>
                                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                                                    {new Date(order.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500">Customer request</p>
                                        </div>
                                    </div>
                                )}

                                <div className="relative">
                                    <div className={`absolute -left-[21px] top-1.5 size-3 rounded-full border-2 border-white box-content ${order.status === "PENDING" ? "bg-[#2563eb]" : "bg-slate-300"}`}></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <p className="text-sm font-bold text-slate-900">Order Placed</p>
                                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">LuxeStore Digital Terminal</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipment Info / Refund Info */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
                                {isCancelled ? "Refund Details" : "Shipment Info"}
                            </h3>

                            {isCancelled ? (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Refund Method</p>
                                        <p className="text-sm font-semibold text-slate-900">Original Payment</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-slate-900">REF-{order.id.slice(-6).toUpperCase()}</p>
                                            <Copy size={14} className="text-slate-400 cursor-pointer hover:text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Carrier</p>
                                        <p className="text-sm font-semibold text-slate-900">FedEx International</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tracking Number</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-slate-900">1425 8596 2354</p>
                                            <Copy size={14} className="text-slate-400 cursor-pointer hover:text-blue-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Method</p>
                                        <p className="text-sm font-semibold text-slate-900">Express Priority (Air)</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                {/* FIXED: Moved sticky to the parent container and added self-start to prevent overlap */}
                <div className="w-full xl:w-80 shrink-0 flex flex-col gap-6 sticky top-24 self-start">
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-base font-bold text-slate-900">Order Summary</h3>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            {order.orderItems.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="size-16 shrink-0 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                                        {item.product.images?.[0] && (
                                            <img src={item.product.images[0]} alt={item.product.name} className="size-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">{item.product.name}</p>
                                        <div className="flex items-center gap-2 mb-1">
                                            {item.size && <span className="text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">Size: {item.size}</span>}
                                            <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">{fmt(Number(item.price))}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="font-medium text-slate-900">{fmt(Number(order.totalAmount))}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Shipping</span>
                                <span className="font-medium text-slate-900">Free</span>
                            </div>
                            <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                                <span className="font-bold text-slate-900">Total</span>
                                <span className="font-bold text-slate-900">{fmt(Number(order.totalAmount))}</span>
                            </div>
                            {isCancelled && (
                                <div className="flex justify-between text-sm pt-2 text-red-600 font-bold border-t border-slate-200/50">
                                    <span>Refunded</span>
                                    <span>-{fmt(Number(order.totalAmount))}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-base font-bold text-slate-900">Shipping Address</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm font-bold text-slate-900 mb-1">{addressData.name}</p>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {addressData.street}<br />
                                {addressData.city}, {addressData.state} {addressData.zip}<br />
                                {addressData.country}
                            </p>
                            <p className="text-sm text-slate-500 mt-2">{addressData.phone}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
