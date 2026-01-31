"use client";

import { SessionProvider } from "next-auth/react";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { CartProvider } from "@/context/CartContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <AuthModalProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </AuthModalProvider>
        </SessionProvider>
    );
}
