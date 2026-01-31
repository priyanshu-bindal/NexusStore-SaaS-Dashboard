import { defineConfig } from 'prisma/config';
import 'dotenv/config'; // Ensure env vars are loaded

export default defineConfig({
    schema: 'prisma/schema.prisma',
    datasource: {
        url: process.env.DIRECT_URL, // Use Direct URL for migrations
    },
});
