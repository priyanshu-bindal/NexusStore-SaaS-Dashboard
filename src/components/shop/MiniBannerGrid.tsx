"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const miniBanners = [
    {
        id: 1,
        title: "Streetwear",
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop",
        href: "/shop?category=streetwear"
    },
    {
        id: 2,
        title: "Formal Edit",
        image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1000&auto=format&fit=crop",
        href: "/shop?category=formal"
    },
    {
        id: 3,
        title: "Active Life",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
        href: "/shop?category=activewear"
    },
    {
        id: 4,
        title: "Denim",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2070&auto=format&fit=crop",
        href: "/shop?category=denim"
    },
    {
        id: 5,
        title: "Accessories",
        image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=1000&auto=format&fit=crop",
        href: "/shop?category=accessories"
    },
    {
        id: 6,
        title: "Tech & Gadgets",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop",
        href: "/shop?category=tech"
    },
    {
        id: 7,
        title: "Home Decor",
        image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop",
        href: "/shop?category=home"
    },
    {
        id: 8,
        title: "Kids Collection",
        image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=1000&auto=format&fit=crop",
        href: "/shop?category=kids"
    }
];

export default function MiniBannerGrid() {
    return (
        <section className="w-full py-8 bg-white max-w-[1440px] mx-auto px-4 md:px-8">
            <h2 className="text-xl font-bold mb-6">Explore More</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {miniBanners.map((banner) => (
                    <Link
                        key={banner.id}
                        href={banner.href}
                        className="group relative h-48 md:h-64 rounded-xl overflow-hidden block"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('${banner.image}')` }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        <div className="absolute inset-x-0 bottom-0 p-4">
                            <h3 className="text-white font-bold text-lg mb-1">{banner.title}</h3>
                            <div className="flex items-center gap-2 text-white/80 text-xs font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                <span>Shop Now</span>
                                <ArrowRight size={12} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
