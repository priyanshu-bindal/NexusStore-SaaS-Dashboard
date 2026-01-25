"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
    id: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
    storeName?: string;
};

type CartContextType = {
    items: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    count: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Hydrate from localStorage
    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem("nexus_cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Persist to localStorage
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("nexus_cart", JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addToCart = (product: any) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: product.images?.[0],
                    quantity: 1,
                    storeName: product.store?.name,
                },
            ];
        });
        setIsOpen(true);
    };

    const removeFromCart = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return removeFromCart(id);
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                total,
                count,
                isOpen,
                setIsOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
