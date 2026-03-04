"use client";

import { useActionState, useEffect } from "react";
import { updateBusinessInfo } from "@/actions/store/settings-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface BusinessInfoFormProps {
    store: {
        businessEmail: string | null;
        phone: string | null;
        website: string | null;
        user: { email: string | null; };
    };
}

export function BusinessInfoForm({ store }: BusinessInfoFormProps) {
    const [state, formAction, isPending] = useActionState(updateBusinessInfo, null);

    useEffect(() => {
        if (state?.success) {
            toast.success("Business info updated successfully!");
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    // Use the explicitly provided business email, or fallback to the registration email
    const defaultEmail = store.businessEmail || store.user?.email || "";

    return (
        <form action={formAction} className="space-y-6 max-w-2xl">
            <div>
                <h3 className="text-lg font-medium">Business Information</h3>
                <p className="text-sm text-gray-500">Contact details visible to your customers.</p>
            </div>

            <div className="grid gap-4">
                <div className="space-y-2">
                    <label htmlFor="businessEmail" className="text-sm font-medium">Business Email</label>
                    <input
                        id="businessEmail"
                        name="businessEmail"
                        type="email"
                        defaultValue={defaultEmail}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={store.phone || ""}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="website" className="text-sm font-medium">Website URL</label>
                    <input
                        id="website"
                        name="website"
                        type="url"
                        defaultValue={store.website || ""}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {isPending ? "Saving..." : "Save Info"}
                </button>
            </div>
        </form>
    );
}
