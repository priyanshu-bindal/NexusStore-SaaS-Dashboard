"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Lock, Eye, EyeOff, Bell, LogOut, Trash2, AlertTriangle } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { securitySchema, type SecurityValues } from "@/lib/validations/settings";
import { saveSecuritySettings } from "@/actions/store/new-settings-actions";
import { deleteAccount } from "@/actions/store/settings-actions";
import { SuccessModal } from "./SuccessModal";

interface SecurityFormProps { defaultValues: { orderNotificationEmails: boolean }; }

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
    return (
        <button type="button" role="switch" aria-checked={checked} disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${checked ? "bg-amber-600" : "bg-slate-200"}`}
        >
            <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"}`} />
        </button>
    );
}

// ── Password Input ────────────────────────────────────────────────────────────
function PasswordInput({ id, label, placeholder, registration, error }: {
    id: string; label: string; placeholder: string; registration: any; error?: string;
}) {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Lock className="w-4 h-4 text-slate-400" />{label}
            </label>
            <div className="relative">
                <input id={id} type={show ? "text" : "password"} placeholder={placeholder} {...registration}
                    className="w-full px-3 py-2 pr-10 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow"
                />
                <button type="button" onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={show ? "Hide password" : "Show password"}
                >
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

// ── Sign Out Confirmation Modal ───────────────────────────────────────────────
function SignOutModal({ onConfirm, onCancel, isPending }: {
    onConfirm: () => void; onCancel: () => void; isPending: boolean;
}) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm"
                onClick={onCancel}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <LogOut size={18} className="text-slate-600" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Sign Out</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">
                        Are you sure you want to sign out of your dashboard?
                    </p>
                    <div className="flex items-center gap-3 justify-end">
                        <button onClick={onCancel} disabled={isPending}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button onClick={onConfirm} disabled={isPending}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors disabled:opacity-60"
                        >
                            {isPending ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
                            {isPending ? "Signing out…" : "Sign Out"}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteModal({ onConfirm, onCancel, isPending }: {
    onConfirm: () => void; onCancel: () => void; isPending: boolean;
}) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm"
                onClick={onCancel}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start gap-4 mb-4">
                        <div className="size-11 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle size={22} className="text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Delete Account</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Are you sure? This will permanently delete your store, all products, and order history.{" "}
                                <strong className="text-slate-700">This action cannot be undone.</strong>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button onClick={onCancel} disabled={isPending}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >Cancel</button>
                        <button onClick={onConfirm} disabled={isPending}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-60"
                        >
                            {isPending && <Loader2 size={14} className="animate-spin" />}
                            {isPending ? "Deleting…" : "Yes, delete my account"}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function SecurityForm({ defaultValues }: SecurityFormProps) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isSigningOut, startSignOut] = useTransition();
    const [isDeleting, startDelete] = useTransition();

    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<SecurityValues>({
        resolver: zodResolver(securitySchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            orderNotificationEmails: defaultValues.orderNotificationEmails ?? true,
        },
    });

    const onSubmit = async (data: SecurityValues) => {
        const result = await saveSecuritySettings(data);
        if (result.success) setShowSuccess(true);
        else toast.error(result.error || "Error saving settings.");
    };

    const handleSignOutConfirm = () => {
        startSignOut(() => { signOut({ callbackUrl: "/sign-in" }); });
    };

    const handleDeleteConfirm = () => {
        startDelete(async () => {
            const result = await deleteAccount();
            if (result.success) {
                toast.success("Account deleted.");
                await signOut({ callbackUrl: "/sign-in" });
            } else {
                toast.error(result.error || "Failed to delete account.");
                setShowDeleteModal(false);
            }
        });
    };

    return (
        <>
            <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />
            {showSignOutModal && (
                <SignOutModal
                    onConfirm={handleSignOutConfirm}
                    onCancel={() => setShowSignOutModal(false)}
                    isPending={isSigningOut}
                />
            )}
            {showDeleteModal && (
                <DeleteModal
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setShowDeleteModal(false)}
                    isPending={isDeleting}
                />
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-xl font-semibold text-slate-900 mb-1">Security &amp; Account</h2>
                <p className="text-sm text-slate-500 mb-8">Manage your password and communication preferences.</p>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <PasswordInput id="currentPassword" label="Current Password" placeholder="Current password"
                        registration={register("currentPassword")} error={errors.currentPassword?.message} />
                    <PasswordInput id="newPassword" label="New Password" placeholder="Min. 8 characters"
                        registration={register("newPassword")} error={errors.newPassword?.message} />
                    <PasswordInput id="confirmPassword" label="Confirm Password" placeholder="Repeat new password"
                        registration={register("confirmPassword")} error={errors.confirmPassword?.message} />
                </div>

                {/* Notifications */}
                <div className="mb-8">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                        <Bell className="w-4 h-4 text-slate-400" />Notifications
                    </label>
                    <div className="flex items-center justify-between px-4 py-3 border border-slate-200 rounded-lg bg-white hover:border-slate-300 transition-colors">
                        <div>
                            <p className="text-sm font-medium text-slate-800">Order Notification Emails</p>
                            <p className="text-xs text-slate-500 mt-0.5">Receive an email when new orders are placed</p>
                        </div>
                        <Controller name="orderNotificationEmails" control={control}
                            render={({ field }) => <Toggle checked={field.value} onChange={field.onChange} disabled={isSubmitting} />}
                        />
                    </div>
                </div>

                <button type="submit" disabled={isSubmitting}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm mb-8"
                >
                    {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                    {isSubmitting ? "Saving…" : "Save Changes"}
                </button>

                {/* ─── Danger Zone ──────────────────────────────────── */}
                <div className="border border-red-200 rounded-xl bg-red-50/50 p-5 space-y-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-500" />
                        <h3 className="text-sm font-semibold text-red-700">Danger Zone</h3>
                    </div>

                    {/* Sign Out */}
                    <div className="flex items-center justify-between pb-4 border-b border-red-100">
                        <div>
                            <p className="text-sm font-medium text-slate-800">Sign Out</p>
                            <p className="text-xs text-slate-500 mt-0.5">End your current session and return to the login page.</p>
                        </div>
                        <button type="button"
                            onClick={() => setShowSignOutModal(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors flex-shrink-0 ml-6"
                        >
                            <LogOut size={14} />Sign Out
                        </button>
                    </div>

                    {/* Delete Account */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-800">Delete Account</p>
                            <p className="text-xs text-slate-500 mt-0.5">Permanently delete your store and all data. Irreversible.</p>
                        </div>
                        <button type="button" onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm flex-shrink-0 ml-6"
                        >
                            <Trash2 size={14} />Delete Account
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}
