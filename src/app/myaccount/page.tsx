"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Bell,
    CreditCard,
    Heart,
    LayoutDashboard,
    LogOut,
    MapPin,
    Menu,
    Package2,
    Search,
    ShoppingCart,
    User,
    X,
} from "lucide-react";
import clsx from "clsx";

export default function Shop() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="bg-[#f8fafc] font-sans text-slate-900 min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
                <div className="w-full flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-4 lg:gap-8">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-1 hover:bg-slate-100 rounded-md transition-colors lg:hidden"
                        >
                            <Menu className="size-6 text-slate-600" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="text-primary size-8">
                                <svg
                                    fill="currentColor"
                                    viewBox="0 0 48 48"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
                                NexusStore
                            </h2>
                        </div>

                        {/* Desktop Toggle Button (optional, but good for UX if user requested "close side bar") */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden lg:flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium"
                        >
                            <Menu className="size-5" />
                        </button>

                        <div className="hidden md:flex relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                            <input
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none placeholder:text-slate-400"
                                placeholder="Search products, brands, orders..."
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-500 hover:text-primary transition-colors">
                            <ShoppingCart className="size-6" />
                            <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                3
                            </span>
                        </button>
                        <button className="p-2 text-slate-500 hover:text-primary transition-colors">
                            <Bell className="size-6" />
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold leading-none text-slate-900">
                                    Alex Johnson
                                </p>
                                <p className="text-[10px] text-slate-500">Pro Member</p>
                            </div>
                            <div className="size-9 rounded-full bg-slate-200 overflow-hidden">
                                <img
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXV56NHlCd8-HzPDKOdVQCKRqAy0bLRZo4kc-l71bP35sfpja77GAHBsshitPa9Qg4UFlOfkSYPfPIwcoolnFxNl-bh0ENkeZP9YSbpba5YgDiRXoQvQf1yH2unt8edcLot4nm7eGofXdaeeOhxWSuyzUnuHF7pR0Og1Vo4wmPnAf6blwlkXHc8yPYfYbHO9pKnrptuhj9I9Gh9IhAkBLkQU5xjM0aJi73ShmFJQrPHDXFsxju5Zi4-tGAX5KjAnnx_lAnmbJ2JVWU"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 w-full overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={clsx(
                        "border-r border-slate-200 bg-white flex flex-col py-8 sticky top-[65px] h-[calc(100vh-65px)] transition-all duration-300 ease-in-out z-40",
                        isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-0 lg:translate-x-0 overflow-hidden opacity-0 lg:opacity-100 lg:hidden"
                    )}
                // Note: On Mobile, we might want it absolute/fixed over content, but based on request "close side bar", collapsing logic is used.
                // For a cleaner drawer effect on mobile, we typically use fixed.
                // However, adhering to the requested layout logic:
                >
                    {/* Mobile Overlay logic could be added here if needed, but keeping it simple as a collapsible panel for now matching the grid layout implication */}
                    <nav className="flex-1 space-y-1 overflow-y-auto">
                        <Link
                            href="/myaccount"
                            className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-primary bg-primary/10 border-r-4 border-primary transition-all"
                        >
                            <LayoutDashboard className="size-5" />
                            <span className="truncate">Dashboard</span>
                        </Link>
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 border-r-4 border-transparent transition-all"
                        >
                            <User className="size-5" />
                            <span className="truncate">Profile</span>
                        </Link>
                        <Link
                            href="#"
                            className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 border-r-4 border-transparent transition-all"
                        >
                            <Package2 className="size-5" />
                            <span className="truncate">Order History</span>
                        </Link>
                        <Link
                            href="#"
                            className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 border-r-4 border-transparent transition-all"
                        >
                            <Heart className="size-5" />
                            <span className="truncate">Wishlist</span>
                        </Link>
                        <Link
                            href="#"
                            className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 border-r-4 border-transparent transition-all"
                        >
                            <MapPin className="size-5" />
                            <span className="truncate">Addresses</span>
                        </Link>
                        <Link
                            href="#"
                            className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 border-r-4 border-transparent transition-all"
                        >
                            <CreditCard className="size-5" />
                            <span className="truncate">Payment Methods</span>
                        </Link>
                    </nav>
                    <div className="px-6 pt-8 mt-auto border-t border-slate-200">
                        <Link
                            href="/sign-in"
                            className="flex items-center gap-3 px-2 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <LogOut className="size-5" />
                            <span className="truncate">Sign Out</span>
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 px-4 sm:px-8 py-8 h-[calc(100vh-65px)] overflow-y-auto">
                    <div className="max-w-5xl mx-auto space-y-10 pb-10">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">
                                Welcome back, Alex!
                            </h1>
                            <p className="text-slate-500">
                                You have 2 orders arriving this week.
                            </p>
                        </div>

                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                                    Your Active Orders
                                    <span className="text-xs font-normal bg-blue-100 text-primary px-2 py-0.5 rounded-full">
                                        2 items
                                    </span>
                                </h3>
                                <Link
                                    href="#"
                                    className="text-primary text-sm font-bold hover:underline"
                                >
                                    View all
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Order Card 1 */}
                                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex gap-4 mb-4">
                                        <div className="size-20 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden">
                                            <img
                                                alt="Speed Runner 2.0"
                                                className="w-full h-full object-cover"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuACx0kc9MVxAD4gLQ1V1vD39WPqI52XbWvCcCCYb2OgLd7MdOsXsHg0da9awOiIJkQX_exiBqiBzjpEx481oi-xq5FChKumixVEuqty1SJkHU6wfgFp30lX6mP5lVTBSnEYwXntzFRZMuf1m_ClY5Odk9nunAdZqw-BGgENVMmfH4ikbh3ePHSxgE81q0LKY6GrbpW_xVOFbRWxn0JohRxTRXIhbDlWjn2UYLVBfhgVo5PZg8xwyu5T6aRbB_ow84aUjQwtokTCQueZ"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-between py-1">
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900">
                                                    Speed Runner 2.0
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Order #NX-882910
                                                </p>
                                            </div>
                                            <div className="text-primary font-bold text-sm">
                                                $180.00
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold uppercase tracking-wider text-sky-500">
                                                In Transit
                                            </span>
                                            <span className="text-[10px] text-slate-500">
                                                Estimated arrival: Oct 24
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                            <div className="h-full bg-primary w-2/3 rounded-full"></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                                            <span>Ordered</span>
                                            <span>Shipped</span>
                                            <span className="text-slate-300">Delivered</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Card 2 */}
                                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex gap-4 mb-4">
                                        <div className="size-20 bg-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center text-slate-300">
                                            {/* Using Lucide icon for placeholder/missing image logic if needed, but here sticking to structure */}
                                            <span className="text-3xl">🎧</span>
                                        </div>
                                        <div className="flex flex-col justify-between py-1">
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900">
                                                    Nexus Noise Cancelling Pro
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Order #NX-882915
                                                </p>
                                            </div>
                                            <div className="text-primary font-bold text-sm">
                                                $349.00
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold uppercase tracking-wider text-green-500">
                                                Processing
                                            </span>
                                            <span className="text-[10px] text-slate-500">
                                                Ships in 24 hours
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                            <div className="h-full bg-green-500 w-1/3 rounded-full"></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                                            <span>Ordered</span>
                                            <span className="text-slate-300">Shipped</span>
                                            <span className="text-slate-300">Delivered</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Saved Products
                                </h3>
                                <Link
                                    href="#"
                                    className="text-primary text-sm font-bold hover:underline"
                                >
                                    Manage wishlist
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    {
                                        title: "Premium Chrono Watch",
                                        price: "$299.00",
                                        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_ptMyKgPFmyYyMZ7efK80TkbRCyLkY4EozyhrGAJKlq-nOZspfu3aWsb4FPxo6ocZ7tB53-gH-ESgGpbhxOCtYCQMXA4x8KAo1OG9-4rPchjJq1WUKFmxvHFas1SoHPaQuRlCpd52-BHh-_EXSvY8wt4ZSWz2liDG6NH_rUWlSxQYII8uc_pvvkBkM8CEZXImP4nE8pmnQ002K5e0Xf1OzXBzPH_Oczd-WevssXgXXdiYxv4abwxeSrnJgY81s4roP1tasDlH40km",
                                    },
                                    {
                                        title: "Swift Knit Runners",
                                        price: "$120.00",
                                        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsaOLLdmxlbjM12wEndcNwCljkfJ9wufH_oPNWWD3kA-dku_RZK_X3MZknNtlnNQttRhyBNvzAzbBmLjdc7BeipUdBnsHBQg4miIs-je_IWk85e2uE65ABV1P_elcHNQqoYHbMXfDR8xaoEmTh5DGeN7hCvzbQVfqmezUa7HpO-eoQ83B71rEO17LgzfKRp50FLPzLbr4t7qYw8gNaoO63R-TXufhWYXmtXgIdx5_LEx6LyRBVqShVcedDizDNuJQKGTF2tyAT7C7K",
                                    },
                                    {
                                        title: "Studio Over-Ear Gen 2",
                                        price: "$199.00",
                                        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaUCkCciy0pGF50ku33LLlH6i0s8FRdtRAJEpWHCKAPXo3Pzzh67qHIjZ9_MzWLJBd9aKGgBK8Os2h4Wq-B1JmrfXAcQbVVLc5DHcc81jAYfwT7LzOLHH7MxnAXCi87VbgsqS3pWn2LOqa5_1BnaCqzrK1JOphhgDGSH5d2M5_4fD4Ul4rYDiHIGIe8plcXRw_b5rrZsSTGo3b_4vMDQ2xfz7k6plaxCTVX5433JBQUqDv7kWpUhhsyEf7RtBSj5imaq4Er97PxSBf",
                                    },
                                    {
                                        title: "Retro 35mm Cam",
                                        price: "$450.00",
                                        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbFNjDPjf7Y0b3eznO3YLMBcndZxWjzfpVCiuO2S7F2oN9uoWx77plDFN-nGLH3I2jvPrxtrz1lyuOJuuOF_s_-oAS0lr1fJCJaN5RADYQSwK96rN87YBEN9X2nh7cAk2g1dzxi6J0Gohy6sWkSWzW-dhB93OJDnBS2TEk3rCbpLA0gr_NrKlH6JdJVZua94fg7JsTzE1LaN2oZENwt89Ouzqrp7pouRKPBiERp--OUGY5YSRajXNZFzKoZxBc8-_Utu--X5pBQl8M",
                                    },
                                ].map((item, index) => (
                                    <div key={index} className="group cursor-pointer">
                                        <div className="aspect-square bg-slate-100 rounded-2xl mb-3 overflow-hidden relative">
                                            <img
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                src={item.img}
                                            />
                                            <button className="absolute top-3 right-3 size-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-red-500 shadow-sm hover:scale-110 transition-transform">
                                                <Heart className="size-4 fill-current" />
                                            </button>
                                        </div>
                                        <h5 className="text-sm font-bold group-hover:text-primary transition-colors text-slate-900">
                                            {item.title}
                                        </h5>
                                        <p className="text-primary font-bold text-sm">
                                            {item.price}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">




                            <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between h-40">
                                <div>
                                    <h4 className="font-bold text-lg leading-tight">
                                        Need help with an order?
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-2">
                                        Our support is available 24/7 for our Pro members.
                                    </p>
                                </div>
                                <button className="w-full bg-white text-slate-900 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer">
                                    Contact Support
                                </button>
                            </div>
                        </section>
                    </div>

                    <footer className="border-t border-slate-200 py-8 mt-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="text-primary size-6">
                                    <svg
                                        fill="currentColor"
                                        viewBox="0 0 48 48"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                    NexusStore
                                </h2>
                            </div>
                            <div className="flex gap-8 text-sm text-slate-500">
                                <Link
                                    className="hover:text-primary transition-colors"
                                    href="#"
                                >
                                    Help Center
                                </Link>
                                <Link
                                    className="hover:text-primary transition-colors"
                                    href="#"
                                >
                                    Returns
                                </Link>
                                <Link
                                    className="hover:text-primary transition-colors"
                                    href="#"
                                >
                                    Shipping Policy
                                </Link>
                                <Link
                                    className="hover:text-primary transition-colors"
                                    href="#"
                                >
                                    Privacy
                                </Link>
                            </div>
                            <div className="text-xs text-slate-500">
                                © 2026 NexusStore Inc. All rights reserved.
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}
