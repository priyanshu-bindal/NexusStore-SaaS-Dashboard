"use client";

import Link from "next/link";
import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerMerchant } from "@/actions/register-merchant";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg hover:bg-slate-800 transition-colors mt-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
            {pending ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Application...
                </>
            ) : "Apply for Merchant Account"}
        </button>
    );
}

export default function BecomeASellerPage() {
    const [state, formAction] = useActionState(registerMerchant, undefined);
    const [clientError, setClientError] = useState<string | null>(null);

    // If success is returned from the action, show success state without redirecting
    if (state?.success) {
        return (
            <div className="bg-[#f8fafc] font-sans text-slate-900 min-h-screen flex items-center justify-center p-4">
                <div className="max-w-[480px] w-full bg-white p-8 rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 text-center">
                    <div className="mb-6 mx-auto flex items-center justify-center size-12 rounded-full bg-green-100 text-green-600">
                        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
                    <p className="text-slate-500 mb-6">
                        We'll review your details and email you within 24 hours regarding your approval status.
                    </p>
                    <Link
                        href="/sign-in"
                        className="inline-block px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm"
                    >
                        Sign in to account →
                    </Link>
                </div>
            </div>
        );
    }

    // Wrap the standard action call to do some basic client-side confirm-password validation first
    const handleSubmit = (formData: FormData) => {
        setClientError(null);
        if (formData.get("password") !== formData.get("confirmPassword")) {
            setClientError("Passwords do not match.");
            return;
        }
        // In React 19 / Next 15, formAction from useActionState receives the FormData
        // We cast as any to bypass the weird Next.js type definition mismatch for useActionState payload
        (formAction as any)(formData);
    };

    return (
        <div className="bg-[#f8fafc] font-sans text-slate-900 min-h-screen flex items-center justify-center p-4 ">
            <div className="max-w-[480px] w-full bg-white p-8 rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200">
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center justify-center mb-6">
                        <img
                            src="/logo-horizontal.png"
                            alt="Shopystore Logo"
                            className="h-12 w-auto object-contain"
                        />
                    </Link>
                    <h1 className="text-2xl font-bold mb-1">Become a Seller</h1>
                    <p className="text-slate-500 text-sm">
                        Apply for a merchant account to start selling.
                    </p>
                </div>

                <form className="space-y-4" action={handleSubmit}>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="name">
                            Full Name / Business Name *
                        </label>
                        <input
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all outline-none"
                            id="name"
                            name="name"
                            placeholder="Enter you name"
                            type="text"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="email">
                            Business Email *
                        </label>
                        <input
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all outline-none"
                            id="email"
                            name="email"
                            placeholder="hello@example.com"
                            type="email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="password">
                            Password *
                        </label>
                        <input
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all outline-none"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            type="password"
                            required
                            minLength={8}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="confirmPassword">
                            Confirm Password *
                        </label>
                        <input
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all outline-none"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="••••••••"
                            type="password"
                            required
                            minLength={8}
                        />
                        {clientError && (
                            <p className="text-red-500 text-xs font-medium mt-1 uppercase tracking-wide">{clientError}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="description">
                            Tell us about your store (Optional)
                        </label>
                        <textarea
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all outline-none resize-y min-h-[80px]"
                            id="description"
                            name="description"
                            placeholder="What do you sell?"
                        />
                    </div>

                    {(state?.error) && (
                        <div className="bg-red-50 text-red-600 text-xs font-medium p-3 rounded-lg border border-red-100">
                            {state.error}
                        </div>
                    )}

                    <SubmitButton />
                </form>

                <p className="mt-6 text-center text-xs text-slate-500">
                    Already have an account?{" "}
                    <Link className="font-bold text-amber-600 hover:underline" href="/sign-in">
                        Sign in →
                    </Link>
                </p>
            </div>
        </div>
    );
}
