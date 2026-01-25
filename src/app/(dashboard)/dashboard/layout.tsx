import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Settings, ShoppingCart, Users } from "lucide-react";

export const runtime = 'nodejs'; // Force Node.js runtime for pg adapter compatibility

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // 1. Authentication Check
    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    // 2. Role-Based Logic
    if (session.user.role === "MERCHANT") {
        let store = null;

        // Safe Prisma Query
        try {
            store = await db.store.findFirst({
                where: {
                    userId: session.user.id,
                },
                select: {
                    id: true,
                },
            });
        } catch (error) {
            console.error("Database error:", error);
            // If DB fails, we proceed with store = null, which redirects to onboarding
            // This is safer than breaking the layout
        }

        // Redirect must happen outside try/catch to valid NEXT_REDIRECT
        // If merchant has no store (or DB failed), redirect to onboarding
        if (!store) {
            redirect("/onboarding");
        }
    } else if (session.user.role === "CUSTOMER") {
        // Customers should not access dashboard
        redirect("/shop");
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden md:flex flex-col fixed h-full">
                <div className="flex items-center gap-2 mb-10 text-[#2563eb]">
                    <LayoutDashboard className="size-6" />
                    <h1 className="font-bold text-xl text-slate-900">NexusStore</h1>
                </div>

                <nav className="space-y-2 flex-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-[#2563eb]/10 text-[#2563eb] rounded-lg font-medium text-sm">
                        <LayoutDashboard className="size-4" />
                        Dashboard
                    </Link>
                    <Link href="/dashboard/products" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
                        <Package className="size-4" />
                        Products
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
                        <ShoppingCart className="size-4" />
                        Orders
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
                        <Users className="size-4" />
                        Customers
                    </Link>
                </nav>

                <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors mt-auto">
                    <Settings className="size-4" />
                    Settings
                </Link>
            </aside>

            {/* Main Content Wrapper - Push content right by sidebar width */}
            <div className="flex-1 md:ml-64 flex flex-col">
                {children}
            </div>
        </div>
    );
}
