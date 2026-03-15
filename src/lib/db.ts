import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    return new PrismaClient();
};

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

