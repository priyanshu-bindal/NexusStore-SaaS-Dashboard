"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addAddress(formData: FormData) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return { error: "You must be logged in to add an address" };
    }

    const name = formData.get("name") as string;
    const street = formData.get("street") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const zip = formData.get("zip") as string;
    const country = formData.get("country") as string;
    const phone = formData.get("phone") as string;
    const isDefault = formData.get("isDefault") === "on";

    if (!name || !street || !city || !state || !zip || !country) {
        return { error: "Please fill in all required fields" };
    }

    try {
        if (isDefault) {
            // Unset other default addresses for this user
            await db.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }

        await db.address.create({
            data: {
                userId,
                name,
                street,
                city,
                state,
                zip,
                country,
                phone,
                isDefault,
            },
        });

        revalidatePath("/profile/addresses");
        return { success: true };
    } catch (error) {
        console.error("Failed to add address:", error);
        return { error: "Failed to add address" };
    }
}

export async function updateAddress(addressId: string, formData: FormData) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const street = formData.get("street") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const zip = formData.get("zip") as string;
    const country = formData.get("country") as string;
    const phone = formData.get("phone") as string;
    const isDefault = formData.get("isDefault") === "on";

    if (!name || !street || !city || !state || !zip || !country) {
        return { error: "Please fill in all required fields" };
    }

    try {
        const existingAddress = await db.address.findUnique({
            where: { id: addressId },
        });

        if (!existingAddress || existingAddress.userId !== userId) {
            return { error: "Address not found or unauthorized" };
        }

        if (isDefault) {
            await db.address.updateMany({
                where: { userId, id: { not: addressId } },
                data: { isDefault: false },
            });
        }

        await db.address.update({
            where: { id: addressId },
            data: {
                name,
                street,
                city,
                state,
                zip,
                country,
                phone,
                isDefault,
            },
        });

        revalidatePath("/profile/addresses");
        return { success: true };
    } catch (error) {
        console.error("Failed to update address:", error);
        return { error: "Failed to update address" };
    }
}


export async function deleteAddress(addressId: string) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return { error: "Unauthorized" };
    }

    try {
        // Verify ownership
        const address = await db.address.findUnique({
            where: { id: addressId },
        });

        if (!address || address.userId !== userId) {
            return { error: "Address not found or unauthorized" };
        }

        await db.address.delete({
            where: { id: addressId },
        });

        revalidatePath("/profile/addresses");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete address:", error);
        return { error: "Failed to delete address" };
    }
}

export async function getAddresses() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return [];

    try {
        const addresses = await db.address.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return addresses;
    } catch (error) {
        console.error("Failed to fetch addresses:", error);
        return [];
    }
}
