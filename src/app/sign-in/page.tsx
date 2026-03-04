"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";

function SubmitButton({ isPending }: { isPending: boolean }) {
    return (
        <button
            className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg hover:bg-slate-800 transition-colors mt-1 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            disabled={isPending}
            type="submit"
        >
            {isPending ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                </>
            ) : "Sign In"}
        </button>
    );
}

export default function SignIn() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setErrorMessage(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setErrorMessage("Invalid credentials. Please try again.");
                setIsPending(false);
                return;
            }

            // Fetch session to determine role-based redirect
            const session = await getSession();

            if (session?.user?.role) {
                switch (session.user.role as string) {
                    case "MERCHANT":
                        router.push("/dashboard");
                        break;
                    case "CUSTOMER":
                        router.push("/shop");
                        break;
                    case "ADMIN":
                        router.push("/admin");
                        break;
                    default:
                        router.push("/shop");
                }
            } else {
                router.push("/shop");
            }

            // Note: intentionally not setting isPending(false) here so the button stays in "loading" state during redirect

        } catch (error) {
            setErrorMessage("An unexpected error occurred.");
            setIsPending(false);
        }
    };

    const handleOAuth = (provider: "github" | "google") => {
        signIn(provider, { callbackUrl: "/dashboard" });
    }

    return (
        <div className="bg-[#f8fafc] font-sans text-slate-900 min-h-screen flex items-center justify-center p-4">
            <div className="max-w-[480px] w-full bg-white p-8 rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200">
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="text-blue-600 size-6">
                            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">NexusStore</h2>
                    </Link>
                    <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
                    <p className="text-slate-500 text-sm">
                        Sign in to manage your merchant portal.
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="email">
                            Email address
                        </label>
                        <input
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none"
                            id="email"
                            name="email"
                            placeholder="name@company.com"
                            type="email"
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-xs font-semibold text-slate-700" htmlFor="password">
                                Password
                            </label>
                            <Link className="text-xs font-medium text-blue-600 hover:underline" href="#">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            type="password"
                            required
                            minLength={6}
                        />
                    </div>

                    {errorMessage && (
                        <div className="bg-red-50 text-red-600 text-xs font-medium p-3 rounded-lg border border-red-100">
                            {errorMessage}
                        </div>
                    )}

                    <SubmitButton isPending={isPending} />
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-white px-2 text-slate-400 font-medium tracking-wider">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleOAuth("github")}
                        type="button"
                        className="flex items-center justify-center gap-2 border border-slate-200 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700 cursor-pointer text-xs"
                    >
                        <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                        </svg>
                        GitHub
                    </button>
                    <button
                        onClick={() => handleOAuth("google")}
                        type="button"
                        className="flex items-center justify-center gap-2 border border-slate-200 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700 cursor-pointer text-xs"
                    >
                        <svg className="size-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                        </svg>
                        Google
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-3">
                    <p className="text-center text-xs text-slate-500">
                        New merchant?{" "}
                        <Link className="font-bold text-blue-600 hover:underline" href="/become-a-seller">
                            Apply for a store →
                        </Link>
                    </p>
                    <p className="text-center text-xs text-slate-400">
                        Shopping as a customer?{" "}
                        <Link className="hover:text-slate-700 underline transition-colors" href="/shop">
                            Browse the store
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

