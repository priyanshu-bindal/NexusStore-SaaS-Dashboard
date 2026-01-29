import Link from "next/link";

export function Hero() {
    return (
        <main className="max-w-[1280px] mx-auto px-6 pt-16 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold w-fit uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Now in Public Beta
                    </div>
                    <div className="flex flex-col gap-4">
                        <h1 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-[-0.03em]">
                            Build Your Storefront at the{" "}
                            <span className="text-primary">Speed of Thought.</span>
                        </h1>
                        <p className="text-lg text-[#616f89] max-w-[540px] leading-relaxed">
                            The headless commerce engine designed for developers. Connect your
                            favorite stack, manage via API, and start selling in minutes.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/get-started"
                            className="flex h-12 px-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-base hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer"
                        >
                            Start Building
                        </Link>
                        <button className="flex h-12 px-8 items-center justify-center rounded-lg border border-[#dbdfe6] bg-white font-bold text-base hover:bg-gray-50 transition-all cursor-pointer">
                            View Documentation
                        </button>
                    </div>
                </div>

                {/* Code/Live Preview Side */}
                <div className="relative group perspective-1000">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-transparent blur-2xl opacity-50"></div>

                    {/* Code Window */}
                    <div className="relative bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-[#333] mb-12 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                        <div className="flex items-center gap-1.5 px-4 py-3 bg-[#252526] border-b border-[#333]">
                            <div className="size-3 rounded-full bg-[#ff5f56]"></div>
                            <div className="size-3 rounded-full bg-[#ffbd2e]"></div>
                            <div className="size-3 rounded-full bg-[#27c93f]"></div>
                            <span className="ml-2 text-xs text-gray-400 font-mono">
                                Store.tsx
                            </span>
                        </div>
                        <div className="p-6 font-mono text-sm leading-6 overflow-x-auto text-nowrap">
                            <pre className="text-gray-300">
                                <code>
                                    <span className="text-primary">import</span>{" "}
                                    {"{ NexusProvider }"} <span className="text-primary">from</span>{" "}
                                    <span className="text-blue-400">'@nexus/react'</span>;
                                    {"\n\n"}
                                    <span className="text-primary">const</span> App = () =&gt; (
                                    {"\n"}  &lt;
                                    <span className="text-blue-300">NexusProvider</span>{" "}
                                    <span className="text-yellow-200">apiKey</span>=
                                    <span className="text-blue-400">"nx_live_..."</span>&gt;
                                    {"\n"}    &lt;<span className="text-blue-300">Storefront</span>
                                    &gt;
                                    {"\n"}      &lt;
                                    <span className="text-blue-300">ProductGrid</span>{" "}
                                    <span className="text-yellow-200">limit</span>={"{"}
                                    <span className="text-orange-300">8</span>
                                    {"}"} /&gt;
                                    {"\n"}      &lt;<span className="text-blue-300">CartDrawer</span>{" "}
                                    /&gt;
                                    {"\n"}    &lt;/<span className="text-blue-300">
                                        Storefront
                                    </span>
                                    &gt;
                                    {"\n"}  &lt;/<span className="text-blue-300">NexusProvider</span>
                                    &gt;
                                    {"\n"});
                                </code>
                            </pre>
                        </div>
                    </div>

                    {/* Live Preview Card */}
                    <div className="absolute -bottom-6 -right-6 md:right-12 w-64 bg-white rounded-xl shadow-2xl border border-[#dbdfe6] p-4 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <div
                            className="w-full h-40 bg-gray-100 rounded-lg mb-4 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuACx0kc9MVxAD4gLQ1V1vD39WPqI52XbWvCcCCYb2OgLd7MdOsXsHg0da9awOiIJkQX_exiBqiBzjpEx481oi-xq5FChKumixVEuqty1SJkHU6wfgFp30lX6mP5lVTBSnEYwXntzFRZMuf1m_ClY5Odk9nunAdZqw-BGgENVMmfH4ikbh3ePHSxgE81q0LKY6GrbpW_xVOFbRWxn0JohRxTRXIhbDlWjn2UYLVBfhgVo5PZg8xwyu5T6aRbB_ow84aUjQwtokTCQueZ')",
                            }}
                        ></div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold">Speed Runner 2.0</span>
                            <span className="text-primary text-sm font-bold">$180</span>
                        </div>
                        <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded mt-2 hover:bg-primary/90 transition-colors cursor-pointer">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
