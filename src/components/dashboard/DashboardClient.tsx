"use client";

import {
    TrendingUp,
    TrendingDown,
    CreditCard,
    ShoppingCart,
    MousePointerClick,
    Percent,
    Calendar as CalendarIcon,
    Download
} from "lucide-react";
import SalesChartComponent from "./SalesChart";
import DateRangeFilter from "./DateRangeFilter";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface DashboardClientProps {
    user: any;
    totalRevenue: number;
    revenueGrowth: number;
    totalOrders: number;
    activeProducts: number;
    currentConversionRate: number;
    conversionGrowth: number;
    chartData: any[];
    recentOrders: any[];
    topProducts: any[];
}

export default function DashboardClient({
    user,
    totalRevenue,
    revenueGrowth,
    totalOrders,
    activeProducts,
    currentConversionRate,
    conversionGrowth,
    chartData,
    recentOrders,
    topProducts
}: DashboardClientProps) {

    // Helpers
    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
    const fmtNum = (n: number) => new Intl.NumberFormat('en-US').format(n);
    const fmtPercent = (n: number) => (n > 0 ? "+" : "") + n.toFixed(1) + "%";

    return (
        <div className="flex-1 w-full">
            {/* Page Header section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
                        <p className="text-sm text-slate-500">Welcome back, {user?.name || "Merchant"}! Here's what's happening today.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 gap-2 text-sm text-slate-600 cursor-pointer hover:border-slate-300 transition-colors">
                            <CalendarIcon size={18} />
                            <span className="font-medium">Last 30 Days</span>
                        </div>
                        <button className="bg-[#135bec] hover:bg-blue-600 text-white text-sm font-bold py-2.5 px-6 rounded-full flex items-center gap-2 shadow-[0_4px_14px_0_rgba(19,91,236,0.39)] hover:shadow-[0_6px_20px_rgba(19,91,236,0.23)] transition-all whitespace-nowrap">
                            <Download size={18} />
                            Download Report
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 py-8 space-y-8">
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Revenue */}
                    <MetricCard
                        title="Total Revenue"
                        value={fmt(totalRevenue)}
                        trend={fmtPercent(revenueGrowth)}
                        trendUp={revenueGrowth >= 0}
                        icon={<CreditCard className="text-blue-600" />}
                        bgColor="bg-blue-50"
                    />
                    {/* Total Orders */}
                    <MetricCard
                        title="Total Orders"
                        value={fmtNum(totalOrders)}
                        trend="Lifetime"
                        trendUp={true}
                        icon={<ShoppingCart className="text-blue-600" />}
                        bgColor="bg-blue-50"
                    />
                    {/* Active Products */}
                    <MetricCard
                        title="Active Products"
                        value={fmtNum(activeProducts)}
                        trend="Inventory"
                        trendUp={true}
                        icon={<MousePointerClick className="text-purple-600" />}
                        bgColor="bg-purple-50"
                    />
                    {/* Conversion Rate */}
                    <MetricCard
                        title="Conversion Rate"
                        value={fmtPercent(currentConversionRate)}
                        trend={fmtPercent(conversionGrowth)}
                        trendUp={conversionGrowth >= 0}
                        icon={<Percent className="text-orange-600" />}
                        bgColor="bg-orange-50"
                    />
                </div>
                {/* Middle Section: Chart and Recent Orders */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sales Trends Chart */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Sales Trends</h3>
                                <p className="text-sm text-slate-500">Revenue overview over time</p>
                            </div>
                            <DateRangeFilter />
                        </div>

                        {/* Visual placeholder for the chart to ensure no "Illegal Token" errors */}
                        <div className="h-64 w-full">
                            <SalesChartComponent data={chartData} />
                        </div>
                    </div>

                    {/* Recent Orders List */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900">Recent Orders</h3>
                            <button className="text-xs font-bold text-[#135bec] hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {recentOrders.map((order: any) => (
                                <RecentOrderRow
                                    key={order.id}
                                    id={order.id.slice(-6).toUpperCase()} // Display ID
                                    name="Guest Customer" // Placeholder
                                    time={new Date(order.createdAt).toLocaleDateString()}
                                    price={fmt(Number(order.totalAmount))}
                                    status={order.status}
                                    statusColor={order.status === 'PAID' ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"}
                                />
                            ))}
                            {recentOrders.length === 0 && (
                                <div className="p-4 text-center text-sm text-slate-500">No orders yet</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Best Selling Products Section */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] mt-8">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-lg text-slate-900">Top Best Selling Products</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Inventory</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Qty Sold</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {topProducts.map((p: any) => (
                                    <ProductRow
                                        key={p.sku} // Use SKU as key
                                        name={p.name}
                                        sku={p.sku}
                                        stock={`${p.stock} in stock`}
                                        sold={p.sold}
                                        price={fmt(p.price)}
                                        revenue={fmt(p.revenue)}
                                    />
                                ))}
                                {topProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-6 text-center text-sm text-slate-500">No sales data yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-component for clean organization
function MetricCard({ title, value, trend, trendUp, icon, bgColor }: any) {
    return (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-start mb-4">
                <div className={`size-12 ${bgColor} rounded-xl flex items-center justify-center`}>
                    {icon}
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-blue-600' : 'text-red-500'}`}>
                    {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {trend}
                </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-black text-slate-900">{value}</p>
        </div>
    );
}


function RecentOrderRow({ id, name, time, price, status, statusColor }: any) {
    return (
        <div className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="size-10 bg-slate-100 rounded-lg flex-shrink-0" /> {/* Image Placeholder */}
                <div>
                    <div className="text-sm font-bold text-slate-900">#{id}</div>
                    <div className="text-xs text-slate-500">{name} • {time}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-sm font-bold text-slate-900">{price}</div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                    {status}
                </span>
            </div>
        </div>
    );
}

function ProductRow({ name, sku, stock, sold, price, revenue }: any) {
    return (
        <tr>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0" /> {/* Image Placeholder */}
                    <div>
                        <div className="text-sm font-bold text-slate-900">{name}</div>
                        <div className="text-xs text-slate-500">SKU: {sku}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">{stock}</td>
            <td className="px-6 py-4 text-sm font-medium text-slate-900">{sold}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{price}</td>
            <td className="px-6 py-4 text-sm font-bold text-slate-900">{revenue}</td>
        </tr>
    );
}
