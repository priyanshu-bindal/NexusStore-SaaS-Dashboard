import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  // Query Prisma for active products
  const products = await db.product.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const staticRoutes = ["", "/shop", "/collections", "/become-a-seller"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: 1.0,
  }));

  const dynamicRoutes = products.map((product) => ({
    url: `${baseUrl}/shop/${product.id}`,
    lastModified: product.updatedAt.toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
