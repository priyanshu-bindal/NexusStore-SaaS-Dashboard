import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import OrdersTable from "./OrdersTable";

export default async function OrdersPage(props: {
    searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
    const searchParams = await props.searchParams;
    const session = await auth();
    if (!session?.user?.id) return redirect("/sign-in");

    // Fetch Store
    const store = await db.store.findFirst({
        where: { userId: session.user.id },
        select: { id: true }
    });

    if (!store) return redirect("/onboarding");

    // Build Prisma where clause based on filters
    const whereClause: any = {
        storeId: store.id
    };

    // Filter by Status
    if (searchParams?.status && searchParams.status !== "All") {
        whereClause.status = searchParams.status.toUpperCase();
    }

    // Filter by Search Term
    if (searchParams?.q) {
        whereClause.OR = [
            { id: { contains: searchParams.q, mode: "insensitive" } },
            { user: { name: { contains: searchParams.q, mode: "insensitive" } } }
        ];
    }

    // Pagination
    const page = Number(searchParams?.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    // Fetch raw orders with user relation
    const rawOrders = await db.order.findMany({
        where: whereClause,
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true
                }
            }
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: skip
    });

    // Get Total Count for Pagination
    const totalOrders = await db.order.count({ where: whereClause });
    const totalPages = Math.ceil(totalOrders / limit);

    // Transform data for serialization
    // Prisma Decimal -> Number
    // Date -> String to avoid hydration mismatch
    const orders = rawOrders.map(order => ({
        ...order,
        totalAmount: Number(order.totalAmount),
        customerName: order.user?.name || "Guest Customer",
        createdAt: order.createdAt.toLocaleDateString("en-GB", {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }), // Formatting as string "24 Oct 2023, 14:21"
    }));

    return (
        <div className="w-full max-w-[1440px] mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Orders</h1>
                    <p className="text-sm text-slate-500">Manage your store transactions and fulfillment.</p>
                </div>
                <button className="bg-[#135bec] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_14px_0_rgba(19,91,236,0.39)] hover:shadow-[0_6px_20px_rgba(19,91,236,0.23)] hover:bg-blue-600 transition-all">
                    + Create Order
                </button>
            </div>

            <OrdersTable orders={orders} totalPages={totalPages} currentPage={page} />
        </div>
    );
}
