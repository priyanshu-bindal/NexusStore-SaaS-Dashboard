"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, MapPin, Truck, ArrowRight } from "lucide-react";

interface OrderData {
    id: string;
    totalAmount: number;
    createdAt: string;
    orderItems: Array<{
        id: string;
        quantity: number;
        price: number;
        product: {
            id: string;
            name: string;
            images: string[];
        };
    }>;
}

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            if (!orderId) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/orders/${orderId}`);
                const data = await response.json();

                // Check if response contains an error
                if (!response.ok || data.error) {
                    console.error("Failed to fetch order:", data.error || "Unknown error");
                    setOrderData(null);
                } else {
                    setOrderData(data);
                }
            } catch (error) {
                console.error("Failed to fetch order:", error);
                setOrderData(null);
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();
    }, [orderId]);

    // Calculate delivery date (3-5 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    } as const;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!orderId || !orderData) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Order not found</h1>
                <Link href="/shop" className="text-blue-600 hover:text-blue-700 font-medium">
                    Return to Shop
                </Link>
            </div>
        );
    }

    const subtotal = orderData.orderItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = orderData.totalAmount;

    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans antialiased">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 py-5 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center md:justify-between items-center">
                    <Link href="/shop" className="flex items-center gap-2">
                        <div className="size-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="size-5 text-white" fill="currentColor" viewBox="0 0 48 48">
                                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">NexusStore</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-start">
                <motion.div
                    className="w-full max-w-2xl flex flex-col items-center text-center space-y-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Success Icon & Message */}
                    <motion.div className="space-y-4" variants={itemVariants}>
                        <motion.div
                            className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-2"
                            animate={{
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 0.6,
                                times: [0, 0.5, 1],
                                repeat: 0
                            }}
                        >
                            <CheckCircle className="text-6xl text-blue-600" size={64} />
                        </motion.div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                            Thank you for your order!
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Order <span className="font-semibold text-slate-900">#{orderId.slice(0, 8).toUpperCase()}</span> confirmed.
                        </p>
                    </motion.div>

                    {/* Order Info Card */}
                    <motion.div
                        className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-left"
                        variants={itemVariants}
                    >
                        <div className="p-8 space-y-8">
                            {/* Delivery & Address */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                        <Truck className="size-4" />
                                        Estimated Delivery
                                    </div>
                                    <p className="text-xl font-semibold text-slate-900">
                                        Arriving by {formattedDeliveryDate}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                        <MapPin className="size-4" />
                                        Shipping Address
                                    </div>
                                    <address className="not-italic text-sm text-slate-900 leading-relaxed">
                                        John Doe<br />
                                        123 Nexus Way<br />
                                        San Francisco, CA 94103
                                    </address>
                                </div>
                            </div>

                            {/* Track Order Button */}
                            <Link
                                href="#"
                                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 group"
                            >
                                Track Order
                                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-slate-50 border-t border-slate-200 px-8 py-6">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4">Order Summary</h3>
                            <div className="space-y-4">
                                {orderData.orderItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        className="flex items-center gap-4"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                                            <Image
                                                alt={item.product.name}
                                                src={item.product.images[0] || "/placeholder.png"}
                                                width={48}
                                                height={48}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">
                                                {item.product.name}
                                            </p>
                                            <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium text-slate-900">
                                            ${(Number(item.price) * item.quantity).toFixed(2)}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-600">Total Paid</span>
                                <span className="text-lg font-bold text-slate-900">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Links */}
                    <motion.div className="w-full space-y-6" variants={itemVariants}>
                        <div className="flex justify-center items-center gap-6 text-sm">
                            <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                Need help?
                            </Link>
                            <span className="text-slate-300">|</span>
                            <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                Return Policy
                            </Link>
                        </div>
                        <Link
                            href="/shop"
                            className="w-full md:w-auto px-8 py-3 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-50 transition-colors inline-block"
                        >
                            Continue Shopping
                        </Link>
                    </motion.div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-4">
                    <p className="text-sm text-slate-500 text-center">
                        © 2024 NexusStore Inc.
                    </p>
                    <div className="flex space-x-6 text-sm text-slate-500">
                        <Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-blue-600 transition-colors">Help Center</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
