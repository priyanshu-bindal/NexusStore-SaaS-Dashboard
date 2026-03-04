
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CustomersTable from "./CustomersTable";
// function timeAgo is used instead of external lib

// Simplified relative time format to avoid dependency if date-fns not installed (it usually is in standard stacks, but to be safe)
function timeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
}

export default async function CustomersPage(props: {
    searchParams: Promise<{ q?: string; page?: string }>;
}) {
    const searchParams = await props.searchParams;
    const session = await auth();
    if (!session?.user?.id) return redirect("/sign-in");

    const searchTerm = searchParams?.q || "";
    const page = Number(searchParams?.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    // Filter Logic - Only show CUSTOMER role users
    const whereClause: any = {
        role: 'CUSTOMER',
        OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
        ]
    };

    // Fetch Total Customers for Pagination
    const totalCustomers = await db.user.count({ where: whereClause });
    const totalPages = Math.ceil(totalCustomers / limit);

    // Fetch Users with Aggregation
    // Note: Prisma Relation "orders" added to User
    // Fetch Users with Aggregation
    type UserWithOrders = {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        orders: {
            totalAmount: any; // Prisma Decimal type
        }[];
    };

    let users: UserWithOrders[] = [];
    try {
        users = await db.user.findMany({
            where: {
                role: 'CUSTOMER',
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { email: { contains: searchTerm, mode: 'insensitive' } },
                ],
            },
            include: {
                orders: {
                    select: {
                        totalAmount: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: skip
        });
    } catch (error) {
        console.error("Prisma User Fetch Error:", error);
        users = [];
    }

    // Calculate Metrics - Only count CUSTOMER role users
    const allUsersCount = await db.user.count({ where: { role: 'CUSTOMER' } });
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newCustomersThisMonth = await db.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: startOfMonth } }
    });

    const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
    const newCustomersLastMonth = await db.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: lastMonthStart, lte: lastMonthEnd } }
    });

    // Transform Data
    const formattedUsers = users.map(user => {
        const totalSpent = user.orders.reduce((acc: number, order) => acc + Number(order.totalAmount), 0);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: user.createdAt.toISOString(),
            totalOrders: user.orders.length, // Use length as requested
            totalSpent: totalSpent,
            lastSeen: user.updatedAt ? timeAgo(user.updatedAt) : "Never",
        };
    });

    return (
        <div className="w-full max-w-[1440px] mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customers</h1>
                    <p className="text-sm text-slate-500">Manage your customer relationships and view purchase history.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm">
                        <span className="text-lg leading-none">↓</span>
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-[#135bec] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all">
                        <span className="text-lg leading-none">+</span>
                        Add Customer
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Total Customers */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-sm font-medium">Total Customers</span>
                        <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#135bec]">
                            👥
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-slate-900">{allUsersCount.toLocaleString()}</h3>
                        <span className="text-xs font-bold text-[#135bec] flex items-center gap-1">
                            ↑ 12%
                        </span>
                    </div>
                </div>

                {/* New Customers */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-sm font-medium">New Customers this Month</span>
                        <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#135bec]">
                            👤
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-slate-900">{newCustomersThisMonth.toLocaleString()}</h3>
                        <span className="text-xs font-bold text-slate-400">vs. {newCustomersLastMonth} last mo.</span>
                    </div>
                </div>

                {/* Retention Rate (Hardcoded per design or mock logic) */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 card-shadow text-white relative overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                    <div className="relative z-10">
                        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-1">Retention Rate</p>
                        <h3 className="text-3xl font-black mb-2">78.4%</h3>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#135bec] h-full w-[78%]"></div>
                        </div>
                    </div>
                    {/* Decorative Icon */}
                    <div className="absolute -bottom-4 -right-4 text-white/5 text-9xl">
                        📈
                    </div>
                </div>
            </div>

            {/* Table */}
            <CustomersTable
                users={formattedUsers}
                totalPages={totalPages}
                currentPage={page}
                totalCustomers={totalCustomers}
            />
        </div>
    );
}
