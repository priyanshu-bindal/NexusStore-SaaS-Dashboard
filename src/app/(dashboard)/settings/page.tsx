import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingsShell } from "./components/SettingsShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Settings | Shopystore",
    description: "Manage your store preferences and account settings.",
};

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/sign-in");

    const store = await db.store.findUnique({
        where: { userId: session.user.id },
        select: { id: true, name: true, description: true, businessEmail: true, phone: true, notificationPrefs: true },
    });
    if (!store) redirect("/onboarding");

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Page Header */}
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
                <p className="text-sm text-slate-500 mb-8">Manage your store preferences and account.</p>

                <SettingsShell store={JSON.parse(JSON.stringify(store))} />
            </div>
        </div>
    );
}
