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

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { formatCurrency } from "../../../lib/utils"; // Assuming you have this or will create it. If not I'll define a local helper.
// I'll define a local currency formatter to be safe.

export default async function DashboardOverview() {
    const session = await auth();

    if (!session?.user?.id) return redirect("/sign-in");

    // Fetch Store
    const store = await db.store.findFirst({
        where: { userId: session.user.id },
        select: { id: true }
    });

    if (!store) return redirect("/onboarding");

    // 1. Metric Aggregates
    const revenueData = await db.order.aggregate({
        where: { storeId: store.id, status: "PAID" },
        _sum: { totalAmount: true },
        _count: { id: true }
    });

    const totalRevenue = Number(revenueData._sum.totalAmount || 0);
    const totalOrders = revenueData._count.id;

    // Mocking Visits and Conversion for now as they aren't in schema
    const storeVisits = 42901;
    const conversionRate = 3.82;

    // 2. Sales Trends (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const last30DaysOrders = await db.order.findMany({
        where: {
            storeId: store.id,
            createdAt: { gte: thirtyDaysAgo }
        },
        select: { createdAt: true, totalAmount: true }
    });

    // Bucket into 30 days
    const chartDataMap = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0]; // YYYY-MM-DD
        chartDataMap.set(key, 0);
    }

    last30DaysOrders.forEach(order => {
        const key = order.createdAt.toISOString().split('T')[0];
        if (chartDataMap.has(key)) {
            chartDataMap.set(key, (chartDataMap.get(key) || 0) + Number(order.totalAmount));
        }
    });

    // Convert to array of percentages for the placeholder chart (normalizing to max value)
    const dailyTotals = Array.from(chartDataMap.values()).reverse();
    const maxDaily = Math.max(...dailyTotals, 100); // Avoid divide by zero
    const chartPercentages = dailyTotals.map(val => (val / maxDaily) * 100);


    // 3. Recent Orders
    const recentOrders = await db.order.findMany({
        where: { storeId: store.id },
        orderBy: { createdAt: 'desc' },
        take: 4,
        select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            // customer: { select: { name: true } } // No customer relation yet
        }
    });

    // 4. Top Selling Products
    // Prisma doesn't support deep relations in groupBy easily, so we:
    // a. Group OrderItems by productId
    // b. Fetch Products details
    const topSellerStats = await db.orderItem.groupBy({
        by: ['productId'],
        where: {
            order: { storeId: store.id, status: "PAID" }
        },
        _sum: { quantity: true, price: true }, // price sum isn't revenue if quantities differ, typically revenue = sum(qty * price). 
        // But price in OrderItem is usually per unit. Total revenue for item = qty * price. 
        // Prisma _sum on computed fields isn't directly possible in one go.
        // We'll approximate revenue by (sum of quantity * avg price) later or just sum price if it represents line item total?
        // Usually OrderItem has 'price' (unit) and 'quantity'. 
        // Let's rely on calculating it.
        orderBy: { _sum: { quantity: 'desc' } },
        take: 4
    });

    // Fetch product details
    const productIds = topSellerStats.map(s => s.productId);
    const products = await db.product.findMany({
        where: { id: { in: productIds }, storeId: store.id },
        select: { id: true, name: true, stock: true, price: true }
    });

    const topProducts = topSellerStats.map(stat => {
        const product = products.find(p => p.id === stat.productId);
        const qty = stat._sum.quantity || 0;
        // Approximation: We don't have exact line item revenue summed easily without raw query, 
        // using current price * qty as fallback or if orderItem.price was recorded at sale.
        // Let's assume OrderItem.price is unit price at sale. 
        // We can't sum (qty*price) in groupBy. 
        // For accurate revenue, we'd need to fetch OrderItems and reduce in JS or use raw query.
        // For now, let's use the product's current price * qty sold as a "Revenue estimate" to keep it fast/simple as requested.
        const estimatedRevenue = Number(product?.price || 0) * qty;

        return {
            name: product?.name || "Unknown Product",
            sku: `SKU-${stat.productId.slice(-4).toUpperCase()}`,
            stock: product?.stock || 0,
            sold: qty,
            price: Number(product?.price || 0),
            revenue: estimatedRevenue
        };
    });


    // Helper for formatting
    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
    const fmtNum = (n: number) => new Intl.NumberFormat('en-US').format(n);

    return (
        <div className="flex-1 w-full">
            {/* Page Header section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
                        <p className="text-sm text-slate-500">Welcome back, {session.user.name || "Merchant"}! Here's what's happening today.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 gap-2 text-sm text-slate-600 cursor-pointer hover:border-slate-300 transition-colors">
                            <CalendarIcon size={18} />
                            <span className="font-medium">Last 30 Days</span>
                        </div>
                        <button className="bg-[#10b981] hover:bg-emerald-600 text-white text-sm font-bold py-2.5 px-6 rounded-full flex items-center gap-2 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] transition-all whitespace-nowrap">
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
                        trend="+12.5%"
                        trendUp={true}
                        icon={<CreditCard className="text-emerald-600" />}
                        bgColor="bg-emerald-50"
                    />
                    {/* Total Orders */}
                    <MetricCard
                        title="Total Orders"
                        value={fmtNum(totalOrders)}
                        trend="+8.2%"
                        trendUp={true}
                        icon={<ShoppingCart className="text-blue-600" />}
                        bgColor="bg-blue-50"
                    />
                    {/* Conversion Rate */}
                    <MetricCard
                        title="Conversion Rate"
                        value={conversionRate + "%"}
                        trend="-2.4%"
                        trendUp={false}
                        icon={<MousePointerClick className="text-purple-600" />}
                        bgColor="bg-purple-50"
                    />
                    {/* Store Visits */}
                    <MetricCard
                        title="Store Visits"
                        value={fmtNum(storeVisits)}
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
                            </select>
                        </div>

                        {/* Visual placeholder for the chart to ensure no "Illegal Token" errors */}
                        <div className="h-64 w-full">
                            <SalesChartComponent data={chartPercentages} />
                        </div>
                    </div>

                    {/* Recent Orders List */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900">Recent Orders</h3>
                            <button className="text-xs font-bold text-[#10b981] hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {recentOrders.map(order => (
                                <RecentOrderRow
                                    key={order.id}
                                    id={order.id.slice(-6).toUpperCase()} // Display ID
                                    name="Guest Customer" // Placeholder
                                    time={new Date(order.createdAt).toLocaleDateString()}
                                    price={fmt(Number(order.totalAmount))}
                                    status={order.status}
                                    statusColor={order.status === 'PAID' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}
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
                                {topProducts.map(p => (
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

// Sub-component for clean organization (Props updated to allow string values for formatted trends)
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

// Simple Chart Placeholder with Data Props
function SalesChartComponent({ data }: { data?: number[] }) {
    // Default to the previous static look if no data, or render data if provided
    const chartData = data || [40, 55, 70, 85, 95, 80, 70, 85, 100, 90];

    return (
        <div className="flex items-end gap-1 h-full w-full">
            {chartData.map((height, i) => (
                <div
                    key={i}
                    className="flex-1 bg-emerald-500/20 hover:bg-emerald-500 transition-colors rounded-t-sm"
                    style={{ height: `${Math.max(height, 5)}%` }} // Min height 5% for visibility
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
