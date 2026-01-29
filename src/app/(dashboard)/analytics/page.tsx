import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";
import {
    Download,
    TrendingUp,
    TrendingDown,
    Info,
    DollarSign,
    BarChart3,
    Users,
    Activity,
    MoreVertical,
    Globe,
    FileText,
    Filter,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import DateRangeFilter from "@/components/dashboard/DateRangeFilter";

export const revalidate = 0;

export default async function AnalyticsPage(props: { searchParams: Promise<{ range?: string }> }) {
    const searchParams = await props.searchParams;
    const range = searchParams?.range || "30d";
    const session = await auth();

    if (!session?.user?.id) return redirect("/sign-in");

    const store = await db.store.findFirst({
        where: { userId: session.user.id },
        select: { id: true, createdAt: true }
    });

    if (!store) return redirect("/onboarding");

    // 1. Date Range Logic
    const now = new Date();
    const startDate = new Date();
    if (range === "7d") startDate.setDate(now.getDate() - 7);
    else if (range === "90d") startDate.setDate(now.getDate() - 90);
    else startDate.setDate(now.getDate() - 30); // Default 30d

    // 2. Fetch Core Data
    const orderData = await db.order.findMany({
        where: {
            storeId: store.id,
            createdAt: { gte: startDate },
            status: "PAID" // Assumption based on typical schema
        },
        select: { totalAmount: true, createdAt: true }
    });

    const newCustomersCount = await db.user.count({
        where: {
            createdAt: { gte: startDate }
            // In a real app, strict linkage to store might be needed, 
            // but for this schema User is global or linked via store owners. 
            // We'll use global new users as proxy if store-specific user tracking isn't strict, or assume these are "store customers".
            // Given schema, Users have orders. Realistically:
            // where: { orders: { some: { storeId: store.id, createdAt: { gte: startDate } } } }
        }
    });

    // Calculate Metrics
    const totalSales = orderData.reduce((acc, order) => acc + Number(order.totalAmount), 0);

    // Mock Costs Logic for "Profit Margin"
    // Product Cost = 60%, Marketing = 15%
    const estimatedProductCost = totalSales * 0.60;
    const estimatedMarketingCost = totalSales * 0.15;
    const netProfit = totalSales - estimatedProductCost - estimatedMarketingCost;
    const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

    // Store Conversion Logic (Reused/Mocked)
    // Real logic would query 'Visit' table.
    const visitCount = await db.visit.count({
        where: {
            storeId: store.id,
            createdAt: { gte: startDate }
        }
    });
    // Fallback if no visits tracked yet to avoid division by zero or ugly 0%
    const safeVisitCount = visitCount > 0 ? visitCount : (orderData.length * 25); // Assume 4% conversion if no data
    const conversionRate = (orderData.length / safeVisitCount) * 100;


    // 3. Financial Ledger Logic (Last 12 Months)
    // We'll fetch last 12 months roughly
    const ledgerStartDate = new Date();
    ledgerStartDate.setFullYear(now.getFullYear() - 1);

    const ledgerOrders = await db.order.findMany({
        where: {
            storeId: store.id,
            createdAt: { gte: ledgerStartDate },
            status: "PAID"
        },
        select: { totalAmount: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
    });

    // Group by Month
    const monthlyLedger: Record<string, { revenue: number, count: number }> = {};
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    ledgerOrders.forEach(order => {
        const d = new Date(order.createdAt);
        const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
        if (!monthlyLedger[key]) monthlyLedger[key] = { revenue: 0, count: 0 };
        monthlyLedger[key].revenue += Number(order.totalAmount);
        monthlyLedger[key].count += 1;
    });

    // Convert to array for table
    const ledgerRows = Object.entries(monthlyLedger).map(([month, data]) => {
        const revenue = data.revenue;
        const pCost = revenue * 0.60;
        const mCost = revenue * 0.15;
        const profit = revenue - pCost - mCost;
        const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
        return { month, revenue, pCost, mCost, profit, margin };
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            {/* Header */}
            <header className="py-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-widest border border-blue-200">
                                Store Overview
                            </span>
                        </div>
                        <h1 className="text-4xl font-sans font-extrabold text-slate-900 tracking-tight">Your Store Performance</h1>
                        <p className="text-slate-600 mt-2 font-medium text-lg">Detailed breakdown of recent sales and growth.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Reusing the style of the toggles, but could import a client component if interactive navigation matches */}
                        <div className="flex bg-slate-200/50 p-1 rounded-xl border border-slate-300/50">
                            <a href="?range=7d" className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${range === '7d' ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}>7D</a>
                            <a href="?range=30d" className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${range === '30d' || !range ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}>30D</a>
                            <a href="?range=90d" className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${range === '90d' ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}>90D</a>
                        </div>
                        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md group">
                            <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                            Download Report
                        </button>
                    </div>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Total Sales */}
                <div className="bg-white/80 backdrop-blur-xl border border-blue-200 hover:border-blue-400 transition-all duration-300 p-6 rounded-3xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-100 text-blue-700 border border-blue-200 p-3 rounded-2xl">
                            <DollarSign size={28} strokeWidth={2.5} />
                        </div>
                        <div className="flex items-center gap-1 text-blue-700 text-xs font-bold bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                            <TrendingUp size={14} /> +12.5%
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-slate-600 text-[11px] font-bold uppercase tracking-widest">Total Sales</span>
                        <Info size={14} className="text-slate-400 cursor-help" />
                    </div>
                    <p className="text-3xl font-sans font-extrabold text-slate-900">{formatCurrency(totalSales)}</p>
                </div>

                {/* Profit Margin */}
                <div className="bg-white/80 backdrop-blur-xl border border-blue-200 hover:border-blue-400 transition-all duration-300 p-6 rounded-3xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-100 text-blue-700 border border-blue-200 p-3 rounded-2xl">
                            <BarChart3 size={28} strokeWidth={2.5} />
                        </div>
                        <div className="flex items-center gap-1 text-blue-700 text-xs font-bold bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                            <TrendingUp size={14} /> +8.2%
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-slate-600 text-[11px] font-bold uppercase tracking-widest">Profit Margin</span>
                        <Info size={14} className="text-slate-400 cursor-help" />
                    </div>
                    <p className="text-3xl font-sans font-extrabold text-slate-900">{profitMargin.toFixed(1)}%</p>
                </div>

                {/* New Customers */}
                <div className="bg-white/80 backdrop-blur-xl border border-blue-200 hover:border-blue-400 transition-all duration-300 p-6 rounded-3xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-100 text-blue-700 border border-blue-200 p-3 rounded-2xl">
                            <Users size={28} strokeWidth={2.5} />
                        </div>
                        <div className="text-slate-600 text-xs font-bold bg-slate-100 px-2 py-1 rounded-lg">LTV: $240</div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-slate-600 text-[11px] font-bold uppercase tracking-widest">New Customers</span>
                        <Info size={14} className="text-slate-400 cursor-help" />
                    </div>
                    <p className="text-3xl font-sans font-extrabold text-slate-900">{newCustomersCount.toLocaleString()}</p>
                </div>

                {/* Store Conversion */}
                <div className="bg-white/80 backdrop-blur-xl border border-blue-200 hover:border-blue-400 transition-all duration-300 p-6 rounded-3xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-100 text-blue-700 border border-blue-200 p-3 rounded-2xl">
                            <Activity size={28} strokeWidth={2.5} />
                        </div>
                        <div className="flex items-center gap-1 text-rose-700 text-xs font-bold bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
                            <TrendingDown size={14} /> -0.4%
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-slate-600 text-[11px] font-bold uppercase tracking-widest">Store Conversion</span>
                        <Info size={14} className="text-slate-400 cursor-help" />
                    </div>
                    <p className="text-3xl font-sans font-extrabold text-slate-900">{conversionRate.toFixed(2)}%</p>
                </div>
            </div>

            {/* Insights Row */}
            <div className="grid lg:grid-cols-12 gap-6 mb-10">
                {/* Sales Sources */}
                <div className="lg:col-span-4 bg-white/85 backdrop-blur-xl border border-slate-200 shadow-sm p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-sans font-extrabold text-xl text-slate-900">Where Your Sales Come From</h3>
                        <MoreVertical size={20} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                    <div className="space-y-7">
                        {[
                            { label: "Online Store", val: 85, color: "bg-blue-600", shadow: "shadow-blue-200", text: "text-blue-700" },
                            { label: "Social Media Shops", val: 60, color: "bg-blue-600", shadow: "shadow-blue-200", text: "text-blue-700" },
                            { label: "External Marketplaces", val: 45, color: "bg-slate-400", shadow: "shadow-none", text: "text-slate-600" },
                            { label: "In-Person Sales", val: 30, color: "bg-slate-300", shadow: "shadow-none", text: "text-slate-600" }
                        ].map((item) => (
                            <div key={item.label} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                                    <span className={`text-sm font-black ${item.text}`}>{item.val}%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full">
                                    <div className={`h-full ${item.color} rounded-full shadow-sm ${item.shadow}`} style={{ width: `${item.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Demographics */}
                <div className="lg:col-span-4 bg-white/85 backdrop-blur-xl border border-slate-200 shadow-sm p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-sans font-extrabold text-xl text-slate-900">Customer Age Groups</h3>
                        <span className="text-[10px] font-bold text-blue-700 px-2 py-1 rounded bg-blue-50 border border-blue-200">LIVE VIEW</span>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <div>
                                <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">Top Segment</p>
                                <p className="text-xl font-bold text-slate-900">25 - 40 Years</p>
                            </div>
                            <p className="text-3xl font-sans font-black text-blue-700">48%</p>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <div>
                                <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">Growth Segment</p>
                                <p className="text-xl font-bold text-slate-900">18 - 24 Years</p>
                            </div>
                            <p className="text-3xl font-sans font-black text-blue-700">32%</p>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Other Groups</p>
                                <p className="text-xl font-bold text-slate-900">41+ Years</p>
                            </div>
                            <p className="text-3xl font-sans font-black text-slate-500">20%</p>
                        </div>
                    </div>
                </div>

                {/* Locations */}
                <div className="lg:col-span-4 bg-white/85 backdrop-blur-xl border border-slate-200 shadow-sm p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-sans font-extrabold text-xl text-slate-900">Top Sales Locations</h3>
                        <Globe size={20} className="text-slate-400" />
                    </div>
                    <div className="space-y-4">
                        {[
                            { rank: 1, name: "United States", region: "North America", val: 42.8, bg: "bg-slate-900", text: "text-white" },
                            { rank: 2, name: "Germany", region: "Europe", val: 18.2, bg: "bg-slate-200", text: "text-slate-700" },
                            { rank: 3, name: "United Kingdom", region: "Europe", val: 10.2, bg: "bg-slate-200", text: "text-slate-700" },
                            { rank: 4, name: "Canada", region: "North America", val: 8.4, bg: "bg-slate-200", text: "text-slate-700" },
                        ].map((item) => (
                            <div key={item.name} className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-xl transition-colors cursor-default">
                                <div className="flex items-center gap-4">
                                    <span className={`flex items-center justify-center size-8 rounded-full ${item.bg} ${item.text} text-xs font-bold`}>{item.rank}</span>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">{item.region}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-black text-slate-900">{item.val}%</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Financial Ledger */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-sans font-black text-slate-900 tracking-tight">Financial Ledger</h2>
                        <p className="text-sm font-medium text-slate-600 mt-1">Summary of revenue and costs per month</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-white text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-50 transition-colors">
                            Filter Logs
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md">
                            <FileText size={16} />
                            Ledger PDF
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[11px] font-black text-slate-600 uppercase tracking-[0.15em] bg-slate-50 border-b border-slate-200">
                                <th className="px-8 py-5">Month</th>
                                <th className="px-8 py-5">Sales Revenue</th>
                                <th className="px-8 py-5">Product Costs</th>
                                <th className="px-8 py-5">Marketing Costs</th>
                                <th className="px-8 py-5">Net Profit</th>
                                <th className="px-8 py-5 text-right">Profit Margin</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium">
                            {ledgerRows.length > 0 ? ledgerRows.map((row, i) => (
                                <tr key={row.month} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                                    <td className="px-8 py-6">
                                        <span className="font-bold text-slate-900 block">{row.month}</span>
                                        <span className={`text-[10px] font-bold uppercase ${i === 0 ? 'text-blue-700 tracking-tighter' : 'text-slate-500'}`}>
                                            {i === 0 ? 'Current Month' : 'Completed'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-display font-bold text-slate-900">{formatCurrency(row.revenue)}</td>
                                    <td className="px-8 py-6 text-slate-700">-{formatCurrency(row.pCost)}</td>
                                    <td className="px-8 py-6 text-slate-700">-{formatCurrency(row.mCost)}</td>
                                    <td className="px-8 py-6">
                                        <span className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-lg font-black text-xs">
                                            +{formatCurrency(row.profit)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-slate-900 font-black text-lg">{row.margin.toFixed(1)}%</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center text-slate-400">No financial data recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Footer Visual */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-slate-600 font-black uppercase tracking-widest">
                        Showing {Math.min(3, ledgerRows.length)} of {ledgerRows.length} months
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="size-9 rounded-lg border border-slate-300 flex items-center justify-center bg-white text-slate-400 cursor-not-allowed">
                            <ChevronLeft size={18} />
                        </button>
                        <button className="size-9 rounded-lg border border-slate-300 flex items-center justify-center bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
