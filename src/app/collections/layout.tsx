import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Curated Product Collections | ShopyStore",
    description: "Explore our hand-picked collections of top quality products from independent sellers.",
};
export const revalidate = 3600;
export default function CollectionsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
