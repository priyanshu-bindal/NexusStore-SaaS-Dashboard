"use client";

import { createOrder } from "@/actions/order";
import { getAddresses } from "@/actions/addresses";
import { useCart } from "@/context/CartContext";
import { Check, ChevronRight, CreditCard, Lock, Loader2, MapPin, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AddAddressModal } from "@/components/profile/AddAddressModal";

type Address = {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string | null;
    isDefault: boolean;
};

export default function Checkout() {
    const { items, total, clearCart, removeFromCart } = useCart();
    const router = useRouter();

    // State
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    // Fetch addresses on mount
    useEffect(() => {
        async function fetchAddresses() {
            try {
                const fetchedAddresses = await getAddresses();
                setAddresses(fetchedAddresses);

                // Set default address if exists, otherwise first one
                const defaultAddress = fetchedAddresses.find(a => a.isDefault);
                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress.id);
                } else if (fetchedAddresses.length > 0) {
                    setSelectedAddressId(fetchedAddresses[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch addresses", error);
            } finally {
                setIsLoadingAddresses(false);
            }
        }
        fetchAddresses();
    }, [isAddressModalOpen]); // Re-fetch when modal closes

    const handlePlaceOrder = async () => {
        if (items.length === 0) return;

        if (!selectedAddressId) {
            alert("Please select a shipping address.");
            return;
        }

        const selectedAddress = addresses.find(a => a.id === selectedAddressId);
        if (!selectedAddress) return;

        setIsProcessing(true);
        try {
            const result = await createOrder(
                items.map(item => ({ productId: item.id, quantity: item.quantity, size: item.size })),
                selectedAddress
            );

            if ("success" in result && result.success) {
                setIsSuccess(true);
                clearCart();
                router.push(`/checkout/success?orderId=${result.orderId}`);
            } else {
                const errorData = result as { error: string; missingIds?: string[] };

                if (errorData.missingIds && errorData.missingIds.length > 0) {
                    errorData.missingIds.forEach((id) => removeFromCart(id));
                    alert(errorData.error);
                } else {
                    alert(errorData.error || "Failed to place order");
                }
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("An unexpected error occurred.");
            setIsProcessing(false);
        }
    };

    // Calculate totals
    const subtotal = total;
    const shipping = 0; // Free for now
    const tax = subtotal * 0.08; // Mock 8% tax
    const finalTotal = subtotal + shipping + tax;

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="size-12 animate-spin text-[#2563eb]" />
                    <p className="text-slate-500 font-medium">Processing your order...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-slate-900">Your cart is empty</h1>
                    <p className="text-slate-500">Add some products to your cart to proceed with checkout.</p>
                    <Link href="/shop" className="inline-block bg-[#2563eb] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#1d4ed8] transition-colors">
                        Return to Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f8fafc] text-slate-900 font-sans antialiased min-h-screen">
            {/* Header */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/shop" className="flex items-center gap-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <svg className="size-5 text-white" fill="currentColor" viewBox="0 0 48 48">
                                    <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Nexus<span className="text-blue-600">Store</span></span>
                        </Link>
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            <Lock className="size-4" />
                            Secure Checkout
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Column: Form Info */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* 1. Shipping Address Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <h2 className="font-bold text-lg flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">1</span>
                                    Shipping Address
                                </h2>
                                <button
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                    <Plus size={16} /> Add New
                                </button>
                            </div>

                            <div className="p-6 flex ">
                                {isLoadingAddresses ? (
                                    <div className="flex justify-center p-8">
                                        <Loader2 className="animate-spin text-slate-400" />
                                    </div>
                                ) : addresses.length === 0 ? (
                                    <div className="text-center py-8">
                                        <MapPin className="size-10 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 mb-4">No saved addresses found.</p>
                                        <button
                                            onClick={() => setIsAddressModalOpen(true)}
                                            className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-colors"
                                        >
                                            Add Shipping Address
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-4">
                                        {addresses.map((addr) => (
                                            <label
                                                key={addr.id}
                                                className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                                            >
                                                <div className="mt-1">
                                                    <input
                                                        type="radio"
                                                        name="shipping_address"
                                                        checked={selectedAddressId === addr.id}
                                                        onChange={() => setSelectedAddressId(addr.id)}
                                                        className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-bold text-slate-900">{addr.name}</span>
                                                        {addr.isDefault && (
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Default</span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-slate-600 leading-relaxed">
                                                        {addr.street}<br />
                                                        {addr.city}, {addr.state} {addr.zip}<br />
                                                        {addr.country}
                                                        {addr.phone && <span className="block mt-1 text-slate-500">{addr.phone}</span>}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. Payment Method (Mock) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden opacity-100">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="font-bold text-lg flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">2</span>
                                    Payment Method
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="p-4 border border-blue-600/30 bg-blue-50/50 rounded-xl flex items-center gap-4">
                                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                                        <CreditCard className="text-blue-600 size-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Credit Card (Mock)</p>
                                        <p className="text-xs text-slate-500">Ending in 4242</p>
                                    </div>
                                    <Check className="ml-auto text-blue-600" size={20} />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="font-bold text-lg">Order Summary</h2>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Items */}
                                <div className="max-h-80 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                    {items.map((item) => (
                                        <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                                                <Image src={item.image ?? "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-slate-900 text-sm truncate">{item.name}</h3>
                                                {item.size && <p className="text-xs text-slate-500 mt-0.5">Size: {item.size}</p>}
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                                    <p className="font-bold text-sm text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-slate-100 pt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Subtotal</span>
                                        <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Shipping</span>
                                        <span className="font-medium text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Tax</span>
                                        <span className="font-medium text-slate-900">${tax.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="font-bold text-lg text-slate-900">Total</span>
                                        <span className="font-black text-2xl text-blue-600">${finalTotal.toFixed(2)}</span>
                                    </div>

                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={isProcessing || isLoadingAddresses}
                                        className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="animate-spin" /> Processing...
                                            </>
                                        ) : (
                                            <>
                                                Place Order <ChevronRight size={20} />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-xs text-slate-400 mt-4">
                                        By placing an order, you agree to our Terms of Service.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddAddressModal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} />
        </div>
    );
}