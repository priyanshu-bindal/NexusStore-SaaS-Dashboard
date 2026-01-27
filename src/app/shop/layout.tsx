import { trackVisit } from "@/lib/tracking";

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
            {children}
        </div>
    );
}
