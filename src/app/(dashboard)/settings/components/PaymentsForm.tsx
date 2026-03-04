"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Globe, CreditCard } from "lucide-react";
import { paymentsSchema, type PaymentsValues } from "@/lib/validations/settings";
import { savePaymentSettings } from "@/actions/store/new-settings-actions";
import { SuccessModal } from "./SuccessModal";

const CURRENCIES = [
    { value: "USD", label: "USD — US Dollar" },
    { value: "EUR", label: "EUR — Euro" },
    { value: "GBP", label: "GBP — British Pound" },
    { value: "INR", label: "INR — Indian Rupee" },
    { value: "JPY", label: "JPY — Japanese Yen" },
    { value: "AUD", label: "AUD — Australian Dollar" },
    { value: "CAD", label: "CAD — Canadian Dollar" },
];

const PAYMENT_METHODS = [
    { key: "acceptCreditCard" as const, label: "Credit / Debit Card", description: "Accept Visa, Mastercard, and Amex", icon: "💳" },
    { key: "acceptPaypal" as const, label: "PayPal", description: "Allow customers to pay via PayPal", icon: "🅿️" },
    { key: "acceptStripe" as const, label: "Stripe", description: "Cards, wallets & BNPL via Stripe", icon: "⚡" },
];

interface PaymentsFormProps { defaultValues: Partial<PaymentsValues>; }

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
    return (
        <button type="button" role="switch" aria-checked={checked} disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${checked ? "bg-blue-600" : "bg-slate-200"}`}
        >
            <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"}`} />
        </button>
    );
}

export function PaymentsForm({ defaultValues }: PaymentsFormProps) {
    const [showSuccess, setShowSuccess] = useState(false);

    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<PaymentsValues>({
        resolver: zodResolver(paymentsSchema),
        defaultValues: {
            currency: defaultValues.currency ?? "USD",
            acceptCreditCard: defaultValues.acceptCreditCard ?? true,
            acceptPaypal: defaultValues.acceptPaypal ?? false,
            acceptStripe: defaultValues.acceptStripe ?? true,
        },
    });

    const onSubmit = async (data: PaymentsValues) => {
        const result = await savePaymentSettings(data);
        if (result.success) setShowSuccess(true);
        else toast.error(result.error || "Error saving settings.");
    };

    return (
        <>
            <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-xl font-semibold text-slate-900 mb-1">Payments &amp; Currency</h2>
                <p className="text-sm text-slate-500 mb-8">Configure your store&apos;s currency and accepted payment methods.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label htmlFor="currency" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                            <Globe className="w-4 h-4 text-slate-400" />Default Currency
                        </label>
                        <select id="currency" {...register("currency")}
                            className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow appearance-none cursor-pointer"
                        >
                            {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                        {errors.currency && <p className="mt-1 text-xs text-red-500">{errors.currency.message}</p>}
                    </div>
                </div>

                <div className="mb-8">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                        <CreditCard className="w-4 h-4 text-slate-400" />Accepted Payment Methods
                    </label>
                    <div className="space-y-3">
                        {PAYMENT_METHODS.map((method) => (
                            <div key={method.key} className="flex items-center justify-between px-4 py-3 border border-slate-200 rounded-lg bg-white hover:border-slate-300 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{method.icon}</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{method.label}</p>
                                        <p className="text-xs text-slate-500">{method.description}</p>
                                    </div>
                                </div>
                                <Controller name={method.key} control={control}
                                    render={({ field }) => <Toggle checked={field.value} onChange={field.onChange} disabled={isSubmitting} />}
                                />
                            </div>
                        ))}
                    </div>
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
