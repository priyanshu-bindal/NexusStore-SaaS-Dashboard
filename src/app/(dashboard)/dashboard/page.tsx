import { db } from "@/lib/db";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { DollarSign, ShoppingCart } from "lucide-react";

export default async function DashboardOverview() {
    const totalRevenue = await db.order.aggregate({
        where: { status: "PAID" },
        _sum: { totalAmount: true },
    });

    const salesCount = await db.order.count({
        where: { status: "PAID" },
    });

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    // Prisma Decimals need conversion to number for formatting
    const revenueValue = totalRevenue._sum.totalAmount
        ? Number(totalRevenue._sum.totalAmount)
        : 0;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <StatsCard
                    title="Total Revenue"
                    value={formatter.format(revenueValue)}
                    icon={DollarSign}
                />
                <StatsCard
                    title="Total Orders"
                    value={salesCount.toString()}
                    icon={ShoppingCart}
                />
            </div>
            <SalesChart />
        </div>
    );
}
