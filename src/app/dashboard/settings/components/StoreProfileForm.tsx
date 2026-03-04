"use client";

import { useActionState, useEffect, useState } from "react";
import { updateStoreProfile } from "@/actions/store/settings-actions";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface StoreProfileFormProps {
    store: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logo: string | null;
        banner: string | null;
    };
}

export function StoreProfileForm({ store }: StoreProfileFormProps) {
    const [state, formAction, isPending] = useActionState(updateStoreProfile, null);
    const [logoUrl, setLogoUrl] = useState<string | null>(store.logo);
    const [bannerUrl, setBannerUrl] = useState<string | null>(store.banner);
    const [descChars, setDescChars] = useState(store.description?.length || 0);

    useEffect(() => {
        if (state?.success) {
            toast.success("Store profile updated successfully!");
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form action={formAction} className="space-y-6 max-w-2xl">
            <div>
                <h3 className="text-lg font-medium">Store Profile</h3>
                <p className="text-sm text-gray-500">Update your store identity and visual assets.</p>
            </div>

            <div className="grid gap-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Store Name</label>
                    <input
                        id="name"
                        name="name"
                        defaultValue={store.name}
                        required
                        minLength={2}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="slug" className="text-sm font-medium">Store Slug</label>
                    <input
                        id="slug"
                        name="slug"
                        defaultValue={store.slug}
                        required
                        pattern="[a-z0-9-]+"
                        title="Only lowercase letters, numbers, and hyphens"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">nexusstore.com/shop/<strong>{store.slug}</strong></p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Store Description</label>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={store.description || ""}
                        maxLength={500}
                        rows={4}
                        onChange={(e) => setDescChars(e.target.value.length)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 text-right">{descChars}/500</p>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Store Logo</label>
                        <input type="hidden" name="logo" value={logoUrl || ""} />
                        <div className="flex items-center gap-4">
                            {logoUrl ? (
                                <div className="h-20 w-20 relative rounded-full overflow-hidden border">
                                    <Image src={logoUrl} alt="Logo" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="h-20 w-20 rounded-full border border-dashed flex items-center justify-center bg-gray-50 text-gray-400">
                                    Logo
                                </div>
                            )}
                            <UploadButton
                                endpoint="storeImage"
                                onClientUploadComplete={(res) => {
                                    setLogoUrl(res[0].url);
                                    toast.success("Logo uploaded!");
                                }}
                                onUploadError={(error) => { toast.error(`Error: ${error.message}`); }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Store Banner</label>
                        <input type="hidden" name="banner" value={bannerUrl || ""} />
                        <div className="space-y-2">
                            {bannerUrl ? (
                                <div className="w-full h-32 relative rounded-md overflow-hidden border">
                                    <Image src={bannerUrl} alt="Banner" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-full h-32 rounded-md border border-dashed flex items-center justify-center bg-gray-50 text-gray-400">
                                    Banner Image
                                </div>
                            )}
                            <UploadButton
                                endpoint="storeImage"
                                onClientUploadComplete={(res) => {
                                    setBannerUrl(res[0].url);
                                    toast.success("Banner uploaded!");
                                }}
                                onUploadError={(error) => { toast.error(`Error: ${error.message}`); }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {isPending ? "Saving..." : "Save Profile"}
                </button>
            </div>
        </form>
    );
}
