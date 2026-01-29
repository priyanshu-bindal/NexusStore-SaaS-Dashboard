"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Simple Chart Placeholder with Data Props
export default function SalesChartComponent({ data }: { data: { label: string, amount: number }[] }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Prevent hydration mismatch
    if (!isClient) return <div className="h-[300px] w-full bg-slate-50 animate-pulse rounded-2xl" />;

    const maxAmount = Math.max(...data.map(d => d.amount), 1);

    // Adaptive formatting: Fewer bars = wider bars. More bars = thinner.
    const isDense = data.length > 20;
    const barWidth = isDense ? "flex-1" : "w-12 mx-auto"; // Daily: Flex fill. Yearly: Fixed elegant width.

    return (
        <div className="relative h-full w-full pb-8"> {/* Padding for labels */}
            <div className={`flex items-end gap-2 h-full w-full ${!isDense ? "justify-around" : ""}`}>
                {data.map((item, i) => {
                    const prevAmount = i > 0 ? data[i - 1].amount : 0;
                    const growth = prevAmount === 0
                        ? (item.amount > 0 ? 100 : 0)
                        : ((item.amount - prevAmount) / prevAmount) * 100;

                    // Adaptive Labels: Show first, last, and periodic labels to avoid clutter
                    const showLabel =
                        !isDense ||
                        i === 0 ||
                        i === data.length - 1 ||
                        i % Math.ceil(data.length / 6) === 0;

                    return (
                        <div
                            key={item.label} // Use label as key for animation reset on view change
                            className={`relative flex flex-col justify-end h-full group ${data.length > 20 ? 'flex-1' : ''}`}
                        >
                            {/* Animated Bar */}
                            <div className={`relative flex flex-col justify-end h-full w-full items-center`}>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max((item.amount / maxAmount) * 100, 4)}%` }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 15,
                                        delay: i * 0.03 // Stagger effect
                                    }}
                                    className={`
                                        bg-blue-500/80 hover:bg-blue-500 transition-colors 
                                        rounded-t-md cursor-pointer relative w-full
                                        ${!isDense ? "max-w-[48px]" : ""} 
                                    `}
                                >
                                    {/* Tooltip (Hover) */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                                        <div className="bg-slate-900/95 backdrop-blur-sm text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-2xl pointer-events-none ring-1 ring-white/10">
                                            <div className="font-bold mb-0.5 text-slate-200">{item.label}</div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-lg">${item.amount.toLocaleString()}</span>
                                                {i > 0 && (
                                                    <div className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${growth >= 0 ? "bg-blue-500/20 text-blue-400" : "bg-rose-500/20 text-rose-400"}`}>
                                                        {growth >= 0 ? "↑" : "↓"} {Math.abs(growth).toFixed(0)}%
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Tooltip Arrow */}
                                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900/95 absolute left-1/2 -translate-x-1/2 -bottom-1.5"></div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* X-Axis Label */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-max text-center">
                                {showLabel && (
                                    <span className="text-[10px] font-medium text-slate-400 block max-w-[60px] truncate">
                                        {item.label}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
