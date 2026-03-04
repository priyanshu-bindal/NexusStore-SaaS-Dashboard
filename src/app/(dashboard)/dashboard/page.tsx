import {
    TrendingUp,
    TrendingDown,
    CreditCard,
    ShoppingCart,
    MousePointerClick,
    Eye,
    Calendar as CalendarIcon,
    Download,
    Percent, // Importing Percent icon
    Target // Importing Target icon for variety if needed
} from "lucide-react";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { formatCurrency } from "../../../lib/utils";
import SalesChartComponent from "@/components/dashboard/SalesChart";
import DateRangeFilter from "@/components/dashboard/DateRangeFilter";
import { Prisma } from "@prisma/client";

// I'll define a local currency formatter to be safe.

export const revalidate = 0;

export default async function DashboardOverview(props: { searchParams: Promise<{ range?: string }> }) {
    const searchParams = await props.searchParams;
    const range = searchParams?.range || "30d";
    const session = await auth();

    if (!session?.user?.id) return redirect("/sign-in");

    // Fetch Store
    const store = await db.store.findFirst({
        where: { userId: session.user.id },
        select: { id: true }
    });

    if (!store) return redirect("/onboarding");

    // 1. Time Periods for Growth Logic
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // 2. Aggregate Data Parallelization
    const [
        totalRevenueData,
        browsingCount, // active products
        totalOrders,
        currentPeriodStats,
        previousPeriodStats,
        currentVisitsResult,
        previousVisitsResult
    ] = await Promise.all([
        // Total Stats
        db.order.aggregate({
            where: { storeId: store.id, status: "PAID" },
            _sum: { totalAmount: true }
        }),
        db.product.count({
            where: { storeId: store.id }
        }),
        db.order.count({
            where: { storeId: store.id }
        }),
        // Growth Stats: Revenue & Orders (for Conversion Rate)
        db.order.aggregate({
            where: {
                storeId: store.id,
                status: "PAID",
                createdAt: { gte: thirtyDaysAgo }
            },
            _sum: { totalAmount: true },
            _count: true
        }),
        db.order.aggregate({
            where: {
                storeId: store.id,
                status: "PAID",
                createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
            },
            _sum: { totalAmount: true },
            _count: true
        }),
        // Store Visits Stats (Unique Visitors via ipHash)
        db.visit.groupBy({
            by: ['ipHash'],
            where: { createdAt: { gte: thirtyDaysAgo } }
        }),
        db.visit.groupBy({
            by: ['ipHash'],
            where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }
        })
    ]);

    // 3. Process Data & Handle Decimals
    const totalRevenue = Number(totalRevenueData._sum.totalAmount || 0);
    const activeProducts = browsingCount;

    // Calculate Revenue Growth
    const currentRev = Number(currentPeriodStats._sum.totalAmount || 0);
    const prevRev = Number(previousPeriodStats._sum.totalAmount || 0);
    const revenueGrowth = prevRev === 0
        ? (currentRev > 0 ? 100 : 0)
        : ((currentRev - prevRev) / prevRev) * 100;

    // --- Conversion Rate Logic ---
    const currentUniqueVisits = currentVisitsResult.length;
    const previousUniqueVisits = previousVisitsResult.length;

    const currentOrdersCount = currentPeriodStats._count;
    const previousOrdersCount = previousPeriodStats._count;

    // Rate Calculation: (Orders / UniqueVisits) * 100
    const currentConversionRate = currentUniqueVisits > 0
        ? (currentOrdersCount / currentUniqueVisits) * 100
        : 0;

    const previousConversionRate = previousUniqueVisits > 0
        ? (previousOrdersCount / previousUniqueVisits) * 100
        : 0;

    // Growth of the RATE itself
    const conversionGrowth = previousConversionRate === 0
        ? (currentConversionRate > 0 ? 100 : 0)
        : ((currentConversionRate - previousConversionRate) / previousConversionRate) * 100;


    // 4. Sales Trends (Dynamic Timeframe)
    let chartData: { label: string, amount: number }[] = [];

    // Aggregation Logic using Prisma Raw Query for Date Truncation
    try {
        let groupByUnit: 'day' | 'week' | 'month' | 'year' = 'day';
        let startDate = thirtyDaysAgo;
        let dateFormat: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit' };

        switch (range) {
            case '12w':
                groupByUnit = 'week';
                startDate = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000); // 12 Weeks
                dateFormat = { month: 'short', day: '2-digit' }; // e.g. "Jan 22" (Start of week)
                break;
            case '12m':
                groupByUnit = 'month';
                startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // 12 Months
                dateFormat = { month: 'short', year: '2-digit' }; // e.g. "Jan 24"
                break;
            case '5y':
                groupByUnit = 'year';
                startDate = new Date(now.getFullYear() - 4, 0, 1); // 5 Years
                dateFormat = { year: 'numeric' }; // e.g. "2024"
                break;
            case '30d':
            default:
                groupByUnit = 'day';
                startDate = thirtyDaysAgo;
        }

        // Prisma Raw Query for Postgres
        // We use string interpolation for the interval because parameters don't work for identifiers/units in SQL
        // BUT we must be careful. Here 'unit' is controlled by our switch above (safe).
        const rawStats = await db.$queryRaw<Array<{ date: Date, amount: number }>>`
            SELECT 
                DATE_TRUNC(${groupByUnit}, "createdAt") as date, 
                SUM("totalAmount") as amount 
            FROM "Order" 
            WHERE "storeId" = ${store.id} 
              AND "status" = 'PAID'
              AND "createdAt" >= ${startDate}
            GROUP BY date 
            ORDER BY date ASC
        `;

        // Normalize Data into Map for Filling Gaps
        const salesMap = new Map<string, number>();
        const formatter = new Intl.DateTimeFormat('en-US', dateFormat);

        for (const stat of rawStats) {
            // rawStats date is a Date object from Prisma
            const key = formatter.format(stat.date);
            salesMap.set(key, Number(stat.amount));
        }

        // Fill Gaps Logic
        // We iterate backwards from NOW to START
        const currentPtr = new Date();
        const endPtr = startDate;

        // Safety: Prevent infinite loops if dates are weird
        let loops = 0;
        const maxLoops = 400; // max days in year + buffer

        // We build the array in reverse order (Newest -> Oldest) then reverse it, 
        // OR build standard and push. Let's do standard push but we need to generate keys correctly.
        // Actually, easiest is to generate the list of keys we Expect, then map.

        const expectedKeys: string[] = [];

        // Clone start date for iteration
        let iterDate = new Date(startDate);
        // Align iterDate to the start of the unit to match DATE_TRUNC
        if (range === '12m') iterDate.setDate(1);
        if (range === '5y') { iterDate.setMonth(0); iterDate.setDate(1); }

        while (iterDate <= now && loops < maxLoops) {
            expectedKeys.push(formatter.format(iterDate));

            // Advance Date
            if (groupByUnit === 'day') iterDate.setDate(iterDate.getDate() + 1);
            else if (groupByUnit === 'week') iterDate.setDate(iterDate.getDate() + 7);
            else if (groupByUnit === 'month') iterDate.setMonth(iterDate.getMonth() + 1);
            else if (groupByUnit === 'year') iterDate.setFullYear(iterDate.getFullYear() + 1);

            loops++;
        }

        // Build Final Data
        chartData = expectedKeys.map(label => ({
            label,
            amount: salesMap.get(label) || 0
        }));

    } catch (error) {
        console.error("Aggregation Error", error);
        // Fallback to empty to prevent crash
        chartData = [];
    }

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
    const topSellerStats = await db.orderItem.groupBy({
        by: ['productId'],
        where: {
            order: { storeId: store.id, status: "PAID" }
        },
        _sum: { quantity: true, price: true },
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
                        <p className="text-sm text-slate-500">Welcome back, {session.user.name || "Merchant"}! Here's what's happening today.</p>
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
                    {/* Store Visits (Still Mocked) */}
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
                            {recentOrders.map(order => (
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


// Helper for Recent Order rows
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

// Helper for Product Table rows
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
