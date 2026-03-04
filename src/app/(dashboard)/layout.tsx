import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardUserBadge } from "@/components/dashboard/DashboardUserBadge";
import { Bell } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";

/** Converts a store name to 1–2 uppercase initials.
 *  "John's Tech Store" → "JT"
 *  "Sneakers" → "SN"
 *  "Apple" → "AP"
 */
function getInitials(name: string): string {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }
    return words
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Fetch store name for the nav badge (best-effort; fallback if not found)
    let storeName = "My Store";
    if (session?.user?.id) {
        const store = await db.store.findUnique({
            where: { userId: session.user.id },
            select: { name: true },
        });
        if (store?.name) storeName = store.name;
    }

    const initials = getInitials(storeName);

    return (
        <div
            className="flex flex-col h-screen overflow-hidden bg-[#f8fafc]"
            style={{
                backgroundImage: `radial-gradient(at 0% 0%, rgba(19, 91, 236, 0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.05) 0px, transparent 50%)`
            }}
        >
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 z-30">
                <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8 h-full">
                        <div className="flex items-center gap-2">
                            <img
                                src="/logo-icon.png"
                                alt="Shopystore Icon"
                                className="h-10 w-auto object-contain"
                            />
                            <span className="text-2xl font-sans font-bold tracking-tight text-primary">ShopyStore</span>
                        </div>

                        <DashboardNav />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="size-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#d97706] transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="h-8 w-px bg-slate-200 mx-1" />

                        {/* Dynamic store badge */}
                        <DashboardUserBadge storeName={storeName} initials={initials} />
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
