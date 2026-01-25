import Link from "next/link";

export function CTA() {
    return (
        <section className="max-w-[1280px] mx-auto px-6 py-24">
            <div className="rounded-3xl bg-white border border-[#dbdfe6] p-12 md:p-20 text-center flex flex-col items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight max-w-2xl">
                    Ready to launch your storefront?
                </h2>
                <p className="text-lg text-[#616f89] max-w-xl">
                    Join 2,000+ developers building the future of commerce on NexusStore.
                    Free to start, scales with your growth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/get-started"
                        className="flex h-14 px-10 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer"
                    >
                        Get Started for Free
                    </Link>
                    <button className="flex h-14 px-10 items-center justify-center rounded-lg border border-[#dbdfe6] bg-transparent font-bold text-lg hover:bg-gray-50 transition-all cursor-pointer">
                        Talk to Sales
                    </button>
                </div>
                <p className="text-sm text-gray-400">
                    No credit card required. Cancel anytime.
                </p>
            </div>
        </section>
    );
}
