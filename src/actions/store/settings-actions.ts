"use server";

import { db } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/auth";
import {
    businessInfoSchema,
    notificationPrefsSchema,
    storeProfileSchema,
} from "@/lib/validations/store";

async function requireStoreOwnership() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const store = await db.store.findUnique({
        where: { userId: session.user.id },
    });

    if (!store) {
        throw new Error("Store not found");
    }

    return store;
}

export async function updateStoreProfile(prevState: unknown, formData: FormData) {
    try {
        const store = await requireStoreOwnership();

        const raw = {
            name: formData.get("name") as string,
            slug: formData.get("slug") as string,
            description: formData.get("description") as string | null,
            logo: formData.get("logo") as string | null,
            banner: formData.get("banner") as string | null,
        };

        const validated = storeProfileSchema.safeParse(raw);
        if (!validated.success) {
            return { error: validated.error.issues[0].message };
        }

        if (validated.data.slug !== store.slug) {
            const existingSlug = await db.store.findUnique({
                where: { slug: validated.data.slug },
            });
            if (existingSlug) {
                return { error: "This store slug is already taken." };
            }
        }

        await db.store.update({
            where: { id: store.id },
            data: validated.data,
        });

        revalidatePath("/dashboard/settings");
        revalidateTag(`store-${store.id}`);

        return { success: true };
    } catch (error: any) {
        console.error("updateStoreProfile error:", error);
        return { error: error.message || "Failed to update store profile." };
    }
}

export async function updateBusinessInfo(prevState: unknown, formData: FormData) {
    try {
        const store = await requireStoreOwnership();

        const raw = {
            businessEmail: formData.get("businessEmail") as string | null,
            phone: formData.get("phone") as string | null,
            website: formData.get("website") as string | null,
        };

        const validated = businessInfoSchema.safeParse(raw);
        if (!validated.success) {
            return { error: validated.error.issues[0].message };
        }

        await db.store.update({
            where: { id: store.id },
            data: validated.data,
        });

        revalidatePath("/dashboard/settings");

        return { success: true };
    } catch (error: any) {
        console.error("updateBusinessInfo error:", error);
        return { error: error.message || "Failed to update business info." };
    }
}

export async function updateNotificationPrefs(storeId: string, prefs: any) {
    try {
        const store = await requireStoreOwnership();

        // Ensure the user actually owns the store they are trying to update
        if (store.id !== storeId) {
            return { error: "Unauthorized" };
        }

        const validated = notificationPrefsSchema.safeParse(prefs);
        if (!validated.success) {
            return { error: validated.error.issues[0].message };
        }

        await db.store.update({
            where: { id: store.id },
            data: { notificationPrefs: validated.data },
        });

        revalidatePath("/dashboard/settings");

        return { success: true };
    } catch (error: any) {
        console.error("updateNotificationPrefs error:", error);
        return { error: error.message || "Failed to update notification preferences." };
    }
}

export async function deleteAccount() {
    try {
        const store = await requireStoreOwnership();

        // Use Prisma transaction: Delete Store, then User
        await db.$transaction([
            db.store.delete({
                where: { id: store.id },
            }),
            db.user.delete({
                where: { id: store.userId },
            }),
        ]);

        // Will probably need to log the user out on the client side after this
        return { success: true };
    } catch (error: any) {
        console.error("deleteAccount error:", error);
        return { error: error.message || "Failed to delete account." };
    }
}

export async function deactivateStore() {
    try {
        const store = await requireStoreOwnership();

        await db.store.update({
            where: { id: store.id },
            data: { status: "SUSPENDED" }
        });

        revalidatePath("/dashboard/settings");

        return { success: true };
    } catch (error: any) {
        console.error("deactivateStore error:", error);
        return { error: error.message || "Failed to deactivate store." };
    }
}
