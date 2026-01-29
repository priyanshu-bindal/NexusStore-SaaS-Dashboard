import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import {
    Bell
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="flex flex-col h-screen overflow-hidden bg-[#f8fafc]"
            style={{
                backgroundImage: `radial-gradient(at 0% 0%, rgba(19, 91, 236, 0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.05) 0px, transparent 50%)`
            }}
        >
            {/* Top Navigation Bar from your HTML */}
            <header className="bg-white border-b border-slate-200 z-30">
                <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8 h-full">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-xl shadow-lg">
                                <svg className="size-6 text-white" fill="currentColor" viewBox="0 0 48 48">
                                    <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-sans font-bold tracking-tight text-slate-900">Nexus<span className="text-blue-600">Store</span></span>
                        </div>

                        <DashboardNav />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="size-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#135bec] transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="h-8 w-px bg-slate-200 mx-1"></div>
                        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-900 leading-none">John's Tech Store</p>
                                <p className="text-[10px] text-slate-500 font-medium mt-1">Premium Partner</p>
                            </div>
                            <div className="size-9 bg-[#135bec] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">JD</div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full overflow-y-auto">
                {children}
            </main>
        </div>
    );
}


