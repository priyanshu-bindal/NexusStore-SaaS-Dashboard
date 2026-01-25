import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ProductsTable from "./ProductsTable";
import { Package, Eye, AlertTriangle, Download, Plus } from "lucide-react";
import { AddProductModal } from "./AddProductModal";


export default async function ProductsPage(props: {
    searchParams: Promise<{ q?: string; page?: string }>;
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

    // --- Metric Queries ---
    const totalProductsCount = await db.product.count({
        where: { storeId: store.id }
    });

    const activeListingsCount = await db.product.count({
        where: { storeId: store.id, price: { gt: 0 } }
    });

    const outOfStockCount = await db.product.count({
        where: { storeId: store.id, stock: 0 }
    });

    const activePercentage = totalProductsCount > 0 ? ((activeListingsCount / totalProductsCount) * 100).toFixed(1) : "0";

    // --- Table Data Fetching ---
    const page = Number(searchParams?.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const whereClause: any = {
        storeId: store.id
    };

    if (searchParams?.q) {
        whereClause.name = { contains: searchParams.q, mode: "insensitive" };
    }

    const rawProducts = await db.product.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: skip
    });

    const totalFiltered = await db.product.count({ where: whereClause });
    const totalPages = Math.ceil(totalFiltered / limit);

    // Fix Serialization (Decimal -> Number, Date -> String)
    const products = rawProducts.map(p => ({
        ...p,
        price: Number(p.price),
        createdAt: p.createdAt.toLocaleDateString("en-GB"),
        displaySku: `SKU-${p.id.slice(-4).toUpperCase()}` // Generate Display SKU
    }));

    return (
        <div className="w-full max-w-[1440px] mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Products</h1>
                    <p className="text-sm text-slate-500">Manage your inventory, pricing, and product listings.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={18} className="text-slate-500" />
                        Export
                    </button>
                    <AddProductModal />
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Products */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-medium text-slate-500">Total Products</p>
                        <div className="size-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <Package size={20} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-slate-900">{totalProductsCount.toLocaleString()}</h3>
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                            +4.2%
                        </span>
                    </div>
                </div>

                {/* Active Listings */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-medium text-slate-500">Active Listings</p>
                        <div className="size-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Eye size={20} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-slate-900">{activeListingsCount.toLocaleString()}</h3>
                        <span className="text-xs font-medium text-slate-400">
                            {activePercentage}% of total
                        </span>
                    </div>
                </div>

                {/* Out of Stock */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-medium text-slate-500">Out of Stock</p>
                        <div className="size-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-slate-900">{outOfStockCount.toLocaleString()}</h3>
                        <span className="text-xs font-bold text-red-500">
                            Requires attention
                        </span>
                    </div>
                </div>
            </div>

            <ProductsTable products={products} totalPages={totalPages} currentPage={page} />
        </div>
    );
}
