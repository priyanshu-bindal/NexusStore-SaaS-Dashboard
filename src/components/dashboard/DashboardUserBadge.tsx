"use client";

interface DashboardUserBadgeProps {
    storeName: string;
    initials: string;
}

export function DashboardUserBadge({ storeName, initials }: DashboardUserBadgeProps) {
    return (
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
            <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{storeName}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-1">Premium Partner</p>
            </div>
            <div className="size-9 bg-[#d97706] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm select-none">
                {initials}
            </div>
        </div>
    );
}
