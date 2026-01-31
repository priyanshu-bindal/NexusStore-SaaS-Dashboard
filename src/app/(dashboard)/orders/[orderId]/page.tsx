import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { updateOrderStatus } from "@/actions/order";
import { formatCurrency, cn, getStatusStyles, getFulfillmentStyles } from "@/lib/utils";
import {
    ChevronLeft,
    ShoppingBag,
    Edit,
    User,
    Mail,
    Phone,
    Truck,
    Check,
    ShoppingCart,
    Package
} from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { OrderStatusUpdater } from "./OrderStatusUpdater";

export default async function OrderDetailsPage(props: {
    params: Promise<{ orderId: string }>;
}) {
    // Await params for Next.js 15
    const params = await props.params;
    const { orderId } = params;

    const session = await auth();
    if (!session?.user?.id) return redirect("/sign-in");

    // Fetch Full Order
    const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
            user: true, // Fetch customer details
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!order) return notFound();

    // Verify Store Ownership
    const store = await db.store.findFirst({
        where: { id: order.storeId, userId: session.user.id }
    });

    if (!store) return notFound(); // Or unauthorized access page

    // Data Serialization
    const formattedDate = order.createdAt.toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"
    });

    const totalAmount = Number(order.totalAmount);

    // Timeline Data Logic
    const timeline = [
        {
            title: "Order Placed",
            date: formattedDate,
            description: "Customer initiated checkout process.",
            icon: ShoppingCart,
            active: true // Always active if order exists
        },
        {
            title: "Payment Confirmed",
            date: ["PAID", "SHIPPED", "DELIVERED"].includes(order.status) ? formattedDate : null, // Mocking same date for simplicity
            description: "Transaction verified successfully.",
            icon: Check,
            active: ["PAID", "SHIPPED", "DELIVERED"].includes(order.status)
        },
        {
            title: "Order Fulfilled",
            date: order.fulfillmentStatus === "Fulfilled" ? "Ready for Shipping" : null,
            description: "All items have been packed and fulfilled.",
            icon: Package,
            active: order.fulfillmentStatus === "Fulfilled"
        },
        {
            title: "Order Shipped",
            date: ["SHIPPED", "DELIVERED"].includes(order.status) ? "Pending Carrier Update" : null,
            description: "Package has left our facility.",
            icon: Truck,
            active: ["SHIPPED", "DELIVERED"].includes(order.status)
        },
        {
            title: "Delivered",
            date: order.status === "DELIVERED" ? "Expected Arrival" : null,
            description: "Package delivered to customer.",
            icon: Package,
            active: order.status === "DELIVERED"
        }
    ];

    const fulfillmentStatus = order.fulfillmentStatus || "Unfulfilled"; // Fallback for old records

    return (
        <div className="w-full max-w-[1440px] mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Link href="/orders" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <ChevronLeft size={24} />
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Order #NX-{order.id.slice(-4).toUpperCase()}</h1>

                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide", getStatusStyles(order.status))}>
                            {order.status}
                        </span>
                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide", getFulfillmentStyles(fulfillmentStatus))}>
                            {fulfillmentStatus.toUpperCase()}
                        </span>
                    </div>
                    <p className="text-slate-500 ml-10">Placed on {formattedDate}</p>
                </div>

                {/* Status Updater (Client Component) */}
                <OrderStatusUpdater
                    orderId={orderId}
                    currentStatus={order.status}
                    currentFulfillmentStatus={fulfillmentStatus}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Items List */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-900">Items</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {order.orderItems.map((item) => (
                                <div key={item.id} className="p-6 flex items-center gap-6">
                                    <div className="size-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400">
                                        {item.product.images[0] ? (
                                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package size={32} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-slate-900">{item.product.name}</h4>
                                        <div className="flex flex-wrap gap-2 items-center mt-1">
                                            <p className="text-sm text-slate-500">{item.product.category || "General Item"}</p>
                                            {item.size && (
                                                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Size: {item.size}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-slate-900">{formatCurrency(Number(item.price))}</p>
                                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6">Timeline</h3>
                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                            {timeline.map((step, idx) => (
                                <div key={idx} className={cn("relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group", step.active && "is-active")}>
                                    <div className={cn(
                                        "flex items-center justify-center w-10 h-10 rounded-full border border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10",
                                        step.active ? "bg-[#135bec] text-white" : "bg-slate-200 text-slate-500"
                                    )}>
                                        <step.icon size={16} />
                                    </div>
                                    <div className={cn(
                                        "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border transition-all",
                                        step.active ? "border-slate-100 bg-slate-50 shadow-sm" : "border-slate-100 opacity-60"
                                    )}>
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-slate-900">{step.title}</div>
                                            {step.date && <time className={cn("text-xs font-medium", step.active ? "text-[#135bec]" : "text-slate-400")}>{step.date}</time>}
                                        </div>
                                        <div className="text-slate-500 text-sm">{step.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900">Customer Information</h3>
                            <button className="text-[#135bec] hover:text-blue-600 transition-colors">
                                <Edit size={18} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{order.user?.name || "Guest User"}</p>
                                    <p className="text-xs text-slate-500">Member since 2021</p>
                                </div>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Mail size={16} />
                                    <span>{order.user?.email || "No email"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Phone size={16} />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900">Shipping Address</h3>
                            <button className="text-[#135bec] hover:text-blue-600 transition-colors">
                                <Truck size={18} />
                            </button>
                        </div>
                        <div className="text-sm text-slate-600 leading-relaxed">
                            <p className="font-medium text-slate-900">Alex Johnson</p>
                            <p>123 Innovation Drive, Suite 400</p>
                            <p>San Francisco, CA 94103</p>
                            <p>United States</p>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Payment Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(totalAmount * 0.92)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Tax (8%)</span>
                                <span>{formatCurrency(totalAmount * 0.08)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Shipping</span>
                                <span className="text-[#135bec] font-medium">Free</span>
                            </div>
                            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                <span className="font-bold text-slate-900">Total</span>
                                <span className="text-xl font-bold text-slate-900">{formatCurrency(totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
