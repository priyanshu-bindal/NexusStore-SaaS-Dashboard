import { trackVisit } from "@/lib/tracking";
import { ShopHeader } from "@/components/layout/ShopHeader";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export const dynamic = "force-dynamic";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Trigger tracking on every page load (server-side) - Fire and Forget
    trackVisit().catch(err => console.error("Tracking error:", err));

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <ShopHeader />
            <main className="flex-1">
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <LoadingSpinner />
                    </div>
                }>
                    {children}
                </Suspense>
            </main>
        </div>
    );
}
