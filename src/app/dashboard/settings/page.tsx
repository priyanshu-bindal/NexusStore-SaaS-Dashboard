import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingsTabs } from "./components/SettingsTabs";

export default async function MerchantSettingsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    // Fetch current store data
    const store = await db.store.findUnique({
        where: { userId: session.user.id },
    });

    if (!store) {
        redirect("/dashboard/setup");
    }

    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Store Settings</h2>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
                {/* Pass serialized store data to client component */}
                <SettingsTabs store={JSON.parse(JSON.stringify(store))} />
            </div>
        </div>
    );
}
