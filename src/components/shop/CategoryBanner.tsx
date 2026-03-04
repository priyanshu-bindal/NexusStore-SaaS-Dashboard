"use client";

import Link from "next/link";
import { Smartphone, Laptop, Watch, Camera, Book } from "lucide-react";

const categories = [
    { id: "phones", label: "Phones", icon: Smartphone },
    { id: "laptops", label: "Laptops", icon: Laptop },
    { id: "watches", label: "Watches", icon: Watch },
    { id: "cameras", label: "Cameras", icon: Camera },
    { id: "books", label: "Books", icon: Book },
];

export default function CategoryBanner() {
    return (
        <section className="w-full py-12 bg-white">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/shop?category=${cat.id}`}
                            className="group flex flex-col items-center gap-4 transition-all"
                        >
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 border border-slate-100 group-hover:border-blue-100">
                                <cat.icon className="w-8 h-8 md:w-10 md:h-10 text-slate-700 group-hover:text-blue-600 transition-colors" strokeWidth={1.5} />
                            </div>
                            <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                                {cat.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
