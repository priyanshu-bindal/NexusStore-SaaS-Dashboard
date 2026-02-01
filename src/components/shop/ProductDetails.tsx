"use client";

import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Star, Plus, Minus, ArrowRight, ShoppingBag, Menu, User } from "lucide-react";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { useCart } from "@/context/CartContext";
import { SearchInput } from "./SearchInput";

// -- Interfaces matching Prisma & Serialized Data --
// We assume 'product' passed here matches what we send from valid server-side fetch
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    sizes?: string[];
    category: string;
    createdAt: string;
    updatedAt: string;
    storeId: string;
    stock: number;
    colors?: string[]; // Optional if not in schema yet
    store?: {
        name: string;
    };
    isBestSeller?: boolean;
}

import { StarRating } from "@/components/reviews/StarRating";

interface ProductDetailsProps {
    product: Product;
    relatedProducts: Product[];
    avgRating: number;
    totalReviews: number;
}

const AccordionItem = ({ title, children, isOpen, onClick }: { title: string, children: React.ReactNode, isOpen: boolean, onClick: () => void }) => (
    <div className="border-b border-gray-200">
        <button
            className="w-full py-4 flex items-center justify-between text-left font-bold text-xs uppercase tracking-widest hover:text-blue-600 transition-colors"
            onClick={onClick}
        >
            {title}
            {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
        >
            <div className="text-sm text-gray-600 leading-relaxed font-sans">
                {children}
            </div>
        </div>
    </div>
);

export default function ProductDetails({ product, relatedProducts, avgRating, totalReviews }: ProductDetailsProps) {
    // State
    const [mainImage, setMainImage] = useState(product.images?.[0] || "");
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [showSizeError, setShowSizeError] = useState(false); // New state for error
    const [activeAccordion, setActiveAccordion] = useState<string | null>('description');

    // Context
    const { isOpen, setIsOpen, count } = useCart();

    // Derived State
    const allImages = product.images || [];
    const hasSizes = product.sizes && product.sizes.length > 0;
    const sizes = product.sizes || [];
    const hasStock = product.stock > 0;

    // Handlers
    const toggleAccordion = (accordionName: string) => {
        setActiveAccordion(activeAccordion === accordionName ? null : accordionName);
    };

    // Update size selection to clear error
    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
        setShowSizeError(false);
    };

    return (
        <div className="bg-white min-h-screen text-slate-900 font-sans">
            {/* Same Navbar */}
            <nav className="fixed top-0 inset-x-0 z-[60] h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
                <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
                    {/* Left: Menu & Logo */}
                   <div className="flex items-center gap-4">
                    <button
                        className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-full"
                    >
                        <Menu size={24} />
                    </button>
                    <Link href="/shop" className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-xl shadow-lg">
                            <svg className="size-6 text-white" fill="currentColor" viewBox="0 0 48 48">
                                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                            </svg>
                        </div>
                        <span className="text-xl font-sans font-bold tracking-tight text-slate-900">Nexus<span className="text-blue-600">Store</span></span>
                    </Link>
                </div>

                    {/* Center: Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium hover:text-[#2563eb] transition-colors">Home</Link>
                        <Link href="/shop" className="text-sm font-medium text-black">Shop</Link>
                        <Link href="/collections" className="text-sm font-medium hover:text-[#2563eb] transition-colors">Collections</Link>
                        <Link href="/about" className="text-sm font-medium hover:text-[#2563eb] transition-colors">About</Link>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:block flex-1 max-w-md mx-6">
                        <SearchInput />
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        <Link href="/profile" className="p-2 hover:bg-slate-100 rounded-full hidden sm:block">
                            <User size={22} />
                        </Link>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="p-2 hover:bg-slate-100 rounded-full relative"
                        >
                            <ShoppingBag size={22} />
                            {count > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-[#2563eb] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {count}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Breadcrumbs */}
            <div className="max-w-[1600px] mx-auto px-6 py-6 pt-24">
                <nav className="flex text-xs text-gray-500 font-medium tracking-wide uppercase">
                    <ol className="flex items-center gap-2">
                        <li><Link href="/shop" className="hover:text-black transition-colors">Shop</Link></li>
                        <li className="text-gray-300">/</li>
                        <li><Link href={`/shop?category=${product.category}`} className="hover:text-black transition-colors">{product.category || "General"}</Link></li>
                        <li className="text-gray-300">/</li>
                        <li className="text-black font-bold truncate max-w-[200px]">{product.name}</li>
                    </ol>
                </nav>
            </div>

            <main className="max-w-[1600px] mx-auto px-6 pb-20">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">

                    {/* Left: Gallery Section (2-Column Sticky) */}
                    <div className="flex-1 flex gap-6 h-fit lg:sticky lg:top-24">

                        {/* 1. Desktop Thumbnails (Hidden on Mobile) */}
                        <div className="hidden lg:flex flex-col gap-4 w-24 shrink-0">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${mainImage === img ? 'border-black ring-1 ring-black/5' : 'border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`View ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* 2. Main Image Display */}
                        <div className="flex-1 w-full">
                            {/* Mobile Horizontal Carousel */}
                            <div className="flex lg:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-4 mb-4 hide-scrollbar">
                                {allImages.map((img, idx) => (
                                    <div key={idx} className="snap-center shrink-0 w-[85vw] aspect-[4/5] relative rounded-lg overflow-hidden bg-gray-50">
                                        <Image
                                            src={img}
                                            alt={`${product.name} - View ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="85vw"
                                            priority={idx === 0}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Large Image */}
                            <div className="hidden lg:block relative bg-gray-50 rounded-xl overflow-hidden aspect-[4/5] w-full shadow-sm">
                                <Image
                                    src={mainImage || allImages[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-opacity duration-500"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info (Sticky) */}
                    <div className="lg:w-[480px] relative">
                        <div className="lg:sticky lg:top-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                            {/* Header Info */}
                            <div>
                                <h2 className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                                    {product.category || "Collection"}
                                </h2>
                                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight leading-[1.1]">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                                    <span className="text-2xl font-semibold tracking-tight text-slate-900">
                                        ${product.price ? product.price.toFixed(2) : "0.00"}
                                    </span>
                                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                                    <div className="flex items-center gap-2">
                                        <StarRating rating={avgRating} size={18} />
                                        <span className="text-sm text-gray-500 font-medium">({totalReviews} reviews)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Selectors */}
                            {hasSizes && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className={`text-xs font-bold uppercase tracking-widest ${showSizeError ? 'text-red-600' : 'text-slate-900'}`}>
                                            Select Size {showSizeError && "*"}
                                        </span>
                                        <button className="text-xs text-gray-500 underline hover:text-black transition-colors">
                                            Size Guide
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-5 gap-3">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => handleSizeSelect(size)}
                                                className={`h-12 flex items-center justify-center rounded-md text-sm font-bold border transition-all duration-200 ${selectedSize === size
                                                    ? 'bg-black text-white border-black shadow-lg transform scale-105'
                                                    : showSizeError
                                                        ? 'bg-red-50 text-red-600 border-red-200 hover:border-red-400'
                                                        : 'bg-white text-slate-700 border-gray-200 hover:border-gray-900'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                    {showSizeError && (
                                        <p className="text-red-600 text-[10px] font-bold mt-2 uppercase tracking-wide animate-pulse">
                                            Please select a size to continue
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="space-y-4 pt-2">
                                <div className="w-full">
                                    {hasStock ? (
                                        <AddToCartButton
                                            product={{ ...product, price: Number(product.price) }}
                                            selectedSize={selectedSize}
                                            hasSizes={hasSizes}
                                            onMissingSize={() => setShowSizeError(true)}
                                            className="w-full bg-slate-900 text-white h-14 rounded-full font-bold text-sm tracking-[0.15em] hover:bg-black transition-all transform active:scale-[0.98] uppercase shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
                                        />
                                    ) : (
                                        <button disabled className="w-full bg-gray-200 text-gray-400 h-14 rounded-full font-bold text-sm tracking-widest uppercase cursor-not-allowed">
                                            Out of Stock
                                        </button>
                                    )}
                                </div>
                                <p className="text-center text-xs text-gray-400">
                                    Free shipping on orders over $100. Returns within 30 days.
                                </p>
                            </div>

                            {/* Accordions */}
                            <div className="pt-6">
                                <AccordionItem
                                    title="Product Description"
                                    isOpen={activeAccordion === 'description'}
                                    onClick={() => toggleAccordion('description')}
                                >
                                    {product.description || "No description available for this product."}
                                    <br /><br />
                                    Designed solely for the ambitious. Meticulously crafted with premium materials to ensure durability and style that lasts.
                                </AccordionItem>

                                <AccordionItem
                                    title="Care Instructions"
                                    isOpen={activeAccordion === 'care'}
                                    onClick={() => toggleAccordion('care')}
                                >
                                    Machine wash cold with like colors. Tumble dry low. Do not bleach. Iron on low heat if needed. Dry cleaning recommended for best results.
                                </AccordionItem>

                                <AccordionItem
                                    title="Shipping & Returns"
                                    isOpen={activeAccordion === 'shipping'}
                                    onClick={() => toggleAccordion('shipping')}
                                >
                                    Free standard shipping on all domestic orders. Orders are processed within 24 hours. Returns accepted within 30 days of delivery in original condition.
                                </AccordionItem>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Recommendations Section */}
                <section className="mt-32 border-t border-gray-100 pt-16">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">You May Also Like</h2>
                        <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-black hover:gap-3 flex items-center gap-2 transition-all">
                            View all <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {relatedProducts.slice(0, 4).map((related) => {
                            const relatedImage = related.images?.[0] || "/placeholder.png";
                            return (
                                <Link href={`/shop/${related.id}`} key={related.id} className="group cursor-pointer block">
                                    <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-[4/5] mb-5">
                                        <Image
                                            src={relatedImage}
                                            alt={related.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        />
                                        {/* Quick add button on hover */}
                                        <button className="absolute bottom-4 right-4 h-10 w-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-black hover:text-white">
                                            <Plus className="size-5" />
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-sm mb-1 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {related.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        ${Number(related.price).toFixed(2)}
                                    </p>
                                </Link>
                            )
                        })}
                    </div>
                </section>

            </main>
        </div>
    );
}
