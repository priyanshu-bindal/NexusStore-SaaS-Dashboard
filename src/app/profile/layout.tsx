import { ShopHeader } from "@/components/layout/ShopHeader";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900">
            <ShopHeader />

            <div className="flex-1 w-full max-w-full mx-auto px-4 md:px-10 py-8 mt-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    <ProfileSidebar />
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
