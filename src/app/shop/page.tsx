import { db } from "@/lib/db";
import ShopClient from "@/components/shop/ShopClient";

export const dynamic = "force-dynamic"; // Ensure fresh data on every request

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const query = q || "";

    // Fetch products from database
    const products = await db.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ],
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Serialize Decimal to string/number for Client Component
    const formattedProducts = products.map((product: typeof products[number]) => ({
        ...product,
        price: product.price.toNumber(), // Convert Decimal to number
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    }));

    return <ShopClient products={formattedProducts} />;
}
