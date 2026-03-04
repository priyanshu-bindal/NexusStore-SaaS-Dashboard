"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, CreditCard, Truck, ShieldCheck } from "lucide-react";
import { GeneralSettingsForm } from "./GeneralSettingsForm";
import { PaymentsForm } from "./PaymentsForm";
import { ShippingForm } from "./ShippingForm";
import { SecurityForm } from "./SecurityForm";
import { cn } from "@/lib/utils";

type Tab = "general" | "payments" | "shipping" | "security";

const TABS: { value: Tab; label: string; icon: React.ElementType; description: string }[] = [
    { value: "general", label: "General", icon: Store, description: "Name, email & address" },
    { value: "payments", label: "Payments", icon: CreditCard, description: "Currency & methods" },
    { value: "shipping", label: "Shipping", icon: Truck, description: "Rates & processing" },
    { value: "security", label: "Security", icon: ShieldCheck, description: "Password & notifications" },
];

interface SettingsShellProps {
    store: {
        name: string;
        description: string | null;
        businessEmail: string | null;
        phone: string | null;
        notificationPrefs: any;
    };
}

export function SettingsShell({ store }: SettingsShellProps) {
    const [activeTab, setActiveTab] = useState<Tab>("general");

    const prefs = store.notificationPrefs || {};
    const paymentsPrefs = prefs.payments || {};
    const shippingPrefs = prefs.shipping || {};

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* ── Left Sidebar ─────────────────────────────────────── */}
            <nav className="w-full md:w-72 flex-shrink-0">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 space-y-1">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.value;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                                    isActive
                                        ? "bg-amber-600 text-white"
                                        : "hover:bg-slate-50 text-slate-700"
                                )}
                            >
                                <div className={cn(
                                    "size-9 rounded-lg flex items-center justify-center flex-shrink-0",
                                    isActive ? "bg-amber-500" : "bg-slate-100"
                                )}>
                                    <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
                                </div>
                                <div className="min-w-0">
                                    <p className={cn("text-sm font-semibold leading-snug", isActive ? "text-white" : "text-slate-800")}>
                                        {tab.label}
                                    </p>
                                    <p className={cn("text-xs truncate mt-0.5", isActive ? "text-blue-200" : "text-slate-400")}>
                                        {tab.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* ── Right Content Panel ──────────────────────────────── */}
            <div className="flex-1 min-w-0">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                        >
                            {activeTab === "general" && (
                                <GeneralSettingsForm
                                    defaultValues={{
                                        storeName: store.name,
                                        description: store.description || "",
                                        supportEmail: store.businessEmail || "",
                                        phone: store.phone || "",
                                        address: prefs.address || "",
                                    }}
                                />
                            )}
                            {activeTab === "payments" && (
                                <PaymentsForm
                                    defaultValues={{
                                        currency: paymentsPrefs.currency ?? "USD",
                                        acceptCreditCard: paymentsPrefs.acceptCreditCard ?? true,
                                        acceptPaypal: paymentsPrefs.acceptPaypal ?? false,
                                        acceptStripe: paymentsPrefs.acceptStripe ?? true,
                                    }}
                                />
                            )}
                            {activeTab === "shipping" && (
                                <ShippingForm
                                    defaultValues={{
                                        flatRate: shippingPrefs.flatRate ?? 5.99,
                                        processingTime: shippingPrefs.processingTime ?? "1_2_days",
                                    }}
                                />
                            )}
                            {activeTab === "security" && (
                                <SecurityForm
                                    defaultValues={{
                                        orderNotificationEmails: prefs.orderNotificationEmails ?? true,
                                    }}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
