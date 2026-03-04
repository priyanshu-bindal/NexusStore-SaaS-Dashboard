"use client";

import { useState } from "react";
import { StoreProfileForm } from "./StoreProfileForm";
import { BusinessInfoForm } from "./BusinessInfoForm";
import { NotificationSettings } from "./NotificationSettings";
import { DangerZone } from "./DangerZone";

type TabValue = "profile" | "business" | "notifications" | "danger";

interface SettingsTabsProps {
    store: any;
}

export function SettingsTabs({ store }: SettingsTabsProps) {
    const [activeTab, setActiveTab] = useState<TabValue>("profile");

    const tabs: { label: string; value: TabValue }[] = [
        { label: "Store Profile", value: "profile" },
        { label: "Business Info", value: "business" },
        { label: "Notifications", value: "notifications" },
        { label: "Danger Zone", value: "danger" },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <nav className="flex flex-row md:flex-col gap-2 w-full md:w-64 overflow-x-auto pb-4 md:pb-0 shrink-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`text-left px-4 py-2 rounded-md whitespace-nowrap transition-colors ${activeTab === tab.value
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
                {activeTab === "profile" && <StoreProfileForm store={store} />}
                {activeTab === "business" && <BusinessInfoForm store={store} />}
                {activeTab === "notifications" && <NotificationSettings store={store} />}
                {activeTab === "danger" && <DangerZone store={store} />}
            </div>
        </div>
    );
}
