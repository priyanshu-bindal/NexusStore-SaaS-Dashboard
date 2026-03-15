import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Get Started | Launch Your ShopyStore",
    description: "Launch your storefront in minutes. Sign up for a ShopyStore plan and get access to robust dashboard analytics and tools.",
};

export default function GetStartedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
