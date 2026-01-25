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
        <>
            {children}
        </>
    );
}
