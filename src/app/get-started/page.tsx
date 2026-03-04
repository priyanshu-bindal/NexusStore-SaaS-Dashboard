"use client"
import Link from "next/link";
import { CreditCard, LayoutTemplate, Zap } from "lucide-react";

export default function GetStarted() {
    return (
        <div className="h-screen flex flex-col lg:flex-row bg-white font-sans text-[#111318] overflow-hidden">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-4 lg:px-16 xl:px-24 bg-white h-full overflow-y-auto">
                <div className="max-w-lg w-full mx-auto">
                    <Link href="/" className="flex items-center gap-2 mb-6 w-fit">
                        <div className="text-primary size-6">
                            <svg
                                fill="currentColor"
                                viewBox="0 0 48 48"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold tracking-tight">NexusStore</h2>
                    </Link>

                    <div className="mb-6">
                        <h1 className="text-2xl font-black tracking-tight mb-1">
                            Create your account
                        </h1>
                        <p className="text-sm text-[#616f89]">
                            Join the next generation of headless commerce.
                        </p>
                    </div>

                    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label
                                className="block text-xs font-semibold mb-1.5"
                                htmlFor="full-name"
                            >
                                Full Name
                            </label>
                            <input
                                className="w-full px-3 py-2 text-sm rounded-lg border border-[#dbdfe6] bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                id="full-name"
                                placeholder="John Doe"
                                type="text"
                            />
                        </div>
                        <div>
                            <label
                                className="block text-xs font-semibold mb-1.5"
                                htmlFor="email"
                            >
                                Work Email
                            </label>
                            <input
                                className="w-full px-3 py-2 text-sm rounded-lg border border-[#dbdfe6] bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                id="email"
                                placeholder="john@company.com"
                                type="email"
                            />
                        </div>
                        <div>
                            <label
                                className="block text-xs font-semibold mb-1.5"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                className="w-full px-3 py-2 text-sm rounded-lg border border-[#dbdfe6] bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                id="password"
                                placeholder="••••••••"
                                type="password"
                            />
                        </div>
                        <button className="w-full bg-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mt-1 cursor-pointer text-sm">
                            Create Account
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#dbdfe6]"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase">
                            <span className="bg-white px-2 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-[#dbdfe6] rounded-lg hover:bg-gray-50 transition-colors font-medium text-xs cursor-pointer">
                            <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                            </svg>
                            GitHub
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-[#dbdfe6] rounded-lg hover:bg-gray-50 transition-colors font-medium text-xs cursor-pointer">
                            <svg className="size-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                ></path>
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                ></path>
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                ></path>
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                ></path>
                            </svg>
                            Google
                        </button>
                    </div>
                    <p className="mt-6 text-center text-xs text-[#616f89]">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-primary font-bold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Feature Highlights */}
            <div className="hidden lg:flex w-full lg:w-[40%] xl:w-[45%] bg-background-light border-l border-[#dbdfe6] flex-col justify-between p-8 xl:p-12 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full -ml-24 -mb-24"></div>

                <div className="relative z-10">
                    <h2 className="text-2xl font-black mb-8 tracking-tight">
                        Scale your vision with the right tools.
                    </h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 size-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                                <Zap className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-1">Start for free</h3>
                                <p className="text-sm text-[#616f89] leading-relaxed">
                                    Everything you need to launch your first storefront without any
                                    upfront costs.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 size-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                                <CreditCard className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-1">
                                    No credit card required
                                </h3>
                                <p className="text-sm text-[#616f89] leading-relaxed">
                                    Sign up in seconds and start building immediately. We grow
                                    when you grow.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 size-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                                <LayoutTemplate className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-1">Developer-first API</h3>
                                <p className="text-sm text-[#616f89] leading-relaxed">
                                    GraphQL and REST APIs designed by developers, for developers.
                                    99.9% uptime guaranteed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pt-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#616f89] mb-4">
                        Built for your stack
                    </p>
                    <div className="flex items-center gap-6 grayscale opacity-60 transition-all hover:grayscale-0 hover:opacity-100">
                        <div className="flex items-center gap-2">
                            <svg
                                className="size-5 text-[#61DAFB]"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 11.475c.427 0 .775.348.775.775s-.348.775-.775.775-.775-.348-.775-.775.348-.775.775-.775zM24 12c0-2.388-2.115-4.48-5.35-5.69-1.008-.376-2.112-.64-3.265-.777 1.15-.365 1.956-.84 2.278-1.385.45-.758.15-1.634-.84-2.203-1.04-.598-2.618-.62-4.32-.065-1.082.353-2.176.924-3.13 1.636-.954-.712-2.048-1.283-3.13-1.636-1.702-.555-3.28-.533-4.32.065-1 .57-.3 1.445.15 2.203.322.545 1.128 1.02 2.278 1.385-1.153.137-2.257.401-3.265.777C2.115 7.52 0 9.612 0 12c0 2.388 2.115 4.48 5.35 5.69 1.008.376 2.112.64 3.265.777-1.15.365-1.956.84-2.278 1.385-.45.758-.15 1.634.84 2.203 1.04.598 2.618.62 4.32.065 1.082-.353 2.176-.924 3.13-1.636.954.712 2.048 1.283 3.13 1.636 1.702.555 3.28.533 4.32-.065 1-.57.3-1.445-.15-2.203-.322-.545-1.128-1.02-2.278-1.385 1.153-.137 2.257-.401 3.265-.777C21.885 16.48 24 14.388 24 12z"></path>
                            </svg>
                            <span className="font-bold text-xs">React</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0l12 24h-24l12-24z"></path>
                            </svg>
                            <span className="font-bold text-xs">Next.js</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-xl">
                                <CreditCard className="size-5" />
                            </span>
                            <span className="font-bold text-xs">Stripe</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
