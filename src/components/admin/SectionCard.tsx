"use client";

import { useState, useTransition } from "react";
import { ImageIcon, Tag, BarChart2, ChevronUp, ChevronDown, Type, LayoutGrid, PlaySquare } from "lucide-react";
import { toast } from "sonner";
import { toggleSectionStatus, reorderSection } from "@/actions/storefront";
import type { StorefrontSectionData, SectionType } from "@/types/storefront";
import SectionForm from "./SectionForm";

const ICON_MAP: Record<SectionType, React.ReactNode> = {
    HERO: <ImageIcon size={18} className="text-blue-600" />,
    PROMO: <Tag size={18} className="text-amber-500" />,
    STATS: <BarChart2 size={18} className="text-emerald-600" />,
    SCROLLING_TICKER: <Type size={18} className="text-purple-600" />,
    BENTO_GRID_4X4: <LayoutGrid size={18} className="text-indigo-600" />,
    ANIMATED_PROMO_CARD: <PlaySquare size={18} className="text-rose-600" />,
};

const TYPE_BADGE_MAP: Record<SectionType, string> = {
    HERO: "bg-blue-50 text-blue-700 border-blue-200",
    PROMO: "bg-amber-50 text-amber-700 border-amber-200",
    STATS: "bg-emerald-50 text-emerald-700 border-emerald-200",
    SCROLLING_TICKER: "bg-purple-50 text-purple-700 border-purple-200",
    BENTO_GRID_4X4: "bg-indigo-50 text-indigo-700 border-indigo-200",
    ANIMATED_PROMO_CARD: "bg-rose-50 text-rose-700 border-rose-200",
};

const ICON_BG_MAP: Record<SectionType, string> = {
    HERO: "bg-blue-100",
    PROMO: "bg-amber-100",
    STATS: "bg-emerald-100",
    SCROLLING_TICKER: "bg-purple-100",
    BENTO_GRID_4X4: "bg-indigo-100",
    ANIMATED_PROMO_CARD: "bg-rose-100",
};

interface Props {
    section: StorefrontSectionData;
    isFirst: boolean;
    isLast: boolean;
    onOptimisticToggle: (id: string) => void;
    onOptimisticReorder: (id: string, direction: "up" | "down") => void;
}

export default function SectionCard({
    section,
    isFirst,
    isLast,
    onOptimisticToggle,
    onOptimisticReorder,
}: Props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        onOptimisticToggle(section.id);
        startTransition(async () => {
            const result = await toggleSectionStatus(section.id);
            if (result.success) {
                toast.success(
                    `${section.title} is now ${result.isActive ? "active" : "inactive"}`
                );
            }
        });
    };

    const handleReorder = (direction: "up" | "down") => {
        onOptimisticReorder(section.id, direction);
        startTransition(async () => {
            const result = await reorderSection(section.id, direction);
            if (!result.success) {
                toast.error("Could not reorder section");
            }
        });
    };

    const type = section.type as SectionType;
    const updatedAt = new Date(section.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div
            className={`bg-white border rounded-2xl overflow-hidden shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] transition-all duration-200 ${section.isActive ? "border-slate-200" : "border-slate-200 opacity-75"
                }`}
        >
            {/* Card Header */}
            <div className="flex items-center gap-4 px-6 py-5">
                {/* Icon */}
                <div
                    className={`size-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ICON_BG_MAP[type]}`}
                >
                    {ICON_MAP[type]}
                </div>

                {/* Title & type badge */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span
                            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${TYPE_BADGE_MAP[type]}`}
                        >
                            {type}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">{section.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Last updated {updatedAt} · Order #{section.order + 1}
                    </p>
                </div>

                {/* Controls row */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Reorder arrows */}
                    <div className="flex flex-col gap-0.5">
                        <button
                            onClick={() => handleReorder("up")}
                            disabled={isFirst || isPending}
                            className="size-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronUp size={14} />
                        </button>
                        <button
                            onClick={() => handleReorder("down")}
                            disabled={isLast || isPending}
                            className="size-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronDown size={14} />
                        </button>
                    </div>

                    {/* Status label */}
                    <span
                        className={`text-[11px] font-bold uppercase tracking-wider ${section.isActive ? "text-emerald-600" : "text-slate-400"
                            }`}
                    >
                        {section.isActive ? "Active" : "Inactive"}
                    </span>

                    {/* Toggle switch */}
                    <button
                        role="switch"
                        aria-checked={section.isActive}
                        onClick={handleToggle}
                        disabled={isPending}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-60 ${section.isActive ? "bg-emerald-500" : "bg-slate-200"
                            }`}
                    >
                        <span
                            className={`inline-block size-4 transform rounded-full bg-white shadow transition-transform ${section.isActive ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>

                    {/* Edit toggle */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors border border-blue-200"
                    >
                        {isExpanded ? "Close" : "Edit Content"}
                    </button>
                </div>
            </div>

            {/* Collapsible form */}
            {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5">
                    <SectionForm section={section} onSaved={() => setIsExpanded(false)} />
                </div>
            )}
        </div>
    );
}
