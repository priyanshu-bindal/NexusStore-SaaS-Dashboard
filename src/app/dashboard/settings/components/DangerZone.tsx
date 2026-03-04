"use client";

import { useState, useTransition } from "react";
import { deactivateStore, deleteAccount } from "@/actions/store/settings-actions";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DangerZoneProps {
    store: {
        id: string;
        name: string;
    };
}

export function DangerZone({ store }: DangerZoneProps) {
    const [isPendingDeactivate, startTransitionDeactivate] = useTransition();
    const [isPendingDelete, startTransitionDelete] = useTransition();
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    const handleDeactivate = () => {
        startTransitionDeactivate(async () => {
            const result = await deactivateStore();
            if (result.success) {
                toast.success("Store deactivated successfully.");
                setShowDeactivateModal(false);
            } else {
                toast.error(result.error || "Failed to deactivate store.");
            }
        });
    };

    const handleDelete = () => {
        startTransitionDelete(async () => {
            const result = await deleteAccount();
            if (result.success) {
                toast.success("Account deleted. You will be redirected.");
                // We handle standard redirect or NextAuth sign out depending on global setup
                window.location.href = "/";
            } else {
                toast.error(result.error || "Failed to delete account.");
            }
        });
    };

    return (
        <div className="space-y-6 max-w-2xl border-2 border-red-500 rounded-lg p-6 bg-red-50/30">
            <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                    <h3 className="text-lg font-bold text-red-800">Danger Zone</h3>
                    <p className="text-sm text-red-600">These actions are destructive and cannot be easily undone.</p>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-red-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900">Deactivate Store</h4>
                        <p className="text-sm text-gray-500">Suspend your store from public view without deleting your data.</p>
                    </div>
                    <button
                        onClick={() => setShowDeactivateModal(true)}
                        className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 font-medium whitespace-nowrap"
                    >
                        Deactivate Store
                    </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-red-200">
                    <div>
                        <h4 className="font-medium text-gray-900">Delete Account & Store</h4>
                        <p className="text-sm text-gray-500">Permanently delete your account, store, products, and all associated data.</p>
                    </div>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium whitespace-nowrap"
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Deactivate Modal */}
            {showDeactivateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
                        <h3 className="text-lg font-bold">Deactivate Store?</h3>
                        <p className="text-sm text-gray-500">
                            Are you sure you want to deactivate your store? Your products will no longer be visible to customers.
                        </p>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                disabled={isPendingDeactivate}
                                onClick={() => setShowDeactivateModal(false)}
                                className="px-4 py-2 border rounded-md hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isPendingDeactivate}
                                onClick={handleDeactivate}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium flex items-center"
                            >
                                {isPendingDeactivate ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Yes, Deactivate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
                        <h3 className="text-lg font-bold text-red-600">Permanently Delete Account?</h3>
                        <p className="text-sm text-gray-700">
                            This action <strong>cannot</strong> be undone. This will permanently delete your store,
                            products, orders, and user account.
                        </p>

                        <div className="space-y-2 pt-2">
                            <label className="text-sm font-medium">
                                Please type <strong className="select-none">{store.name}</strong> to confirm.
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder={store.name}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                disabled={isPendingDelete}
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmText("");
                                }}
                                className="px-4 py-2 border rounded-md hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isPendingDelete || deleteConfirmText !== store.name}
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center"
                            >
                                {isPendingDelete ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Permanently Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
