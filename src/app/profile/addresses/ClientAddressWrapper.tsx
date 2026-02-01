"use client";

import { useState } from "react";
import { Plus, MapPin, Trash2, Phone, Check } from "lucide-react";
import { AddAddressModal } from "@/components/profile/AddAddressModal";
import { DeleteAddressModal } from "@/components/profile/DeleteAddressModal";
import { deleteAddress } from "@/actions/addresses";

type Address = {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string | null;
    isDefault: boolean;
};

export function ClientAddressWrapper({ initialAddresses }: { initialAddresses: Address[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEditClick = (address: Address) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleAddNewClick = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setAddressToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!addressToDelete) return;
        setIsDeleting(true);
        try {
            await deleteAddress(addressToDelete);
            setDeleteModalOpen(false);
            setAddressToDelete(null);
        } catch (error) {
            console.error("Failed to delete address:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-slate-900 text-3xl font-black leading-tight tracking-[-0.033em]">My Addresses</h1>
                        <p className="text-slate-500 text-base font-normal mt-1">Manage your shipping addresses and delivery preferences</p>
                    </div>
                    <button
                        onClick={handleAddNewClick}
                        className="flex items-center gap-2 bg-[#f0f9ff] text-[#0ea5e9] hover:bg-[#e0f2fe] px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
                    >
                        <Plus size={18} strokeWidth={3.5} />
                        Add New Address
                    </button>
                </div>
            </div>

            {initialAddresses.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
                    <div className="bg-slate-50 p-4 rounded-full mb-4">
                        <MapPin className="size-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No addresses saved</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-6">Add a shipping address to speed up your checkout process.</p>
                    <button
                        onClick={handleAddNewClick}
                        className="bg-[#1a1a1a] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors"
                    >
                        Add Your First Address
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {initialAddresses.map((address) => (
                        <div key={address.id} className={`group relative bg-white rounded-2xl p-6 border transition-all ${address.isDefault ? 'border-[#2563eb] shadow-sm ring-1 ring-[#2563eb]/10' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}>
                            {address.isDefault && (
                                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#eff6ff] text-[#2563eb] px-3 py-1 rounded-full text-xs font-bold">
                                    <Check size={12} strokeWidth={3} />
                                    Default
                                </div>
                            )}

                            <div className="mb-4">
                                <h3 className="font-bold text-slate-900 text-lg">{address.name}</h3>
                                {address.phone && (
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                        <Phone size={14} />
                                        {address.phone}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1 text-slate-600 text-sm leading-relaxed mb-6">
                                <p>{address.street}</p>
                                <p>{address.city}, {address.state} {address.zip}</p>
                                <p>{address.country === 'US' ? 'United States' : address.country}</p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <button
                                    onClick={() => handleEditClick(address)}
                                    className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(address.id)}
                                    className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors p-2 -mr-2 rounded-lg hover:bg-red-50"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddAddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingAddress}
            />

            <DeleteAddressModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </>
    );
}
