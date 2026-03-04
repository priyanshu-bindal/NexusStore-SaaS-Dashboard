import * as z from "zod";

export const storeProfileSchema = z.object({
    name: z.string().min(2, "Store name must be at least 2 characters."),
    slug: z
        .string()
        .min(2, "Slug must be at least 2 characters.")
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
    description: z.string().max(500, "Description cannot exceed 500 characters.").optional().nullable(),
    logo: z.string().optional().nullable(),
    banner: z.string().optional().nullable(),
});

export const businessInfoSchema = z.object({
    businessEmail: z.string().email("Invalid email format.").optional().or(z.literal("")),
    phone: z.string().optional().nullable(),
    website: z.union([z.string().url("Invalid URL format."), z.literal("")]).optional().nullable(),
});

export const notificationPrefsSchema = z.object({
    newOrder: z.boolean().default(true),
    lowStock: z.boolean().default(true),
    payoutProcessed: z.boolean().default(true),
});

export type StoreProfileValues = z.infer<typeof storeProfileSchema>;
export type BusinessInfoValues = z.infer<typeof businessInfoSchema>;
export type NotificationPrefsValues = z.infer<typeof notificationPrefsSchema>;
