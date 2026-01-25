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
                            "relative flex items-center gap-2 px-3 h-full text-sm font-semibold transition-colors z-10",
                            isActive ? "text-[#10b981]" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        <link.icon size={18} />
                        {link.label}
                        {isActive && (
                            <motion.div
                                layoutId="navbar-indicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10b981]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
