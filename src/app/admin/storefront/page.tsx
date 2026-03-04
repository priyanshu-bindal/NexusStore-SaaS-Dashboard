import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSections } from "@/actions/storefront";
import StorefrontManager from "@/components/admin/StorefrontManager";
import type { StorefrontSectionData, SectionType, SectionContent } from "@/types/storefront";
import { Globe } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Storefront Manager — Shopystore Super Admin",
    description: "Manage your homepage sections in real-time without redeploying.",
};

export default async function StorefrontPage() {
    // Server-side auth + role check
    const session = await auth();
    if (!session?.user) redirect("/sign-in");
    if ((session.user as any).role !== "ADMIN") redirect("/sign-in");

    // Fetch sections from DB
    const rawSections = await getSections();

    // Cast JSON content to typed interfaces
    const sections: StorefrontSectionData[] = rawSections.map((s: any) => ({
        id: s.id,
        type: s.type as SectionType,
        title: s.title,
        order: s.order,
        isActive: s.isActive,
        content: s.content as unknown as SectionContent,
        updatedAt: s.updatedAt,
    }));

    return (
        <div className="flex-1 w-full">
            {/* Page Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-[1440px] mx-auto px-6 py-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                        <span>ADMIN CONTROL</span>
                        <span>/</span>
                        <span className="text-blue-600 font-semibold">STOREFRONT MANAGER</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                Storefront Manager
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Curate your homepage experience with real-time dynamic block management.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1440px] mx-auto px-6 py-8">
                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: "Total Sections", value: sections.length },
                        { label: "Active Sections", value: sections.filter((s) => s.isActive).length },
                        { label: "Inactive Sections", value: sections.filter((s) => !s.isActive).length },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]"
                        >
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                {stat.label}
                            </p>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Section Manager */}
                <StorefrontManager initialSections={sections} />

                {/* Footer note */}
                <p className="text-center text-xs text-slate-400 mt-10">
                    © {new Date().getFullYear()} Shopystore Super Admin Portal ·{" "}
                    <Link href="/dashboard" className="hover:text-slate-600 transition-colors">
                        Back to Dashboard
                    </Link>
                </p>
            </div>
        </div>
    );
}
