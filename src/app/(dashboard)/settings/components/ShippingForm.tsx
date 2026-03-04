"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Package, Clock } from "lucide-react";
import { shippingSchema, type ShippingValues } from "@/lib/validations/settings";
import { saveShippingSettings } from "@/actions/store/new-settings-actions";
import { SuccessModal } from "./SuccessModal";

const PROCESSING_TIMES = [
    { value: "same_day", label: "Same Day" },
    { value: "1_2_days", label: "1–2 Business Days" },
    { value: "3_5_days", label: "3–5 Business Days" },
    { value: "1_2_weeks", label: "1–2 Weeks" },
];

interface ShippingFormProps { defaultValues: Partial<ShippingValues>; }

export function ShippingForm({ defaultValues }: ShippingFormProps) {
    const [showSuccess, setShowSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ShippingValues>({
        resolver: zodResolver(shippingSchema),
        defaultValues: {
            flatRate: defaultValues.flatRate ?? 5.99,
            processingTime: defaultValues.processingTime ?? "1_2_days",
        },
    });

    const onSubmit = async (data: ShippingValues) => {
        const result = await saveShippingSettings(data);
        if (result.success) setShowSuccess(true);
        else toast.error(result.error || "Error saving settings.");
    };

    return (
        <>
            <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-xl font-semibold text-slate-900 mb-1">Shipping</h2>
                <p className="text-sm text-slate-500 mb-8">Default shipping rate and order processing timeline.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label htmlFor="flatRate" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                            <Package className="w-4 h-4 text-slate-400" />Flat Shipping Rate
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 select-none">$</span>
                            <input id="flatRate" type="number" step="0.01" min="0"
                                {...register("flatRate", { valueAsNumber: true })} placeholder="5.99"
                                className="w-full pl-7 pr-3 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                            />
                        </div>
                        {errors.flatRate && <p className="mt-1 text-xs text-red-500">{errors.flatRate.message}</p>}
                        <p className="mt-1 text-xs text-slate-500">Set to 0 for free shipping.</p>
                    </div>

                    <div>
                        <label htmlFor="processingTime" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                            <Clock className="w-4 h-4 text-slate-400" />Order Processing Time
                        </label>
                        <select id="processingTime" {...register("processingTime")}
                            className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow appearance-none cursor-pointer"
                        >
                            {PROCESSING_TIMES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                        {errors.processingTime && <p className="mt-1 text-xs text-red-500">{errors.processingTime.message}</p>}
                        <p className="mt-1 text-xs text-slate-500">Time to prepare an order for shipment.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg mb-8">
                    <div className="size-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-xs font-bold">i</span>
                    </div>
                    <p className="text-sm text-blue-700">These settings apply store-wide. You can override shipping on individual products.</p>
                </div>

                <button type="submit" disabled={isSubmitting}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                    {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                    {isSubmitting ? "Saving…" : "Save Changes"}
                </button>
            </form>
        </>
    );
}
