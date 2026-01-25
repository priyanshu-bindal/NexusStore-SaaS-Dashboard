
import {
    Globe,
    Database,
    TrendingUp,
    Rocket,
    ArrowRight,
    Terminal,
    GitCommitHorizontal,
    CheckCheck,
} from "lucide-react";

export function Features() {
    return (
        <section className="max-w-[1280px] mx-auto px-6 py-24">
            <div className="flex flex-col items-center text-center gap-4 mb-16">
                <h2 className="text-4xl font-black tracking-tight">
                    Everything You Need, Built-in.
                </h2>
                <p className="text-[#616f89] max-w-2xl">
                    Skip the boilerplate and focus on the customer experience with our
                    high-performance infrastructure.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
                {/* Global CDN */}
                <div className="md:col-span-2 rounded-2xl bg-white border border-[#dbdfe6] p-8 flex flex-col justify-between group hover:border-primary transition-colors">
                    <div>
                        <Globe className="text-primary size-8 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Global CDN</h3>
                        <p className="text-[#616f89] max-w-md">
                            Edge-cached API responses for sub-100ms latency globally. Your
                            products load faster than a blink.
                        </p>
                    </div>
                    <div className="flex gap-2 items-center text-primary text-sm font-bold cursor-pointer group-hover:gap-3 transition-all">
                        Learn about Edge <ArrowRight className="size-4" />
                    </div>
                </div>

                {/* Headless CMS */}
                <div className="rounded-2xl bg-white border border-[#dbdfe6] p-8 flex flex-col group hover:border-primary transition-colors">
                    <Database className="text-primary size-8 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Headless CMS</h3>
                    <p className="text-[#616f89]">
                        Manage products, inventory, and content via our intuitive dashboard
                        or programmatic API.
                    </p>
                </div>

                {/* Real-time Analytics */}
                <div className="rounded-2xl bg-primary text-white p-8 flex flex-col justify-between overflow-hidden relative">
                    <div className="relative z-10">
                        <TrendingUp className="size-8 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Real-time Analytics</h3>
                        <p className="text-white/80">
                            Track conversion, AOV, and performance metrics in real-time as
                            they happen.
                        </p>
                    </div>
                    <div className="absolute -bottom-4 -right-4 opacity-20 transform rotate-12">
                        <TrendingUp className="size-[120px]" />
                    </div>
                </div>

                {/* One-click Deploy */}
                <div className="md:col-span-2 rounded-2xl bg-white border border-[#dbdfe6] p-8 flex flex-col justify-center overflow-hidden group hover:border-primary transition-colors">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <Rocket className="text-primary size-8 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">One-click Deploy</h3>
                            <p className="text-[#616f89]">
                                Push to GitHub and let us handle the rest. Seamless integration
                                with Vercel, Netlify, and AWS natively.
                            </p>
                        </div>
                        <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-dashed border-[#dbdfe6]">
                            <div className="size-10 rounded bg-white flex items-center justify-center shadow-sm">
                                <Terminal className="text-gray-400 size-6" />
                            </div>
                            <div className="size-10 rounded bg-white flex items-center justify-center shadow-sm">
                                <GitCommitHorizontal className="text-gray-400 size-6" />
                            </div>
                            <div className="size-10 rounded bg-primary flex items-center justify-center shadow-lg">
                                <CheckCheck className="text-white size-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
