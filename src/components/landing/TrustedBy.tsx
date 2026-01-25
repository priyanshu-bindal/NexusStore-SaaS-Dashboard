
import {
    CreditCard,
    Cloud,
    Github,
    Triangle,
    Zap,
} from "lucide-react";

export function TrustedBy() {
    return (
        <section className="border-y border-[#dbdfe6] bg-white py-12">
            <div className="max-w-[1280px] mx-auto px-6">
                <h4 className="text-[#616f89] text-xs font-bold uppercase tracking-[0.2em] text-center mb-10">
                    Trusted by leading engineering teams
                </h4>
                <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
                    <div className="flex items-center gap-2">
                        <CreditCard className="size-8" />
                        <span className="text-xl font-bold">Stripe</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Cloud className="size-8" />
                        <span className="text-xl font-bold">AWS</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Github className="size-8" />
                        <span className="text-xl font-bold">GitHub</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Triangle className="size-8 fill-current" />
                        <span className="text-xl font-bold">Vercel</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="size-8 fill-current" />
                        <span className="text-xl font-bold">Netlify</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
