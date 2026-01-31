
import { PrismaClient } from '../src/generated/client';
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
    console.log('Starting image URL fix...');

    const BROKEN_URL = "photo-1590874102052-8bea0a6cb77c";
    const REPLACEMENT_URL = "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800";

    // Find products with the broken URL in their images array
    const products = await prisma.product.findMany({
        where: {
            images: {
                has: `https://images.unsplash.com/${BROKEN_URL}?auto=format&fit=crop&q=80&w=800`
            }
        }
    });

    console.log(`Found ${products.length} products with broken image.`);

    for (const product of products) {
        const newImages = product.images.map(img =>
            img.includes(BROKEN_URL) ? REPLACEMENT_URL : img
        );

        await prisma.product.update({
            where: { id: product.id },
            data: { images: newImages }
        });
        console.log(`Updated product ${product.id}`);
    }

    console.log('Fix complete.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
