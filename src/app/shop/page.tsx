import { db } from "@/lib/db";
import ShopClient from "@/components/shop/ShopClient";

export const dynamic = "force-dynamic"; // Ensure fresh data on every request

export default async function Shop() {
    // Fetch products from database
    const products = await db.product.findMany({
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
