"use client";

import {
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    Mail,
    Plus,
    ShoppingCart,
    Store,
    Truck,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderSuccess() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="bg-[#f8fafc] text-slate-900 font-sans antialiased min-h-screen">
            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-2">
                            <Link href="/shop" className="flex items-center gap-2">
                                <div className="text-[#2563eb] size-8">
                                    <svg
                                        fill="currentColor"
                                        viewBox="0 0 48 48"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                                    </svg>
                                </div>
                                <span className="text-xl font-bold tracking-tight">NexusStore</span>
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
                            <Link className="hover:text-[#2563eb] transition-colors" href="/shop">
                                Shop
                            </Link>
                            <Link className="hover:text-[#2563eb] transition-colors" href="#">
                                Support
                            </Link>
                            <Link className="hover:text-[#2563eb] transition-colors" href="/profile">
                                My Account
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div
                    className={`text-center mb-12 transform transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <div className="inline-flex items-center justify-center size-20 bg-[#2563eb]/10 rounded-full mb-6 animate-bounce">
                        <CheckCircle className="text-[#2563eb] size-10" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
                        Thank you for your order, John!
                    </h1>
                    <p className="text-slate-500 text-lg mb-8">
                        We've received your order and we're getting it ready for shipment.
                    </p>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 inline-flex flex-col sm:flex-row items-center gap-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                        <div className="text-left">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Order Number
                            </p>
                            <p className="text-xl font-mono font-bold text-slate-900">
                                #NX-8274-9102
                            </p>
                        </div>
                        <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
                        <button className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-[#2563eb]/20 transition-all flex items-center gap-2 cursor-pointer">
                            <Truck className="size-5" />
                            Track Your Order
                        </button>
                    </div>
                </div>

                <div
                    className={`grid lg:grid-cols-3 gap-8 transform transition-all duration-700 delay-200 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="font-bold text-lg">Order Details</h2>
                                <span className="text-sm text-slate-500">
                                    Placed on {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6 mb-8">
                                    <div className="flex gap-4">
                                        <div className="size-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                                            <img
                                                alt="Product"
                                                className="w-full h-full object-cover"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdIg--M5HGvsepQps2YwUVaTAs50ExYlni9u9Gqb1csllZMWmKngHRfGCkYaRO67wQNwQ_Nx5GXIS5X7Cj2KrJseRKbAAw3_pKT9kBhcGXCFPyFSdrOOXI_QE0E1UTrsL8bUu_BiiNeaCFiJ5Rc9cpFzapSFCsGs__Bau1hBgK5zB4ImZPrdhNlThNbt-hitjJYuTNGo2ihkBPtXag4XaxYyr7tnEcQt7lWcq-COSm2JWT3mze2wuwghb-9dAnFJPxNCEx8XALRNlB"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base font-bold text-slate-900">
                                                SonicX Wireless Headphones
                                            </h4>
                                            <p className="text-sm text-slate-500">
                                                Space Gray • Quantity: 1
                                            </p>
                                            <p className="text-base font-black mt-1">$299.00</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="size-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                                            <img
                                                alt="Product"
                                                className="w-full h-full object-cover"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHdqp6Y9kmqK39zXssXupMw8tbBjMEKclN4UfEObDI9O_KaiXEM36NcaBoMxXdoAn4bj0fvvE1Ll-yZQHmO1FuBHAedtFNepY8Oo9ywdpdwoNewN0cdaKqm1_e2pkHivsiznKDfj90Gg4xOkPyFvMPNPg_TAoEytXUWw1Tts_CK3QB7UigwJc9B_62oYKvAxbQgQla5KLn0wI8LTC_H3NBkOhR_HzgIradR9D8-0PNGqDVzPrLm5yBoWDVEyW_uXGCFdLHd2ZqXFMW"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base font-bold text-slate-900">
                                                Minimalist Chronograph
                                            </h4>
                                            <p className="text-sm text-slate-500">
                                                Leather Black • Quantity: 1
                                            </p>
                                            <p className="text-base font-black mt-1">$185.00</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                                            Shipping Address
                                        </h3>
                                        <div className="text-slate-600 text-sm leading-relaxed">
                                            <p className="font-bold text-slate-900">John Doe</p>
                                            <p>123 Nexus Way</p>
                                            <p>San Francisco, CA 94103</p>
                                            <p>United States</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                                            Delivery Method
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                                <Zap className="size-5" />
                                            </div>
                                            <div className="text-sm">
                                                <p className="font-bold text-slate-900">
                                                    Express Delivery
                                                </p>
                                                <p className="text-slate-500">
                                                    Expected arrival: {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100 space-y-2">
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <span>Subtotal</span>
                                        <span>$484.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <span>Shipping</span>
                                        <span className="text-[#2563eb] font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <span>Tax</span>
                                        <span>$40.92</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-black text-slate-900 pt-4">
                                        <span>Total</span>
                                        <span>$524.92</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-lg mb-4">Next Steps</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <p className="text-sm font-bold text-slate-900 mb-2">
                                        Account Management
                                    </p>
                                    <p className="text-xs text-slate-500 mb-4">
                                        Create an account to track your orders, manage returns, and
                                        speed up future checkouts.
                                    </p>
                                    <button className="w-full bg-white border border-slate-200 hover:border-[#2563eb] hover:text-[#2563eb] font-bold py-2.5 rounded-lg text-sm transition-all cursor-pointer">
                                        Create an Account
                                    </button>
                                </div>
                                <Link
                                    href="/shop"
                                    className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Store className="text-slate-400 size-5" />
                                        <span className="text-sm font-medium">
                                            Return to Storefront
                                        </span>
                                    </div>
                                    <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform size-5" />
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <HelpCircle className="text-slate-400 size-5" />
                                        <span className="text-sm font-medium">
                                            Customer Support
                                        </span>
                                    </div>
                                    <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform size-5" />
                                </Link>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#2563eb]/10 to-emerald-50 border border-[#2563eb]/20 rounded-2xl p-6">
                            <div className="flex items-start gap-3">
                                <Mail className="text-[#2563eb] size-6" />
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">
                                        Email Confirmation
                                    </h4>
                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                        A confirmation email has been sent to{" "}
                                        <strong>john.doe@example.com</strong> with your receipt and
                                        order details.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`mt-20 transform transition-all duration-700 delay-400 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold">Recommended for You</h2>
                        <div className="flex gap-2">
                            <button className="size-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                <ChevronLeft className="size-6" />
                            </button>
                            <button className="size-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                <ChevronRight className="size-6" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            {
                                name: "SoundPeak ANC",
                                price: "$249.00",
                                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdIg--M5HGvsepQps2YwUVaTAs50ExYlni9u9Gqb1csllZMWmKngHRfGCkYaRO67wQNwQ_Nx5GXIS5X7Cj2KrJseRKbAAw3_pKT9kBhcGXCFPyFSdrOOXI_QE0E1UTrsL8bUu_BiiNeaCFiJ5Rc9cpFzapSFCsGs__Bau1hBgK5zB4ImZPrdhNlThNbt-hitjJYuTNGo2ihkBPtXag4XaxYyr7tnEcQt7lWcq-COSm2JWT3mze2wuwghb-9dAnFJPxNCEx8XALRNlB",
                            },
                            {
                                name: "Titanium Sport",
                                price: "$199.00",
                                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHdqp6Y9kmqK39zXssXupMw8tbBjMEKclN4UfEObDI9O_KaiXEM36NcaBoMxXdoAn4bj0fvvE1Ll-yZQHmO1FuBHAedtFNepY8Oo9ywdpdwoNewN0cdaKqm1_e2pkHivsiznKDfj90Gg4xOkPyFvMPNPg_TAoEytXUWw1Tts_CK3QB7UigwJc9B_62oYKvAxbQgQla5KLn0wI8LTC_H3NBkOhR_HzgIradR9D8-0PNGqDVzPrLm5yBoWDVEyW_uXGCFdLHd2ZqXFMW",
                            },
                            {
                                name: "Wireless Pad 2.0",
                                price: "$59.00",
                                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdIg--M5HGvsepQps2YwUVaTAs50ExYlni9u9Gqb1csllZMWmKngHRfGCkYaRO67wQNwQ_Nx5GXIS5X7Cj2KrJseRKbAAw3_pKT9kBhcGXCFPyFSdrOOXI_QE0E1UTrsL8bUu_BiiNeaCFiJ5Rc9cpFzapSFCsGs__Bau1hBgK5zB4ImZPrdhNlThNbt-hitjJYuTNGo2ihkBPtXag4XaxYyr7tnEcQt7lWcq-COSm2JWT3mze2wuwghb-9dAnFJPxNCEx8XALRNlB",
                            },
                            {
                                name: "Leather Travel Case",
                                price: "$45.00",
                                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHdqp6Y9kmqK39zXssXupMw8tbBjMEKclN4UfEObDI9O_KaiXEM36NcaBoMxXdoAn4bj0fvvE1Ll-yZQHmO1FuBHAedtFNepY8Oo9ywdpdwoNewN0cdaKqm1_e2pkHivsiznKDfj90Gg4xOkPyFvMPNPg_TAoEytXUWw1Tts_CK3QB7UigwJc9B_62oYKvAxbQgQla5KLn0wI8LTC_H3NBkOhR_HzgIradR9D8-0PNGqDVzPrLm5yBoWDVEyW_uXGCFdLHd2ZqXFMW",
                            },
                        ].map((prod, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden mb-4 relative">
                                    <img
                                        alt={prod.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        src={prod.img}
                                    />
                                    <button className="absolute bottom-4 right-4 size-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[#2563eb]">
                                        <ShoppingCart className="size-5" />
                                    </button>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900">
                                    {prod.name}
                                </h4>
                                <p className="text-sm text-slate-500">{prod.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="mt-20 border-t border-slate-200 py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <h5 className="font-bold text-sm mb-4">Shop</h5>
                            <ul className="text-sm text-slate-500 space-y-2">
                                <li>
                                    <Link className="hover:text-[#2563eb] transition-colors" href="#">
                                        Headphones
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:text-[#2563eb] transition-colors" href="#">
                                        Watches
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:text-[#2563eb] transition-colors" href="#">
                                        Accessories
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-sm mb-4">Company</h5>
                            <ul className="text-sm text-slate-500 space-y-2">
                                <li>
                                    <Link className="hover:text-[#2563eb] transition-colors" href="#">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:text-[#2563eb] transition-colors" href="#">
                                        Sustainability
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:text-[#2563eb] transition-colors" href="#">
                                        Careers
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-sm mb-4">Support</h5>
                            <ul className="text-sm text-slate-500 space-y-2">
                                <li>
                                    <Link className="hover:text-[#2563eb] transition-colors" href="#">
                                        Shipping Info
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:text-[#2563eb] transition-colors" href="#">
                                        Returns
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:text-[#2563eb] transition-colors" href="#">
                                        FAQ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-sm mb-4">Connect</h5>
                            <ul className="text-sm text-slate-500 space-y-2">
                                <li>
                                    <Link className="hover:text-[#2563eb] transition-colors" href="#">
                                        Instagram
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:text-[#2563eb] transition-colors" href="#">
                                        Twitter
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:text-[#2563eb] transition-colors" href="#">
                                        Facebook
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-xs text-slate-400">
                            © 2024 NexusStore Inc. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <img
                                alt="Visa"
                                className="h-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsu3-z6WaFEsJOYx36jPNRaE5xSVIi5W-mQ6TrWnHiqPoDO64LyXrvfX_DMmGWwJXAw24bXm2lOUB4QVA4ajE_erWNh6JxKBWN5RlALaDfcEf3op7YDcVINlggZqJPY94Cxah9kf3sqOI3f-fvemyzh_6ZqJta9Su6LjtCT8R_tN0b9829KUT57YWWaJNejQaK3ZzJ-QqR633hzmmJ1nyYpKBX29KwTIThsufyY4sOBIIKmFDtO9InFwdl_CAojUZ7cee__waHfZRx"
                            />
                            <img
                                alt="Mastercard"
                                className="h-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMLtym6zacFDL1Wvwpmaw7TLUr4cdvnOHawVyPU0czT9AynCm3AM8QvVIV7LJ9LXLjB6CpDOdBtfiKlCUlnAGk9pFi653x-HMhgy3N2-4uBk7093IS1ApYtF4BA397IJ5cJdz0ai8PFdQTV3sP4LPn9enT_v5-jteOWwfHwu04KbcnNiF2MH-gtSLZYEtT1fD-tloaBlsex7xEGYFRVQjjthHH01DY1Nde9n8cv8kTFIBd-eevwxhOdpXox4j9CpoUNqR0r5K5l3mQ"
                            />
                            <img
                                alt="Paypal"
                                className="h-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG45hxOaOpchhEnTLRFwi0BnlnhDvIUjuiJpB1A2zulKj_86p-rqPKuRUMQf4XeVG7lBIWwmjWDhPqetUqFkzU-qCluIBS6FJ5YBdOVNaHZ3mGJToXVGTgc7AoJQGiEg96QOXWG68LsfQJAnA4x4cBAXpBkZv_NM6vxTLf3Kubc47-i7G_1KXDbKGUf9_SR4kz5oyD4kZjZd4keaAvnaoQ1KjmQ2QFcr19B1KkWGWnjSlatNA6wfEfalgk0DQvo_9wuSakc63Ppvhb"
                            />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
