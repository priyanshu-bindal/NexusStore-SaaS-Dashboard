"use client";

import { useState, useEffect } from "react";

// Simple Chart Placeholder with Data Props
export default function SalesChartComponent({ data }: { data: { date: string, amount: number }[] }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return <div className="h-[300px] w-full bg-gray-50 animate-pulse" />;

    const maxAmount = Math.max(...data.map(d => d.amount), 1); // Avoid div by zero, min 1 if empty

    return (
        <div className="flex items-end gap-1 h-full w-full">
            {data.map((item, i) => (
                <div
                    key={i}
                    className="flex-1 bg-emerald-500/20 hover:bg-emerald-500 transition-colors rounded-t-sm group relative"
                    style={{ height: `${Math.max((item.amount / maxAmount) * 100, 4)}%` }} // Min height 4% for visual
                    title={`${item.date}: $${item.amount.toFixed(2)}`}
                >
                    {/* Optional: Simple CSS Tooltip can involve adding a spans inside group-hover:block */}
                </div>
            ))}
        </div>
    );
}
