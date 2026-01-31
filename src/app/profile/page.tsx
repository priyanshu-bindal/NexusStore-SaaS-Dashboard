"use client";

import { useSession } from "next-auth/react";
import { Edit2 } from "lucide-react";

export default function ProfilePage() {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <>
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-slate-900 text-3xl font-black leading-tight tracking-[-0.033em]">My Profile</h1>
                <p className="text-slate-500 text-base font-normal">Manage your personal information and account preferences</p>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-8">
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-xl font-bold text-slate-900 mb-1">{user?.name || "Guest User"}</h2>
                        <p className="text-slate-500 text-sm mb-4">{user?.email}</p>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            Platinum Member
                        </span>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <button className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">First Name</label>
                            <div className="text-slate-900 font-medium text-base py-1 border-b border-slate-100">
                                {user?.name?.split(" ")[0] || "—"}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Last Name</label>
                            <div className="text-slate-900 font-medium text-base py-1 border-b border-slate-100">
                                {user?.name?.split(" ").slice(1).join(" ") || "—"}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email Address</label>
                            <div className="text-slate-900 font-medium text-base py-1 border-b border-slate-100">
                                {user?.email}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Phone Number</label>
                            <div className="text-slate-900 font-medium text-base py-1 border-b border-slate-100">
                                +1 (555) 123-4567
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Preferences */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Email Preferences</h3>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h4 className="text-base font-semibold text-slate-900 mb-1">Marketing Newsletter</h4>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <p className="text-slate-500 text-sm max-w-2xl">Receive updates about new products, special offers, and upcoming sales events directly to your inbox.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-start">
                <button className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors">
                    Delete Account
                </button>
            </div>
        </>
    );
}
