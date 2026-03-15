import { redirect } from "next/navigation";
import OrderSuccessContent from "./CheckoutSuccessClient";

export default async function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const orderId = params.orderId as string | undefined;

    if (!orderId) {
        redirect("/shop");
    }

    return <OrderSuccessContent orderId={orderId} />;
}
