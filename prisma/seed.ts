import { PrismaClient } from '../src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import "dotenv/config";

// --- Configuration ---
const CATEGORIES = [
    'Shoes', 'Hoodies', 'Jackets', 'Watches', 'Bags',
    'Mice', 'Keyboards', 'Bottles', 'Keychains', 'T-Shirts'
];

const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Silver', 'Gold', 'Grey', 'Orange', 'Navy'];
const ADJECTIVES = ['Premium', 'Urban', 'Classic', 'Sport', 'Minimalist', 'Rugged', 'Smart', 'Vintage', 'Pro', 'Elite'];

// Careful selection of Unsplash IDs to ensure "Realistic Images" for each category
const CATEGORY_IMAGES: Record<string, string[]> = {
    'Shoes': ['photo-1542291026-7eec264c27ff', 'photo-1606107557195-0e29a4b5b4aa', 'photo-1560769629-975ec94e6a86'],
    'Hoodies': ['photo-1556821840-3a63f95609a7', 'photo-1620799140408-ed5341cd2431', 'photo-1578768079052-aa76e52ff62e'],
    'Jackets': ['photo-1551028919-ac6635f0e5c9', 'photo-1591047139829-d91aecb6caea', 'photo-1544022613-e87ca1920295'],
    'Watches': ['photo-1524592094714-0f0654e20314', 'photo-1522312346375-d1a52e2b99b3', 'photo-1523170335258-f5ed11844a49'],
    'Bags': ['photo-1553062407-98eeb64c6a62', 'photo-1590874102052-8bea0a6cb77c', 'photo-1547949003-9792a18a2601'],
    'Mice': ['photo-1527864550417-7fd91fc51a46', 'photo-1615663245857-acda847b8e38', 'photo-1527814050087-3793815479db'],
    'Keyboards': ['photo-1587829741301-dc798b91a603', 'photo-1595225476474-87563907a212', 'photo-1618384887929-16ec33fab9ef'],
    'Bottles': ['photo-1602143407151-0111d1916f16', 'photo-1531102941019-35ed564b18ac', 'photo-1605335616198-d10a2cd9b7c8'],
    'Keychains': ['photo-1584346142345-42cb06a0904d', 'photo-1623939023062-7935496de191', 'photo-1633003290040-4497e684074c'],
    'T-Shirts': ['photo-1521572163474-6864f9cf17ab', 'photo-1576566588028-4147f3842f27', 'photo-1581655353564-df123a1eb820']
};

const getRandomImage = (category: string) => {
    const ids = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['T-Shirts'];
    const id = ids[Math.floor(Math.random() * ids.length)];
    // Standard robust Unsplash formatting
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=800`;
};

// Utils
const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomPrice = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(2);

// --- DB Setup ---
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting Master Seed...');
    const merchantId = process.env.MERCHANT_ID || 'merchant-123';

    // 0. Cleanup (Start Fresh)
    console.log('🧹 Cleaning database...');
    try {
        // Delete in order: Children -> Parents
        try { await prisma.orderItem.deleteMany({}); } catch { } // If model exists
        try { await prisma.order.deleteMany({}); } catch { }      // If model exists
        await prisma.product.deleteMany({});
        await prisma.store.deleteMany({});
        // await prisma.user.deleteMany({ where: { role: 'MERCHANT' } }); // Better to keep the user for stability
    } catch (e) {
        console.warn('Cleanup warning (ignoring):', e);
    }

    // 1. Create Merchant & Store
    console.log('👤 Creating Merchant & Store...');

    // Create/Upsert User
    await prisma.user.upsert({
        where: { id: merchantId },
        update: {},
        create: {
            id: merchantId,
            name: 'Master Merchant',
            email: 'master@nexusstore.com',
            role: 'MERCHANT',
        },
    });

    // Create/Upsert Store
    const store = await prisma.store.upsert({
        where: { userId: merchantId },
        update: { name: "Nexus Official Store" }, // Ensure name is current
        create: {
            name: "Nexus Official Store",
            description: "Premium tech and lifestyle gear.",
            userId: merchantId,
        }
    });
    console.log(`✅ Store verified: ${store.id}`);

    // 2. Generate 200 Products
    console.log('📦 Generating 200 products...');
    const productsToCreate = [];

    // 10 Categories * 20 Products each
    for (const category of CATEGORIES) {
        // We want 20 products per category
        // To achieve variety: 5 distinct "Base Models" per category, each with 4 color variations = 20 items.

        for (let i = 0; i < 5; i++) {
            const adjective = random(ADJECTIVES);
            const baseName = `${adjective} ${category}`; // e.g. "Urban Shoes"

            // Pick 4 unique colors for this base model
            const shuffledColors = [...COLORS].sort(() => 0.5 - Math.random()).slice(0, 4);

            for (const color of shuffledColors) {
                const name = `${baseName} - ${color}`;
                const imageUrl = getRandomImage(category);

                productsToCreate.push({
                    name: name,
                    description: `The ${baseName} in ${color}. Engineered for quality and designed for the modern lifestyle. Valid ${category.toLowerCase()} choice.`,
                    price: randomPrice(25, 250), // Decimal string
                    category: category,
                    stock: randomInt(0, 100), // Random stock for UI testing
                    images: [imageUrl],
                    colors: [color],
                    status: 'ACTIVE',
                    brand: 'Nexus',
                    storeId: store.id,
                    // NO userId here!
                });
            }
        }
    }

    // 3. Insert in Batch
    console.log(`🚀 Inserting ${productsToCreate.length} products...`);

    // createMany is much faster
    try {
        await prisma.product.createMany({
            data: productsToCreate,
            skipDuplicates: true, // Only if ids collide (unlikely since we don't set IDs)
        });
        console.log('✅ Seed successful!');
    } catch (e) {
        console.error('❌ Batch insert failed, trying sequential fallback...');
        console.error(e);
        // Fallback if relation checks fail unexpectedly
        for (const p of productsToCreate) {
            await prisma.product.create({ data: p });
        }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });
