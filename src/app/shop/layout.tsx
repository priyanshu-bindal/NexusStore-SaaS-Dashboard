import { trackVisit } from "@/lib/tracking";
import { ShopHeader } from "@/components/layout/ShopHeader";

export const dynamic = "force-dynamic";

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Trigger tracking on every page load (server-side)
    await trackVisit();

    return (
        <div className="min-h-screen bg-white">
            <ShopHeader />
            {children}
        </div>
    );
}
