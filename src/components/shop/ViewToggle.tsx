"use client";
import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
    view: "grid" | "list";
    setView: (view: "grid" | "list") => void;
}

export function ViewToggle({ view, setView }: ViewToggleProps) {
    return (
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
            <button
                onClick={() => setView("grid")}
                className={`flex items-center justify-center size-8 rounded-md transition-all ${view === "grid"
                        ? "bg-white text-[#135bec] shadow-sm"
                        : "text-slate-400 hover:text-[#135bec]"
                    }`}
                aria-label="Grid View"
            >
                <LayoutGrid size={20} />
            </button>
            <button
                onClick={() => setView("list")}
                className={`flex items-center justify-center size-8 rounded-md transition-all ${view === "list"
                        ? "bg-white text-[#135bec] shadow-sm"
                        : "text-slate-400 hover:text-[#135bec]"
                    }`}
                aria-label="List View"
            >
                <List size={20} />
            </button>
        </div>
    );
}
