"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Home, Mail, Phone, MapPin, FileText } from "lucide-react";
import { generalSettingsSchema, type GeneralSettingsValues } from "@/lib/validations/settings";
import { saveGeneralSettings } from "@/actions/store/new-settings-actions";
import { SuccessModal } from "./SuccessModal";

interface GeneralSettingsFormProps {
    defaultValues: Partial<GeneralSettingsValues>;
}

export function GeneralSettingsForm({ defaultValues }: GeneralSettingsFormProps) {
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        register, handleSubmit, watch,
        formState: { errors, isSubmitting },
    } = useForm<GeneralSettingsValues>({
        resolver: zodResolver(generalSettingsSchema),
        defaultValues: {
            storeName: defaultValues.storeName || "",
            description: defaultValues.description || "",
            supportEmail: defaultValues.supportEmail || "",
            phone: defaultValues.phone || "",
            address: defaultValues.address || "",
        },
    });

    const description = watch("description") || "";

    const onSubmit = async (data: GeneralSettingsValues) => {
        const result = await saveGeneralSettings(data);
        if (result.success) {
            setShowSuccess(true);
        } else {
            toast.error(result.error || "Error saving settings.");
        }
    };

    return (
        <>
            <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-xl font-semibold text-slate-900 mb-1">General Store Settings</h2>
                <p className="text-sm text-slate-500 mb-8">Update your public store information and contact details.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="storeName" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                            <Home className="w-4 h-4 text-slate-400" />Store Name
                        </label>
                        <input id="storeName" {...register("storeName")} placeholder="e.g. John's Tech Store"
                            className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow"
                        />
                        {errors.storeName && <p className="mt-1 text-xs text-red-500">{errors.storeName.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="supportEmail" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                            <Mail className="w-4 h-4 text-slate-400" />Support Email
                        </label>
                        <input id="supportEmail" type="email" {...register("supportEmail")} placeholder="support@yourstore.com"
                            className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow"
                        />
                        {errors.supportEmail && <p className="mt-1 text-xs text-red-500">{errors.supportEmail.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                            <Phone className="w-4 h-4 text-slate-400" />Phone Number
                        </label>
                        <input id="phone" type="tel" {...register("phone")} placeholder="+1 (555) 000-0000"
                            className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow"
                        />
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                            <MapPin className="w-4 h-4 text-slate-400" />Store Address
                        </label>
                        <input id="address" {...register("address")} placeholder="123 Main St, City, State 00000"
                            className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow"
                        />
                        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
                    </div>
                </div>

                <div className="mb-8">
                    <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <FileText className="w-4 h-4 text-slate-400" />Store Description
                    </label>
                    <textarea id="description" {...register("description")} rows={3} maxLength={500}
                        placeholder="Briefly describe what your store sells..."
                        className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow resize-none"
                    />
                    <div className="flex items-center justify-between mt-1">
                        {errors.description ? <p className="text-xs text-red-500">{errors.description.message}</p> : <span />}
                        <p className="text-xs text-slate-400">{description.length}/500</p>
                    </div>
                </div>

                <button type="submit" disabled={isSubmitting}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                    {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                    {isSubmitting ? "Saving…" : "Save Changes"}
                </button>
            </form>
        </>
    );
}
