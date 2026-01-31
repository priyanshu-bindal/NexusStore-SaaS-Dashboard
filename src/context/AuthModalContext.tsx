"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AuthModalContextType = {
    isOpen: boolean;
    redirectPath: string;
    openModal: (redirectPath?: string) => void;
    closeModal: () => void;
};

const AuthModalContext = createContext<AuthModalContextType | undefined>(
    undefined
);

export function AuthModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [redirectPath, setRedirectPath] = useState("/checkout");

    const openModal = (path: string = "/checkout") => {
        setRedirectPath(path);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <AuthModalContext.Provider
            value={{ isOpen, redirectPath, openModal, closeModal }}
        >
            {children}
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error("useAuthModal must be used within AuthModalProvider");
    }
    return context;
}
