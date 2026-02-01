import { useFormStatus } from "react-dom";
import { X } from "lucide-react";
import { addAddress, updateAddress } from "@/actions/addresses";

type AddressData = {
    id?: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string | null;
    isDefault: boolean;
};

export function AddAddressModal({
    isOpen,
    onClose,
    initialData
}: {
    isOpen: boolean;
    onClose: () => void;
    initialData?: AddressData | null;
}) {
    if (!isOpen) return null;

    const isEditing = !!initialData;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-900">
                        {isEditing ? "Edit Address" : "Add New Address"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form action={async (formData) => {
                        let result;
                        if (isEditing && initialData?.id) {
                            result = await updateAddress(initialData.id, formData);
                        } else {
                            result = await addAddress(formData);
                        }

                        if (result?.error) {
                            alert(result.error);
                        } else {
                            onClose();
                        }
                    }}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900">Recipient Full Name</label>
                                <input
                                    name="name"
                                    defaultValue={initialData?.name}
                                    required
                                    placeholder="e.g. Alex Morgan"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] outline-none transition-all text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900">Street Address</label>
                                <input
                                    name="street"
                                    defaultValue={initialData?.street}
                                    required
                                    placeholder="House number and street name"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] outline-none transition-all text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-900">City</label>
                                    <input
                                        name="city"
                                        defaultValue={initialData?.city}
                                        required
                                        placeholder="e.g. New York"
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] outline-none transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-900">Postal / Zip Code</label>
                                    <input
                                        name="zip"
                                        defaultValue={initialData?.zip}
                                        required
                                        placeholder="e.g. 10029"
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-900">Country</label>
                                    <div className="relative">
                                        <select
                                            name="country"
                                            defaultValue={initialData?.country || ""}
                                            required
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] outline-none transition-all text-sm appearance-none"
                                        >
                                            <option value="">Select Country</option>
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-900">State / Province</label>
                                    <div className="relative">
                                        <select
                                            name="state"
                                            defaultValue={initialData?.state || ""}
                                            required
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] outline-none transition-all text-sm appearance-none"
                                        >
                                            <option value="">Select State</option>
                                            <option value="NY">New York</option>
                                            <option value="CA">California</option>
                                            <option value="TX">Texas</option>
                                            <option value="FL">Florida</option>
                                            <option value="IL">Illinois</option>
                                            <option value="PA">Pennsylvania</option>
                                            <option value="OH">Ohio</option>
                                            <option value="GA">Georgia</option>
                                            <option value="NC">North Carolina</option>
                                            <option value="MI">Michigan</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900">Phone Number</label>
                                <input
                                    name="phone"
                                    defaultValue={initialData?.phone || ""}
                                    placeholder="(555) 000-0000"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] outline-none transition-all text-sm"
                                />
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isDefault"
                                        defaultChecked={initialData?.isDefault}
                                        className="peer sr-only"
                                    />
                                    <div className="h-5 w-5 bg-white border-2 border-slate-300 rounded peer-checked:bg-[#2563eb] peer-checked:border-[#2563eb] transition-all"></div>
                                    <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Set as default shipping address</span>
                            </label>

                            <div className="pt-4 flex gap-3">
                                <SubmitButton isEditing={isEditing} />
                                <button type="button" onClick={onClose} className="flex-1 py-3 px-6 bg-white border border-slate-200 text-slate-900 font-bold rounded-lg hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex-1 py-3 px-6 bg-[#1a1a1a] text-white font-bold rounded-lg hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {pending ? (
                <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isEditing ? "Updating..." : "Saving..."}
                </>
            ) : (
                isEditing ? "Update Address" : "Save Address"
            )}
        </button>
    );
}
