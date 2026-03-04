"use client";

import { SessionProvider } from "next-auth/react";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { CartProvider } from "@/context/CartContext";
import { GlobalLoaderProvider } from "@/context/GlobalLoaderContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <AuthModalProvider>
                <CartProvider>
                    <GlobalLoaderProvider>
                        {children}
                    </GlobalLoaderProvider>
                </CartProvider>
            </AuthModalProvider>
        </SessionProvider>
    );
}
