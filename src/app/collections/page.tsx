"use client";

import CollectionHero from "@/components/collections/CollectionHero";
import CollectionFilterBar from "@/components/collections/CollectionFilterBar";
import CollectionGrid from "@/components/collections/CollectionGrid";
import { ShopHeader } from "@/components/layout/ShopHeader";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

function CollectionsContent() {
    return (
        <div className="bg-white text-slate-900 font-sans antialiased min-h-screen">
            <ShopHeader />

            <CollectionHero />
            <CollectionFilterBar />
            <CollectionGrid />

            {/* Footer */}
            <footer className="bg-slate-900 text-white pt-20 pb-10">
                <div className="max-w-[1600px] mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">S</span>
                                </div>
                                <span className="text-xl font-bold tracking-tight">Shopystore</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed">Refining the essential wardrobe with modern cuts and sustainable materials.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Shop</h4>
                            <ul className="space-y-4 text-slate-400 text-sm">
                                <li><a href="#" className="hover:text-white transition">New Arrivals</a></li>
                                <li><a href="#" className="hover:text-white transition">Best Sellers</a></li>
                                <li><a href="#" className="hover:text-white transition">Accessories</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Support</h4>
                            <ul className="space-y-4 text-slate-400 text-sm">
                                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                                <li><a href="#" className="hover:text-white transition">Shipping & Returns</a></li>
                                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Stay Connected</h4>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-600 transition">IG</a>
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-600 transition">TW</a>
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-600 transition">YT</a>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                        <p>&copy; 2024 Shopystore. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function CollectionsPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <CollectionsContent />
        </Suspense>
    );
}
