import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding StorefrontSection data...\n");

    const existing = await db.storefrontSection.count();
    if (existing > 0) {
        console.log(`⚠️  ${existing} sections already exist. Skipping seed.`);
        console.log("    Delete all StorefrontSection rows to re-seed.");
        return;
    }

    await db.storefrontSection.createMany({
        data: [
            {
                type: "HERO",
                title: "Hero Banner Display",
                order: 0,
                isActive: true,
                content: {
                    headline: "Shop the New Summer Collection",
                    subheadline: "Up to 50% off on all items from our top selected premium vendors",
                    ctaLabel: "Explore Now",
                    ctaLink: "/collections/all",
                    imageUrl:
                        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
                },
            },
            {
                type: "PROMO",
                title: "Promotional Strip",
                order: 1,
                isActive: true,
                content: {
                    message: "🚀 Free Priority Shipping on orders over $50! Use code: FREESHIP",
                    linkUrl: "/collections/all",
                    bgColor: "#F59E0B",
                },
            },
            {
                type: "STATS",
                title: "Platform Analytics",
                order: 2,
                isActive: false,
                content: {
                    stats: [
                        { label: "Active Vendors", value: "1,240+" },
                        { label: "Monthly Orders", value: "50,000+" },
                        { label: "Market Reach", value: "45 Regions" },
                    ],
                },
            },
        ],
    });

    console.log("✅ Seeded 3 StorefrontSection rows:");
    console.log("   #1  HERO   — Hero Banner Display       (active)");
    console.log("   #2  PROMO  — Promotional Strip          (active)");
    console.log("   #3  STATS  — Platform Analytics         (inactive)");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(() => db.$disconnect());
