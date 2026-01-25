import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';

const connectionString = process.env.DATABASE_URL;

const prismaClientSingleton = () => {
    // 1. Create a standard PostgreSQL connection pool
    const pool = new Pool({ connectionString });

    // 2. Wrap it in the Prisma Adapter
    const adapter = new PrismaPg(pool);

    // 3. Pass the adapter to the constructor as requested by the error
    return new PrismaClient({ adapter });
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const db = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

