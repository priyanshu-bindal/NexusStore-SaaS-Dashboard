"use client";

import { useTransition } from "react";
import { updateNotificationPrefs } from "@/actions/store/settings-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface NotificationSettingsProps {
    store: {
        id: string;
        notificationPrefs: any;
    };
}

export function NotificationSettings({ store }: NotificationSettingsProps) {
    const [isPending, startTransition] = useTransition();

    // Using a robust fallback in case JSON is null or empty object
    const prefs = store.notificationPrefs || {};

    const handleToggle = (key: string, currentValue: boolean) => {
        startTransition(async () => {
            const newPrefs = { ...prefs, [key]: !currentValue };
            const result = await updateNotificationPrefs(store.id, newPrefs);

            if (result.success) {
                toast.success("Notification preferences updated.");
            } else {
                toast.error(result.error || "Failed to update preferences.");
            }
        });
    };

    const getPrefValue = (key: string) => {
        // default to true if the key doesn't exist yet
        return prefs[key] !== undefined ? prefs[key] : true;
    };

    const options = [
        {
            id: "newOrder",
            title: "New Orders",
            description: "Email me when I receive a new order",
        },
        {
            id: "lowStock",
            title: "Low Stock Alerts",
            description: "Email me when a product is low on stock (below 5 units)",
        },
        {
            id: "payoutProcessed",
            title: "Payout Processed",
            description: "Email me when a payout is processed",
        },
    ];

    return (
        <div className="space-y-6 max-w-2xl relative">
            {isPending && (
                <div className="absolute top-0 right-0 p-2">
                    <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
                </div>
            )}

            <div>
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <p className="text-sm text-gray-500">Decide what events you want to be notified about.</p>
            </div>

            <div className="space-y-4">
                {options.map((option) => (
                    <div key={option.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium">{option.title}</label>
                            <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={getPrefValue(option.id)}
                            disabled={isPending}
                            onClick={() => handleToggle(option.id, getPrefValue(option.id))}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 ${getPrefValue(option.id) ? "bg-amber-600" : "bg-gray-200"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <span
                                aria-hidden="true"
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${getPrefValue(option.id) ? "translate-x-5" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
