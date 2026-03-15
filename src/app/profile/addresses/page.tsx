import { getAddresses, deleteAddress } from "@/actions/addresses";
import { Plus, MapPin, Trash2, Phone, Check } from "lucide-react";
import { AddAddressModal } from "@/components/profile/AddAddressModal";
import { ClientAddressWrapper } from "./ClientAddressWrapper";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export const dynamic = "force-dynamic";

async function AddressesContent() {
    const addresses = await getAddresses();

    const formattedAddresses = addresses.map((address) => ({
        id: address.id,
        name: address.name,
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
        phone: address.phone,
        isDefault: address.isDefault,
    }));

    return (
        <div className="max-w-full">
            <ClientAddressWrapper initialAddresses={formattedAddresses} />
        </div>
    );
}

export default function AddressesPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <AddressesContent />
        </Suspense>
    );
}
