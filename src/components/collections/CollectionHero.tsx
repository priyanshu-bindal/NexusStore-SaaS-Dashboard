"use client";

export default function CollectionHero() {
    return (
        <header className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8 pb-12">
            <div className="relative h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden group">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80')" }}
                />

                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent flex flex-col justify-center px-8 md:px-16">
                    <span className="text-blue-300 font-bold tracking-widest uppercase text-sm mb-4">The 2024 Edit</span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">Summer<br />Essentials</h1>
                    <p className="text-white/80 max-w-md text-lg mb-8">Lightweight fabrics, bold prints, and the perfect accessories for the golden hour.</p>
                    <div className="flex gap-4">
                        <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition shadow-lg">Shop Women</button>
                        <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition">Shop Men</button>
                    </div>
                </div>
            </div>
        </header>
    );
}
