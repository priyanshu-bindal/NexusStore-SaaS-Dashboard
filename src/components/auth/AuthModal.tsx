"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { X, Mail, Lock, User } from "lucide-react";
import { useAuthModal } from "@/context/AuthModalContext";
import { registerUser } from "@/actions/register";

export default function AuthModal() {
    const router = useRouter();
    const { isOpen, closeModal, redirectPath } = useAuthModal();
    const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Sign In Form State
    const [signInData, setSignInData] = useState({
        email: "",
        password: "",
    });

    // Sign Up Form State
    const [signUpData, setSignUpData] = useState({
        name: "",
        email: "",
        password: "",
    });

    if (!isOpen) return null;

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email: signInData.email,
                password: signInData.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setIsLoading(false);
                return;
            }

            // Success - close modal and redirect
            closeModal();
            router.push(redirectPath);
            router.refresh();
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await registerUser(signUpData);

            if (!result.success) {
                setError(result.error || "Registration failed");
                setIsLoading(false);
                return;
            }

            // Auto sign in after registration
            const signInResult = await signIn("credentials", {
                email: signUpData.email,
                password: signUpData.password,
                redirect: false,
            });

            if (signInResult?.error) {
                // Registration succeeded but login failed - switch to sign in tab
                setActiveTab("signin");
                setSignInData({
                    email: signUpData.email,
                    password: "",
                });
                setError("Account created! Please sign in.");
                setIsLoading(false);
                return;
            }

            // Success - close modal and redirect
            closeModal();
            router.push(redirectPath);
            router.refresh();
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            {/* Backdrop with glassmorphism */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
                    aria-label="Close"
                >
                    <X size={20} className="text-slate-600" />
                </button>

                {/* Header */}
                <div className="pt-8 px-8 pb-6 border-b border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {activeTab === "signin" ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {activeTab === "signin"
                            ? "Sign in to continue to checkout"
                            : "Sign up to start shopping"}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => {
                            setActiveTab("signin");
                            setError("");
                        }}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === "signin"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("signup");
                            setError("");
                        }}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === "signup"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {activeTab === "signin" ? (
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={18}
                                    />
                                    <input
                                        type="email"
                                        required
                                        value={signInData.email}
                                        onChange={(e) =>
                                            setSignInData({ ...signInData, email: e.target.value })
                                        }
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={18}
                                    />
                                    <input
                                        type="password"
                                        required
                                        value={signInData.password}
                                        onChange={(e) =>
                                            setSignInData({ ...signInData, password: e.target.value })
                                        }
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors"
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Name
                                </label>
                                <div className="relative">
                                    <User
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        required
                                        value={signUpData.name}
                                        onChange={(e) =>
                                            setSignUpData({ ...signUpData, name: e.target.value })
                                        }
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={18}
                                    />
                                    <input
                                        type="email"
                                        required
                                        value={signUpData.email}
                                        onChange={(e) =>
                                            setSignUpData({ ...signUpData, email: e.target.value })
                                        }
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={18}
                                    />
                                    <input
                                        type="password"
                                        required
                                        minLength={8}
                                        value={signUpData.password}
                                        onChange={(e) =>
                                            setSignUpData({ ...signUpData, password: e.target.value })
                                        }
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-slate-500">
                                    Minimum 8 characters
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors"
                            >
                                {isLoading ? "Creating account..." : "Create Account"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
