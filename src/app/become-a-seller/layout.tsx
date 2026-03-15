import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Become a Seller | ShopyStore SaaS Dashboard",
    description: "Start your own online store on ShopyStore. Sign up to sell products, manage inventory, and grow your business today.",
};

export default function BecomeSellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
