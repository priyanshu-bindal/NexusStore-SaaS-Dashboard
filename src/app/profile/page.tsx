"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Bell,
    Camera,
    CreditCard,
    Heart,
    LayoutDashboard,
    Lock,
    LogOut,
    MapPin,
    Menu,
    Moon,
    Package2,
    Search,
    Settings,
    ShieldCheck,
    ShoppingCart,
    Sun,
    User,
} from "lucide-react";
import clsx from "clsx";

export default function Profile() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="bg-[#f8fafc] font-sans text-slate-900 h-screen overflow-hidden flex flex-col">
            {/* Header */}
            <header className="flex-none z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
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
                                placeholder="Search products, brands, settings..."
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
                        "border-r border-slate-200 bg-white flex flex-col py-8 h-full transition-all duration-300 ease-in-out z-40",
                        isSidebarOpen
                            ? "w-64 translate-x-0"
                            : "w-0 -translate-x-full lg:w-0 lg:translate-x-0 overflow-hidden opacity-0 lg:opacity-100 lg:hidden"
                    )}
                >
                    <nav className="flex-1 space-y-1 overflow-y-auto">
                        <Link
                            href="/myaccount"
                            className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 border-r-4 border-transparent transition-all"
                        >
                            <LayoutDashboard className="size-5" />
                            <span className="truncate">Dashboard</span>
                        </Link>
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-primary bg-primary/10 border-r-4 border-primary transition-all"
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
                        <Link
                            href="#"
                            className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 border-r-4 border-transparent transition-all"
                        >
                            <Settings className="size-5" />
                            <span className="truncate">Account Settings</span>
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
                <main className="flex-1 px-4 sm:px-8 py-8 h-full overflow-y-auto">
                    <div className="max-w-4xl mx-auto pb-10">
                        <div className="mb-10 flex flex-col items-center sm:flex-row sm:items-end gap-6 pb-10 border-b border-slate-200">
                            <div className="relative group">
                                <div className="size-32 rounded-2xl overflow-hidden bg-slate-200 border-4 border-white shadow-lg">
                                    <img
                                        alt="Large Profile Avatar"
                                        className="w-full h-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXV56NHlCd8-HzPDKOdVQCKRqAy0bLRZo4kc-l71bP35sfpja77GAHBsshitPa9Qg4UFlOfkSYPfPIwcoolnFxNl-bh0ENkeZP9YSbpba5YgDiRXoQvQf1yH2unt8edcLot4nm7eGofXdaeeOhxWSuyzUnuHF7pR0Og1Vo4wmPnAf6blwlkXHc8yPYfYbHO9pKnrptuhj9I9Gh9IhAkBLkQU5xjM0aJi73ShmFJQrPHDXFsxju5Zi4-tGAX5KjAnnx_lAnmbJ2JVWU"
                                    />
                                </div>
                                <button className="absolute -bottom-2 -right-2 size-10 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all cursor-pointer">
                                    <Camera className="size-5" />
                                </button>
                            </div>
                            <div className="text-center sm:text-left flex-1">
                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                    <h1 className="text-3xl font-black tracking-tight text-slate-900">
                                        Alex Johnson
                                    </h1>
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                        Pro Member
                                    </span>
                                </div>
                                <p className="text-slate-500">
                                    alex.johnson@example.com • Member since Jan 2023
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all text-slate-900">
                                    View Public Profile
                                </button>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">
                                            Personal Information
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Update your personal details and contact information.
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Full Name
                                        </label>
                                        <input
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            type="text"
                                            defaultValue="Alex Johnson"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Email Address
                                        </label>
                                        <input
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            type="email"
                                            defaultValue="alex.johnson@example.com"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Phone Number
                                        </label>
                                        <input
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            type="tel"
                                            defaultValue="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Location
                                        </label>
                                        <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                            <option>United States</option>
                                            <option>Canada</option>
                                            <option>United Kingdom</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 pt-4 flex justify-end">
                                        <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">
                                            Security
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Manage your password and account security settings.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-200">
                                    <div className="p-8 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                                <Lock className="size-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-900">
                                                    Password
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Last changed 3 months ago
                                                </p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all text-slate-900">
                                            Reset Password
                                        </button>
                                    </div>
                                    <div className="p-8 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                                                <ShieldCheck className="size-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-900">
                                                    Two-Factor Authentication
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Add an extra layer of security to your account.
                                                </p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                defaultChecked
                                                className="sr-only peer"
                                                type="checkbox"
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">
                                            Preferences
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Customize your shopping and browsing experience.
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                        <h4 className="font-bold text-sm mb-4 text-slate-900">
                                            Email Notifications
                                        </h4>
                                        <div className="space-y-4">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    defaultChecked
                                                    className="w-5 h-5 rounded border-slate-200 text-primary focus:ring-primary/20 accent-primary"
                                                    type="checkbox"
                                                />
                                                <span className="text-sm text-slate-500 group-hover:text-slate-900 transition-colors">
                                                    Order updates and shipping
                                                </span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    defaultChecked
                                                    className="w-5 h-5 rounded border-slate-200 text-primary focus:ring-primary/20 accent-primary"
                                                    type="checkbox"
                                                />
                                                <span className="text-sm text-slate-500 group-hover:text-slate-900 transition-colors">
                                                    Newsletter and promotions
                                                </span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    className="w-5 h-5 rounded border-slate-200 text-primary focus:ring-primary/20 accent-primary"
                                                    type="checkbox"
                                                />
                                                <span className="text-sm text-slate-500 group-hover:text-slate-900 transition-colors">
                                                    New arrivals alerts
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                        <h4 className="font-bold text-sm mb-4 text-slate-900">
                                            Appearance
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Theme Selection
                                                </label>
                                                <div className="grid grid-cols-2 gap-3 mt-2">
                                                    <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-primary bg-primary/5 text-primary text-sm font-bold cursor-pointer">
                                                        <Sun className="size-4" />
                                                        Light
                                                    </button>
                                                    <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-500 text-sm font-bold hover:bg-slate-50 transition-all cursor-pointer">
                                                        <Moon className="size-4" />
                                                        Dark
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="pt-8 border-t border-slate-200">
                                <div className="bg-red-50 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <h4 className="font-bold text-red-700">
                                            Deactivate Account
                                        </h4>
                                        <p className="text-sm text-red-600/80">
                                            This action will disable your account and remove your
                                            access.
                                        </p>
                                    </div>
                                    <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-all cursor-pointer">
                                        Deactivate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer Reuse or Shared Component (simplified here to match visual) */}
          
        </div>
    );
}
