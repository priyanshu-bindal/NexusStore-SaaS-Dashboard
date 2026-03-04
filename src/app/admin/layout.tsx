import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Role gate: only ADMIN users can access /admin/*
    if (!session?.user) redirect("/sign-in");
    if ((session.user as any).role !== "ADMIN") redirect("/sign-in");

    return (
        <div
            className="flex flex-col min-h-screen"
            style={{
                background:
                    "radial-gradient(at 0% 0%, rgba(37,99,235,0.04) 0px, transparent 50%), #f8fafc",
            }}
        >
            {/* Top Navigation Bar — matches existing dashboard header style */}
            <header className="bg-white border-b border-slate-200 z-30">
                <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo + Nav */}
                    <div className="flex items-center gap-8 h-full">
                        <div className="flex items-center gap-2">
                            <img
                                src="/logo-icon.png"
                                alt="Shopystore Icon"
                                className="h-10 w-auto object-contain"
                            />
                            <span className="text-2xl font-sans font-bold tracking-tight text-primary">
                                ShopyStore
                            </span>
                        </div>

                        <nav className="hidden md:flex items-center gap-1 h-full">
                            <Link
                                href="/dashboard"
                                className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/storefront"
                                className="px-3 py-1.5 text-sm font-bold text-blue-700 bg-blue-50 rounded-lg"
                            >
                                Storefront
                            </Link>
                        </nav>
                    </div>

                    {/* Right: Admin badge */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            <Shield size={13} />
                            Super Admin
                        </div>
                        <div className="size-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                            {(session.user.name ?? "A")[0].toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full">{children}</main>
        </div>
    );
}
