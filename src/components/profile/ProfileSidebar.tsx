"use client";

import Link from "next/link";
import { User, Package2, Settings, LogOut, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export function ProfileSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const user = session?.user;

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-4 lg:sticky lg:top-24">
                <div className="flex items-center gap-3 mb-6 p-2">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 bg-slate-100 flex items-center justify-center overflow-hidden">
                        {user?.image ? (
                            <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                        ) : (
                            <User className="text-slate-400 size-6" />
                        )}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <h1 className="text-slate-900 text-base font-bold leading-normal truncate">
                            {user?.name || "Guest User"}
                        </h1>
                        <p className="text-slate-500 text-xs font-normal leading-normal truncate">
                            {user?.email || "No email"}
                        </p>
                    </div>
                </div>

                <nav className="flex flex-col gap-1">
                    <Link
                        href="/profile"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                            isActive("/profile")
                                ? "bg-blue-50 text-blue-600"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <User size={20} className={cn("transition-colors", isActive("/profile") ? "text-blue-600 fill-current" : "text-slate-400 group-hover:text-slate-900")} />
                        <span className="text-sm font-bold">Profile</span>
                    </Link>

                    <Link
                        href="/profile/orders"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                            isActive("/profile/orders")
                                ? "bg-blue-50 text-blue-600"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Package2 size={20} className={cn("transition-colors", isActive("/profile/orders") ? "text-blue-600" : "text-slate-400 group-hover:text-slate-900")} />
                        <span className="text-sm font-medium">Orders</span>
                    </Link>

                    <Link
                        href="/profile/addresses"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                            isActive("/profile/addresses")
                                ? "bg-blue-50 text-blue-600"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <MapPin size={20} className={cn("transition-colors", isActive("/profile/addresses") ? "text-blue-600" : "text-slate-400 group-hover:text-slate-900")} />
                        <span className="text-sm font-medium">Addresses</span>
                    </Link>

                    <Link
                        href="/profile/settings"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                            isActive("/profile/settings")
                                ? "bg-blue-50 text-blue-600"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Settings size={20} className={cn("transition-colors", isActive("/profile/settings") ? "text-blue-600" : "text-slate-400 group-hover:text-slate-900")} />
                        <span className="text-sm font-medium">Settings</span>
                    </Link>

                    <div className="h-px bg-slate-200 my-2 mx-3"></div>

                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-all w-full text-left"
                    >
                        <LogOut size={20} />
                        <span className="text-sm font-medium">Log Out</span>
                    </button>
                </nav>
            </div>
        </aside>
    );
}
