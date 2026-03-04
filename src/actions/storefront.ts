"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SectionContent } from "@/types/storefront";

// ── Auth helper ────────────────────────────────────────────────────────────────
async function requireAdmin() {
    const session = await auth();
    if (!session?.user) redirect("/sign-in");
    if ((session.user as any).role !== "ADMIN") redirect("/sign-in");
    return session;
}

// ── Fetch all sections ordered by position ─────────────────────────────────────
export async function getSections() {
    return db.storefrontSection.findMany({
        orderBy: { order: "asc" },
    });
}

// ── Create a new section ───────────────────────────────────────────────────────
export async function createStorefrontSection(type: string) {
    await requireAdmin();

    const all = await getSections();
    const maxOrder = all.length > 0 ? Math.max(...all.map((s: { order: number }) => s.order)) : -1;

    const newSection = await db.storefrontSection.create({
        data: {
            type,
            title: `New ${type.replace(/_/g, " ")}`,
            order: maxOrder + 1,
            isActive: false, // Default to inactive so it doesn't break the live site
            content: {}, // Start with empty content
        },
    });

    revalidatePath("/admin/storefront");
    revalidatePath("/");
    revalidatePath("/shop");
    return { success: true, section: newSection };
}

// ── Update JSON content of a section ──────────────────────────────────────────
export async function updateSectionContent(
    id: string,
    content: SectionContent
) {
    await requireAdmin();

    await db.storefrontSection.update({
        where: { id },
        data: { content: content as any },
    });

    revalidatePath("/");
    revalidatePath("/shop");
    return { success: true };
}

// ── Toggle isActive boolean ────────────────────────────────────────────────────
export async function toggleSectionStatus(id: string) {
    await requireAdmin();

    const section = await db.storefrontSection.findUniqueOrThrow({ where: { id } });

    await db.storefrontSection.update({
        where: { id },
        data: { isActive: !section.isActive },
    });

    revalidatePath("/");
    revalidatePath("/shop");
    return { success: true, isActive: !section.isActive };
}

// ── Reorder a section (swap with adjacent) ────────────────────────────────────
export async function reorderSection(id: string, direction: "up" | "down") {
    await requireAdmin();

    const all = await db.storefrontSection.findMany({ orderBy: { order: "asc" } });
    const idx = all.findIndex((s: { id: string }) => s.id === id);

    if (direction === "up" && idx === 0) return { success: false };
    if (direction === "down" && idx === all.length - 1) return { success: false };

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const current = all[idx];
    const swapWith = all[swapIdx];

    await db.$transaction([
        db.storefrontSection.update({
            where: { id: current.id },
            data: { order: swapWith.order },
        }),
        db.storefrontSection.update({
            where: { id: swapWith.id },
            data: { order: current.order },
        }),
    ]);

    revalidatePath("/");
    revalidatePath("/shop");
    return { success: true };
}
