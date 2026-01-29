"use client";

import { createOrder } from "@/actions/order";
import { useCart } from "@/context/CartContext";
import { Check, ChevronRight, CreditCard, HelpCircle, Lock, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Checkout() {
    const { items, total, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();


    const handlePlaceOrder = async () => {
        if (items.length === 0) return;

        setIsProcessing(true);
        try {
            const result = await createOrder(items.map(item => ({ productId: item.id, quantity: item.quantity })));

            if ("success" in result && result.success) {
                clearCart();
                router.push("/shop?success=true");
            } else {
                alert((result as { error: string }).error || "Failed to place order");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("An unexpected error occurred.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Calculate totals
    const subtotal = total;
    const shipping = 0; // Free for now
    const tax = subtotal * 0.08; // Mock 8% tax
    const finalTotal = subtotal + shipping + tax;

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
            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-2">
                            <Link href="/shop" className="flex items-center gap-2">
                                <div className="text-[#2563eb] size-8">
                                    <svg
                                        fill="currentColor"
                                        viewBox="0 0 48 48"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                                    </svg>
                                </div>
                                <span className="text-xl font-bold tracking-tight">NexusStore</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                            <Lock className="size-5" />
                            Secure Checkout
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-[70%] space-y-4">
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <span className="size-7 bg-[#2563eb] text-white text-sm font-bold flex items-center justify-center rounded-full">
                                        1
                                    </span>
                                    <h2 className="font-bold text-lg">Shipping Address</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase">
                                            First Name
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all outline-none text-sm"
                                            placeholder="John"
                                            type="text"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase">
                                            Last Name
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all outline-none text-sm"
                                            placeholder="Doe"
                                            type="text"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase">
                                            Address
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all outline-none text-sm"
                                            placeholder="123 Nexus Way"
                                            type="text"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase">
                                            City
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all outline-none text-sm"
                                            placeholder="San Francisco"
                                            type="text"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase">
                                                State
                                            </label>
                                            <input
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all outline-none text-sm"
                                                placeholder="CA"
                                                type="text"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase">
                                                ZIP
                                            </label>
                                            <input
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all outline-none text-sm"
                                                placeholder="94103"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
                                        Continue to Shipping
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden opacity-60">
                            <div className="px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="size-7 bg-slate-200 text-slate-500 text-sm font-bold flex items-center justify-center rounded-full">
                                        2
                                    </span>
                                    <h2 className="font-bold text-lg text-slate-400">
                                        Shipping Method
                                    </h2>
                                </div>
                                <button className="text-sm font-bold text-[#2563eb] cursor-pointer">
                                    Edit
                                </button>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="size-7 bg-[#2563eb] text-white text-sm font-bold flex items-center justify-center rounded-full">
                                        3
                                    </span>
                                    <h2 className="font-bold text-lg">Payment Information</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                        <label
                                            className={`relative flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "credit_card"
                                                ? "border-[#2563eb] bg-[#2563eb]/5"
                                                : "border-slate-200 hover:border-[#2563eb]/50"
                                                }`}
                                            onClick={() => setPaymentMethod("credit_card")}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                className="hidden"
                                                checked={paymentMethod === "credit_card"}
                                                readOnly
                                            />
                                            <CreditCard className={`size-6 ${paymentMethod === "credit_card" ? "text-[#2563eb]" : "text-slate-400"}`} />
                                            <span className="font-bold text-sm">Credit Card</span>
                                            {paymentMethod === "credit_card" && (
                                                <div className="absolute -top-2 -right-2 bg-[#2563eb] text-white rounded-full p-0.5">
                                                    <Check className="size-3" />
                                                </div>
                                            )}
                                        </label>

                                        <label
                                            className={`relative flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "paypal"
                                                ? "border-[#2563eb] bg-[#2563eb]/5"
                                                : "border-slate-200 hover:border-[#2563eb]/50"
                                                }`}
                                            onClick={() => setPaymentMethod("paypal")}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                className="hidden"
                                                checked={paymentMethod === "paypal"}
                                                readOnly
                                            />
                                            <img
                                                alt="PayPal"
                                                className="h-4"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG45hxOaOpchhEnTLRFwi0BnlnhDvIUjuiJpB1A2zulKj_86p-rqPKuRUMQf4XeVG7lBIWwmjWDhPqetUqFkzU-qCluIBS6FJ5YBdOVNaHZ3mGJToXVGTgc7AoJQGiEg96QOXWG68LsfQJAnA4x4cBAXpBkZv_NM6vxTLf3Kubc47-i7G_1KXDbKGUf9_SR4kz5oyD4kZjZd4keaAvnaoQ1KjmQ2QFcr19B1KkWGWnjSlatNA6wfEfalgk0DQvo_9wuSakc63Ppvhb"
                                            />
                                            {paymentMethod === "paypal" && (
                                                <div className="absolute -top-2 -right-2 bg-[#2563eb] text-white rounded-full p-0.5">
                                                    <Check className="size-3" />
                                                </div>
                                            )}
                                        </label>

                                        <label
                                            className={`relative flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "apple_pay"
                                                ? "border-[#2563eb] bg-[#2563eb]/5"
                                                : "border-slate-200 hover:border-[#2563eb]/50"
                                                }`}
                                            onClick={() => setPaymentMethod("apple_pay")}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                className="hidden"
                                                checked={paymentMethod === "apple_pay"}
                                                readOnly
                                            />
                                            <span className="font-bold text-sm pl-8">Apple Pay</span>
                                            {paymentMethod === "apple_pay" && (
                                                <div className="absolute -top-2 -right-2 bg-[#2563eb] text-white rounded-full p-0.5">
                                                    <Check className="size-3" />
                                                </div>
                                            )}
                                        </label>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase">
                                                Card Number
                                            </label>
                                            <div className="relative">
                                                <input
                                                    className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all outline-none text-sm"
                                                    placeholder="0000 0000 0000 0000"
                                                    type="text"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                                                    <img
                                                        alt="Visa"
                                                        className="h-4"
                                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsu3-z6WaFEsJOYx36jPNRaE5xSVIi5W-mQ6TrWnHiqPoDO64LyXrvfX_DMmGWwJXAw24bXm2lOUB4QVA4ajE_erWNh6JxKBWN5RlALaDfcEf3op7YDcVINlggZqJPY94Cxah9kf3sqOI3f-fvemyzh_6ZqJta9Su6LjtCT8R_tN0b9829KUT57YWWaJNejQaK3ZzJ-QqR633hzmmJ1nyYpKBX29KwTIThsufyY4sOBIIKmFDtO9InFwdl_CAojUZ7cee__waHfZRx"
                                                    />
                                                    <img
                                                        alt="MC"
                                                        className="h-4"
                                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMLtym6zacFDL1Wvwpmaw7TLUr4cdvnOHawVyPU0czT9AynCm3AM8QvVIV7LJ9LXLjB6CpDOdBtfiKlCUlnAGk9pFi653x-HMhgy3N2-4uBk7093IS1ApYtF4BA397IJ5cJdz0ai8PFdQTV3sP4LPn9enT_v5-jteOWwfHwu04KbcnNiF2MH-gtSLZYEtT1fD-tloaBlsex7xEGYFRVQjjthHH01DY1Nde9n8cv8kTFIBd-eevwxhOdpXox4j9CpoUNqR0r5K5l3mQ"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all outline-none text-sm"
                                                    placeholder="MM/YY"
                                                    type="text"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase">
                                                    CVC
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all outline-none text-sm"
                                                        placeholder="123"
                                                        type="text"
                                                    />
                                                    <HelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 size-4 cursor-help" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center gap-2 text-xs text-slate-500">
                                        <ShieldCheck className="size-4 text-[#2563eb]" />
                                        Your transaction is secure and encrypted.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-[30%]">
                        <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-lg mb-6">Order Summary</h3>
                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="size-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.image && (
                                                <img
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    src={item.image}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-slate-900 truncate">
                                                {item.name}
                                            </h4>
                                            <p className="text-xs text-slate-500">Quantity: {item.quantity}</p>
                                            <p className="text-sm font-black mt-1">${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-slate-100 pt-6 space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Shipping</span>
                                    <span className="text-[#2563eb] font-medium">{shipping === 0 ? "Free" : `$${(shipping as number).toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Estimated Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-100">
                                    <span>Total</span>
                                    <span>${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex gap-2">
                                    <input
                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all outline-none text-sm"
                                        placeholder="Promo code"
                                        type="text"
                                    />
                                    <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer">
                                        Apply
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing || items.length === 0}
                                className="w-full bg-[#2563eb] hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#2563eb]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="size-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Place Order
                                        <ChevronRight className="size-5" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-slate-400 mt-4 px-4 leading-relaxed">
                                By placing your order, you agree to NexusStore's{" "}
                                <Link className="underline hover:text-slate-600" href="#">
                                    Terms of Use
                                </Link>{" "}
                                and{" "}
                                <Link className="underline hover:text-slate-600" href="#">
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-20 border-t border-slate-200 py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-6 mb-4">
                        <img
                            alt="Visa"
                            className="h-5 grayscale opacity-50"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsu3-z6WaFEsJOYx36jPNRaE5xSVIi5W-mQ6TrWnHiqPoDO64LyXrvfX_DMmGWwJXAw24bXm2lOUB4QVA4ajE_erWNh6JxKBWN5RlALaDfcEf3op7YDcVINlggZqJPY94Cxah9kf3sqOI3f-fvemyzh_6ZqJta9Su6LjtCT8R_tN0b9829KUT57YWWaJNejQaK3ZzJ-QqR633hzmmJ1nyYpKBX29KwTIThsufyY4sOBIIKmFDtO9InFwdl_CAojUZ7cee__waHfZRx"
                        />
                        <img
                            alt="Mastercard"
                            className="h-5 grayscale opacity-50"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMLtym6zacFDL1Wvwpmaw7TLUr4cdvnOHawVyPU0czT9AynCm3AM8QvVIV7LJ9LXLjB6CpDOdBtfiKlCUlnAGk9pFi653x-HMhgy3N2-4uBk7093IS1ApYtF4BA397IJ5cJdz0ai8PFdQTV3sP4LPn9enT_v5-jteOWwfHwu04KbcnNiF2MH-gtSLZYEtT1fD-tloaBlsex7xEGYFRVQjjthHH01DY1Nde9n8cv8kTFIBd-eevwxhOdpXox4j9CpoUNqR0r5K5l3mQ"
                        />
                        <img
                            alt="Paypal"
                            className="h-5 grayscale opacity-50"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG45hxOaOpchhEnTLRFwi0BnlnhDvIUjuiJpB1A2zulKj_86p-rqPKuRUMQf4XeVG7lBIWwmjWDhPqetUqFkzU-qCluIBS6FJ5YBdOVNaHZ3mGJToXVGTgc7AoJQGiEg96QOXWG68LsfQJAnA4x4cBAXpBkZv_NM6vxTLf3Kubc47-i7G_1KXDbKGUf9_SR4kz5oyD4kZjZd4keaAvnaoQ1KjmQ2QFcr19B1KkWGWnjSlatNA6wfEfalgk0DQvo_9wuSakc63Ppvhb"
                        />
                    </div>
                    <p className="text-xs text-slate-400">
                        © 2024 NexusStore Inc. All transactions are secure and encrypted.
                    </p>
                </div>
            </footer>
        </div>
    );
}
