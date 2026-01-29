"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    BarChart3,
    Settings
} from "lucide-react";
import { cn } from "../../lib/utils";

const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/orders", label: "Orders", icon: ShoppingBag },
    { href: "/products", label: "Products", icon: Package },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardNav() {
    const pathname = usePathname();

    return (
        <nav className="hidden lg:flex items-center h-full space-x-1 relative">
            {links.map((link) => {
                const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/dashboard");

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "relative flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-lg",
                            isActive ? "text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeNavbarPill"
                                className="absolute inset-0 bg-blue-600 rounded-lg shadow-md shadow-blue-200"
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <link.icon size={20} />
                            {link.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
