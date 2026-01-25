import {
    TrendingUp,
    TrendingDown,
    CreditCard,
    ShoppingCart,
    MousePointerClick,
    Eye,
    Calendar as CalendarIcon,
    Download
} from "lucide-react";

export default function DashboardOverview() {
    return (
        <div className="flex-1 w-full">
            {/* Page Header section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
                        <p className="text-sm text-slate-500">Welcome back, John! Here's what's happening today.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 gap-2 text-sm text-slate-600 cursor-pointer hover:border-slate-300 transition-colors">
                            <CalendarIcon size={18} />
                            <span className="font-medium">Oct 1, 2023 - Oct 31, 2023</span>
                        </div>
                        <button className="bg-[#10b981] hover:bg-emerald-600 text-white text-sm font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 shadow-sm transition-all whitespace-nowrap">
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
                        value="$128,430.20"
                        trend="+12.5%"
                        trendUp={true}
                        icon={<CreditCard className="text-emerald-600" />}
                        bgColor="bg-emerald-50"
                    />
                    {/* Total Orders */}
                    <MetricCard
                        title="Total Orders"
                        value="1,429"
                        trend="+8.2%"
                        trendUp={true}
                        icon={<ShoppingCart className="text-blue-600" />}
                        bgColor="bg-blue-50"
                    />
                    {/* Conversion Rate */}
                    <MetricCard
                        title="Conversion Rate"
                        value="3.82%"
                        trend="-2.4%"
                        trendUp={false}
                        icon={<MousePointerClick className="text-purple-600" />}
                        bgColor="bg-purple-50"
                    />
                    {/* Store Visits */}
                    <MetricCard
                        title="Store Visits"
                        value="42,901"
                        trend="+18.9%"
                        trendUp={true}
                        icon={<Eye className="text-orange-600" />}
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
                                <p className="text-sm text-slate-500">Revenue overview for the last 30 days</p>
                            </div>
                            <select className="text-sm border-slate-200 rounded-lg focus:ring-emerald-500 outline-none">
                                <option>Daily</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>

                        {/* Visual placeholder for the chart to ensure no "Illegal Token" errors */}
                        <div className="h-64 w-full">
                            <SalesChartComponent />
                        </div>
                    </div>

                    {/* Recent Orders List */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900">Recent Orders</h3>
                            <button className="text-xs font-bold text-[#10b981] hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            <RecentOrderRow id="NX-8274" name="John Doe" time="2m ago" price="$299.00" status="Paid" statusColor="bg-emerald-100 text-emerald-700" />
                            <RecentOrderRow id="NX-8273" name="Sarah M." time="15m ago" price="$185.00" status="Shipped" statusColor="bg-blue-100 text-blue-700" />
                            <RecentOrderRow id="NX-8272" name="Mike R." time="1h ago" price="$249.00" status="Processing" statusColor="bg-orange-100 text-orange-700" />
                            <RecentOrderRow id="NX-8271" name="Emma L." time="3h ago" price="$199.00" status="Paid" statusColor="bg-emerald-100 text-emerald-700" />
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
                                <ProductRow name="SonicX Wireless Headphones" sku="SX-900-GR" stock="42 in stock" sold="850" price="$299.00" revenue="$254,150.00" />
                                <ProductRow name="Minimalist Chronograph" sku="MC-342-BK" stock="18 in stock" sold="620" price="$185.00" revenue="$114,700.00" />
                                <ProductRow name="SoundPeak ANC" sku="SP-881-WH" stock="85 in stock" sold="540" price="$249.00" revenue="$134,460.00" />
                                <ProductRow name="Leather Travel Case" sku="LT-001-BN" stock="120 in stock" sold="410" price="$45.00" revenue="$18,450.00" />
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
                <span className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                    {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {trend}
                </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-black text-slate-900">{value}</p>
        </div>
    );
}


// Helper for Recent Order rows
function RecentOrderRow({ id, name, time, price, status, statusColor }: any) {
    return (
        <div className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="size-10 bg-slate-100 rounded-lg flex-shrink-0" /> {/* Image Placeholder */}
                <div>
                    <p className="text-sm font-bold text-slate-900">#{id}</p>
                    <p className="text-xs text-slate-500">{name} • {time}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{price}</p>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                    {status}
                </span>
            </div>
        </div>
    );
}

// Simple Chart Placeholder
function SalesChartComponent() {
    return (
        <div className="flex items-end gap-1 h-full w-full">
            {[40, 55, 70, 85, 95, 80, 70, 85, 100, 90].map((height, i) => (
                <div
                    key={i}
                    className="flex-1 bg-emerald-500/20 hover:bg-emerald-500 transition-colors rounded-t-sm"
                    style={{ height: `${height}%` }}
                />
            ))}
        </div>
    );
}

// Helper for Product Table rows
function ProductRow({ name, sku, stock, sold, price, revenue }: any) {
    return (
        <tr>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0" /> {/* Image Placeholder */}
                    <div>
                        <p className="text-sm font-bold text-slate-900">{name}</p>
                        <p className="text-xs text-slate-500">SKU: {sku}</p>
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
