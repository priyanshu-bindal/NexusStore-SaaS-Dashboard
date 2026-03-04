"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, ArrowRight, Loader2 } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const [storeName, setStoreName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/store/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: storeName, description }),
            });

            if (response.ok) {
                // Store created successfully, redirect to dashboard
                router.push("/dashboard");
                router.refresh(); // Force re-check of layout logic
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error("Onboarding error:", error);
            alert("Failed to create store");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen items-center justify-center bg-slate-50 flex p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-[#2563eb] px-8 py-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="relative z-10">
                        <div className="mx-auto bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm shadow-inner">
                            <Store className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Setup Your Store</h1>
                        <p className="text-blue-100 font-medium">Let's get your digital storefront ready for business.</p>
                    </div>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Store Name</label>
                            <input
                                id="name"
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all placeholder:text-slate-400 font-medium"
                                placeholder="e.g. Acme Inc."
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-2">Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all placeholder:text-slate-400 font-medium resize-none"
                                rows={3}
                                placeholder="Tell us about your store..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <span className="text-lg">Create Store</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
