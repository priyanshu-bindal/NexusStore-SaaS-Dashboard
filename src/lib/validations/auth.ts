import { z } from "zod";

export const merchantRegistrationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    description: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Error shows on the confirmPassword field
});

export type MerchantRegistrationInput = z.infer<typeof merchantRegistrationSchema>;
