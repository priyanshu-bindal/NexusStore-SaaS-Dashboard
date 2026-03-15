"use client";

import { createContext, useContext, useState, ReactNode, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/loading-spinner";

function RouteChangeListener({ setIsLoading }: { setIsLoading: (val: boolean) => void }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsLoading(false);
    }, [pathname, searchParams, setIsLoading]);

    return null;
}

type GlobalLoaderContextType = {
    startLoading: () => void;
    stopLoading: () => void;
};

const GlobalLoaderContext = createContext<GlobalLoaderContextType | undefined>(undefined);

export function GlobalLoaderProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <GlobalLoaderContext.Provider value={{ startLoading: () => setIsLoading(true), stopLoading: () => setIsLoading(false) }}>
            {children}
            {isLoading && <LoadingSpinner />}
            <Suspense fallback={null}>
                <RouteChangeListener setIsLoading={setIsLoading} />
            </Suspense>
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
