import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
}

export function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between text-slate-500">
                <span className="text-sm font-medium">{title}</span>
                <Icon className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}
