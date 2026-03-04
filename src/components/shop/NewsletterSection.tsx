"use client";

import { ArrowRight } from "lucide-react";

export default function NewsletterSection() {
    return (
        <section className="bg-slate-900 text-white py-20 mt-20 relative overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop')", // Abstract/community vibe
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    mixBlendMode: 'overlay'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/50" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span className="inline-block mb-4 text-blue-400 font-bold tracking-widest uppercase text-xs">
                    Stay Connected
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Join the Lumina Community
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">
                    Sign up for our newsletter to receive exclusive offers, early access to new collections, and style tips.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 rounded-full bg-white/10 border border-white/20 px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/5 transition-all"
                    />
                    <button
                        className="bg-white text-black rounded-full px-8 py-4 font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                        Subscribe
                        <ArrowRight size={18} />
                    </button>
                </form>
            </div>
        </section>
    );
}
