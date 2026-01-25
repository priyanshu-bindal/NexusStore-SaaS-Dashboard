"use client";

import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartSheet() {
    const { items, removeFromCart, updateQuantity, total, isOpen, setIsOpen } = useCart();
    const [isVisible, setIsVisible] = useState(false);

    // Handle animation
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // match transition
            document.body.style.overflow = "";
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <div
                className={`relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShoppingBag className="size-5 text-[#2563eb]" />
                        Your Cart
                        <span className="text-sm font-normal text-slate-400 ml-2">({items.length} items)</span>
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-400">
                            <ShoppingBag className="size-16 stroke-1" />
                            <p className="font-medium text-slate-600">Your cart is empty</p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-[#2563eb] font-bold hover:underline"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="size-20 bg-slate-50 rounded-lg flex items-center justify-center p-2 flex-shrink-0 border border-slate-100">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <ShoppingBag className="size-8 text-slate-300" />
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-bold text-slate-900 line-clamp-2 text-sm">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                        {item.storeName && (
                                            <p className="text-xs text-slate-500 mt-1">Sold by {item.storeName}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center border border-slate-200 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1.5 hover:bg-slate-50 text-slate-600 disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="size-3" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1.5 hover:bg-slate-50 text-slate-600"
                                            >
                                                <Plus className="size-3" />
                                            </button>
                                        </div>
                                        <p className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-slate-500 font-medium">Subtotal</span>
                            <span className="text-2xl font-black text-slate-900">${total.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-slate-400 text-center">Shipping and taxes calculated at checkout.</p>
                        <Link
                            href="/checkout"
                            onClick={() => setIsOpen(false)}
                            className="block w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-4 text-center rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
