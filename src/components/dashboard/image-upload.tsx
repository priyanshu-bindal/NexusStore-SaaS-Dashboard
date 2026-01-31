"use client";

import { UploadButton } from "@/utils/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    onRemove: (value: string) => void;
}

export const ImageUpload = ({ value = [], onChange, onRemove }: ImageUploadProps) => {
    return (
        <div className="w-full">
            {/* 1. Preview Grid - Shows images cleanly */}
            {value.length > 0 ? (
                <div className="mb-4 grid grid-cols-3 gap-4">
                    {value.map((url) => (
                        <div key={url} className="relative aspect-square w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                            <div className="z-10 absolute top-2 right-2">
                                <button
                                    type="button"
                                    onClick={() => onRemove(url)}
                                    className="bg-black/50 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <Image fill className="object-cover" alt="Product Image" src={url} />
                        </div>
                    ))}
                </div>
            ) : null}

            {/* 2. The Upload Zone - Using UploadButton for reliable click handling without global CSS */}
            <div className="flex items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-xl p-8 h-64">
                <UploadButton
                    endpoint="productImage"
                    onClientUploadComplete={(res) => {
                        const newUrls = res.map((r) => r.url);
                        onChange([...value, ...newUrls]);
                        toast.success("Images added!");
                    }}
                    onUploadError={(error: Error) => {
                        toast.error(`Upload failed: ${error.message}`);
                    }}
                    appearance={{
                        button: "bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm",
                        allowedContent: "text-slate-400 text-xs mt-2"
                    }}
                    content={{
                        button: "Choose Files",
                        allowedContent: "Max 4 images (4MB each)"
                    }}
                />
            </div>
        </div>
    );
};
