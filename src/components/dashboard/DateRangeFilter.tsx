"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function DateRangeFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeRange = searchParams.get("range") || "30d";

    const ranges = [
        { label: "Daily", value: "30d" },
        { label: "Weekly", value: "12w" },
        { label: "Monthly", value: "12m" },
        { label: "Yearly", value: "5y" },
    ];

    const handleRangeChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("range", value);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
            {ranges.map((range) => (
                <button
                    key={range.value}
                    onClick={() => handleRangeChange(range.value)}
                    className={`
                        px-3 py-1.5 text-xs font-bold rounded-md transition-all
                        ${activeRange === range.value
                            ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                        }
                    `}
                >
                    {range.label}
                </button>
            ))}
        </div>
    );
}
