"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

type GlobalLoaderContextType = {
    startLoading: () => void;
    stopLoading: () => void;
};

const GlobalLoaderContext = createContext<GlobalLoaderContextType | undefined>(undefined);

export function GlobalLoaderProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Stop the loading spinner when the transition finishes (i.e. pathname/searchParams changes)
    useEffect(() => {
        setIsLoading(false);
    }, [pathname, searchParams]);

    return (
        <GlobalLoaderContext.Provider value={{ startLoading: () => setIsLoading(true), stopLoading: () => setIsLoading(false) }}>
            {children}
            {isLoading && <LoadingSpinner />}
        </GlobalLoaderContext.Provider>
    );
}

export function useGlobalLoader() {
    const context = useContext(GlobalLoaderContext);
    if (context === undefined) {
        throw new Error("useGlobalLoader must be used within a GlobalLoaderProvider");
    }
    return context;
}
