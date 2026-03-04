"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import {
    generalSettingsSchema,
    paymentsSchema,
    shippingSchema,
    securitySchema,
} from "@/lib/validations/settings";

// ─── Shared Helper ──────────────────────────────────────────────────────────────
async function requireStore() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const store = await db.store.findUnique({
        where: { userId: session.user.id },
        include: { user: { select: { id: true, password: true } } },
    });
    if (!store) throw new Error("Store not found.");
    return store;
}

// ─── General Settings ──────────────────────────────────────────────────────────
export async function saveGeneralSettings(data: {
    storeName: string;
    description?: string;
    supportEmail: string;
    phone?: string;
    address?: string;
}) {
    try {
        const store = await requireStore();

        const parsed = generalSettingsSchema.safeParse(data);
        if (!parsed.success) {
            return { error: parsed.error.issues[0].message };
        }

        const { storeName, description, supportEmail, phone, address } = parsed.data;

        // Merge new general config into existing notificationPrefs JSON
        const existingPrefs =
            typeof store.notificationPrefs === "object" && store.notificationPrefs !== null
                ? (store.notificationPrefs as Record<string, unknown>)
                : {};

        await db.store.update({
            where: { id: store.id },
            data: {
                name: storeName,
                description: description || null,
                businessEmail: supportEmail,
                phone: phone || null,
                notificationPrefs: {
                    ...existingPrefs,
                    address: address || null,
                },
            },
        });

        revalidatePath("/settings");
        return { success: true };
    } catch (e: any) {
        console.error("saveGeneralSettings:", e);
        return { error: e.message || "Failed to save general settings." };
    }
}

// ─── Payment Settings ─────────────────────────────────────────────────────────
export async function savePaymentSettings(data: {
    currency: string;
    acceptCreditCard: boolean;
    acceptPaypal: boolean;
    acceptStripe: boolean;
}) {
    try {
        const store = await requireStore();

        const parsed = paymentsSchema.safeParse(data);
        if (!parsed.success) {
            return { error: parsed.error.issues[0].message };
        }

        const existingPrefs =
            typeof store.notificationPrefs === "object" && store.notificationPrefs !== null
                ? (store.notificationPrefs as Record<string, unknown>)
                : {};

        await db.store.update({
            where: { id: store.id },
            data: {
                notificationPrefs: {
                    ...existingPrefs,
                    payments: parsed.data,
                },
            },
        });

        revalidatePath("/settings");
        return { success: true };
    } catch (e: any) {
        console.error("savePaymentSettings:", e);
        return { error: e.message || "Failed to save payment settings." };
    }
}

// ─── Shipping Settings ────────────────────────────────────────────────────────
export async function saveShippingSettings(data: {
    flatRate: number;
    processingTime: string;
}) {
    try {
        const store = await requireStore();

        const parsed = shippingSchema.safeParse(data);
        if (!parsed.success) {
            return { error: parsed.error.issues[0].message };
        }

        const existingPrefs =
            typeof store.notificationPrefs === "object" && store.notificationPrefs !== null
                ? (store.notificationPrefs as Record<string, unknown>)
                : {};

        await db.store.update({
            where: { id: store.id },
            data: {
                notificationPrefs: {
                    ...existingPrefs,
                    shipping: parsed.data,
                },
            },
        });

        revalidatePath("/settings");
        return { success: true };
    } catch (e: any) {
        console.error("saveShippingSettings:", e);
        return { error: e.message || "Failed to save shipping settings." };
    }
}

// ─── Security Settings ────────────────────────────────────────────────────────
export async function saveSecuritySettings(data: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    orderNotificationEmails: boolean;
}) {
    try {
        const store = await requireStore();

        const parsed = securitySchema.safeParse(data);
        if (!parsed.success) {
            return { error: parsed.error.issues[0].message };
        }

        const { currentPassword, newPassword, orderNotificationEmails } = parsed.data;

        const existingPrefs =
            typeof store.notificationPrefs === "object" && store.notificationPrefs !== null
                ? (store.notificationPrefs as Record<string, unknown>)
                : {};

        // Handle password update if requested
        if (newPassword && newPassword.length > 0) {
            const userPassword = store.user.password;
            if (!userPassword) {
                return { error: "Password login is not enabled for this account (OAuth sign-in)." };
            }

            const isValid = await bcrypt.compare(currentPassword!, userPassword);
            if (!isValid) {
                return { error: "Current password is incorrect." };
            }

            const hashedNew = await bcrypt.hash(newPassword, 12);
            await db.user.update({
                where: { id: store.user.id },
                data: { password: hashedNew },
            });
        }

        // Save notification preference
        await db.store.update({
            where: { id: store.id },
            data: {
                notificationPrefs: {
                    ...existingPrefs,
                    orderNotificationEmails,
                },
            },
        });

        revalidatePath("/settings");
        return { success: true };
    } catch (e: any) {
        console.error("saveSecuritySettings:", e);
        return { error: e.message || "Failed to save security settings." };
    }
}
