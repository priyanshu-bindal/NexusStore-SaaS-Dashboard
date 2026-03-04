import { z } from "zod";

// ─── General Store Settings ───────────────────────────────────────────────────
export const generalSettingsSchema = z.object({
    storeName: z.string().min(2, "Store name must be at least 2 characters."),
    description: z
        .string()
        .max(500, "Description cannot exceed 500 characters.")
        .optional()
        .or(z.literal("")),
    supportEmail: z.string().email("Please enter a valid email address."),
    phone: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
});

export type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;

// ─── Payments & Currency ──────────────────────────────────────────────────────
export const paymentsSchema = z.object({
    currency: z.enum(["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD"], {
        message: "Please select a valid currency.",
    }),
    acceptCreditCard: z.boolean(),
    acceptPaypal: z.boolean(),
    acceptStripe: z.boolean(),
});

export type PaymentsValues = z.infer<typeof paymentsSchema>;

// ─── Shipping ─────────────────────────────────────────────────────────────────
export const shippingSchema = z.object({
    flatRate: z
        .number({ error: "Please enter a valid shipping rate." })
        .min(0, "Shipping rate cannot be negative.")
        .max(999, "Shipping rate seems too high."),
    processingTime: z.enum(
        ["same_day", "1_2_days", "3_5_days", "1_2_weeks"],
        { message: "Select a valid processing time." }
    ),
});

export type ShippingValues = z.infer<typeof shippingSchema>;

// ─── Security ─────────────────────────────────────────────────────────────────
export const securitySchema = z
    .object({
        currentPassword: z.string().optional().or(z.literal("")),
        newPassword: z.string().optional().or(z.literal("")),
        confirmPassword: z.string().optional().or(z.literal("")),
        orderNotificationEmails: z.boolean(),
    })
    .refine(
        (data) => {
            if (data.newPassword && data.newPassword.length > 0) {
                return data.newPassword === data.confirmPassword;
            }
            return true;
        },
        { message: "Passwords do not match.", path: ["confirmPassword"] }
    )
    .refine(
        (data) => {
            if (data.newPassword && data.newPassword.length > 0) {
                return !!data.currentPassword && data.currentPassword.length > 0;
            }
            return true;
        },
        { message: "Current password is required to set a new password.", path: ["currentPassword"] }
    )
    .refine(
        (data) => {
            if (data.newPassword && data.newPassword.length > 0) {
                return data.newPassword.length >= 8;
            }
            return true;
        },
        { message: "New password must be at least 8 characters.", path: ["newPassword"] }
    );

export type SecurityValues = z.infer<typeof securitySchema>;
