import { headers } from "next/headers";
import { db } from "./db";
import crypto from "crypto";

export async function trackVisit() {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";

    // 1. Prevent Prefetching from counting as a visit
    // Next.js sends 'Next-Router-Prefetch' or 'purpose: prefetch' headers
    const isPrefetch = headerList.get("next-router-prefetch") || headerList.get("purpose") === "prefetch";
    if (isPrefetch) return;

    // 2. Simple hash for privacy
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    // 3. Define the start of the current day (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 4. Check if a visit from this hash exists for TODAY
    // This prevents incrementing the counter on page refreshes or navigations within the same session
    const existingVisit = await db.visit.findFirst({
        where: {
            ipHash: ipHash,
            createdAt: {
                gte: today
            }
        },
        select: { id: true }
    });

    // 5. Only create if no match found
    if (!existingVisit) {
        await db.visit.create({
            data: { ipHash }
        });
    }
}
