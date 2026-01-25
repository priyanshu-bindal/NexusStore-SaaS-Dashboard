import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Plus, Package, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { deleteProduct } from "@/actions/product";

export default async function ProductsPage() {
    // 1. Get the session first
    const session = await auth();

    // 2. SAFETY CHECK: If no user or no ID, stop and redirect
    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    // 3. DATABASE QUERY: Now it's safe to use session.user.id
    const store = await db.store.findUnique({
        where: {
            userId: session.user.id
        },
        include: {
            products: {
                orderBy: { createdAt: "desc" }
            }
        }
    });

    // 4. ONBOARDING CHECK: If they logged in but don't have a store yet
    if (!store) {
        redirect("/onboarding");
    }

    // FIX: Convert Decimal objects to numbers/strings
    const serializedProducts = store.products.map(product => ({
        ...product,
        price: product.price.toNumber(), // Convert Decimal to number
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    }));

    return (
        <main className="flex-1 p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
                        <p className="text-slate-500 text-sm">Manage your store inventory</p>
                    </div>
                    <Link
                        href="/dashboard/products/new"
                        className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="size-5" />
                        Add Product
                    </Link>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2563eb]/10 focus:border-[#2563eb]"
                            />
                        </div>
                    </div>

                    {/* Table / List */}
                    {serializedProducts.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Package className="size-8 text-slate-400" />
                            </div>
                            <h3 className="text-slate-900 font-semibold mb-1">No products found</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                                You haven&apos;t added any products to your store yet.
                            </p>
                            <Link
                                href="/dashboard/products/new"
                                className="text-[#2563eb] font-medium text-sm hover:underline"
                            >
                                Create your first product
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Product Name</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Stock</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {serializedProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                <div className="flex items-center gap-3">
                                                    {product.images[0] && (
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="size-8 rounded object-cover border border-slate-200"
                                                        />
                                                    )}
                                                    {product.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium">${Number(product.price).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}>
                                                    {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{product.category || "-"}</td>
                                            <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                                <button className="text-slate-400 hover:text-[#2563eb] transition-colors text-sm font-medium">
                                                    Edit
                                                </button>
                                                <form action={async (formData) => {
                                                    "use server";
                                                    await deleteProduct(formData);
                                                }}>
                                                    <input type="hidden" name="id" value={product.id} />
                                                    <button type="submit" className="text-red-400 hover:text-red-600 transition-colors text-sm font-medium">
                                                        Delete
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
