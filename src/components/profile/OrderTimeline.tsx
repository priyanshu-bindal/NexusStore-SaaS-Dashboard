"use client";

import { motion } from "framer-motion";
import { Check, Truck, Package, X, ClipboardList, CheckCircle2 } from "lucide-react";

interface OrderTimelineProps {
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export function OrderTimeline({ status, createdAt, updatedAt }: OrderTimelineProps) {
    // Helper to format date and time
    const formatDateTime = (d: Date) => {
        return new Date(d).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    };

    let steps: {
        label: string;
        completed: boolean;
        current?: boolean;
        date: Date | null;
        icon: any;
    }[] = [
            {
                label: "ORDER PLACED",
                completed: true,
                date: createdAt,
                icon: ClipboardList
            },
            {
                label: "PROCESSING",
                completed: ["SHIPPED", "DELIVERED"].includes(status),
                date: status === "SHIPPED" || status === "DELIVERED" ? updatedAt : null,
                icon: Package
            },
            {
                label: "IN TRANSIT",
                completed: ["SHIPPED", "DELIVERED"].includes(status),
                current: status === "SHIPPED",
                date: null,
                icon: Truck
            },
            {
                label: "DELIVERED",
                completed: status === "DELIVERED",
                date: status === "DELIVERED" ? updatedAt : null,
                icon: CheckCircle2
            }
        ];

    // If cancelled, override steps to show simple Placed -> Cancelled flow
    if (status === "CANCELLED") {
        steps = [
            {
                label: "Order Placed",
                completed: true,
                date: createdAt,
                icon: ClipboardList
            },
            {
                label: "Cancelled",
                completed: true,
                current: false,
                date: updatedAt,
                icon: X
            }
        ];
    }

    const currentStepIndex = steps.reduce((acc, step, idx) => step.completed || step.current ? idx : acc, 0);
    const progress = (currentStepIndex / (steps.length - 1)) * 100;

    return (
        <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-8">Order Status</h3>
                <div className="relative px-2 md:h-24">
                    {/* Fixed Height Wrapper for Desktop to prevent collapsing */}

                    {/* Background Line - Fixed Top Position (20px = center of 40px icon) */}
                    <div className="absolute left-0 top-5 -translate-y-1/2 w-full h-[2px] bg-slate-100 rounded-full -z-0 hidden md:block"></div>
                    <div className="absolute left-[19px] top-0 h-full w-[2px] bg-slate-100 rounded-full -z-0 md:hidden"></div>

                    {/* Animated Progress Line */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                        className={`absolute left-0 top-5 -translate-y-1/2 h-[2px] rounded-full -z-0 hidden md:block origin-left ${status === "CANCELLED" ? "bg-red-500" : "bg-[#2563eb]"
                            }`}
                    />
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                        className={`absolute left-[19px] top-0 w-[2px] rounded-full -z-0 md:hidden origin-top ${status === "CANCELLED" ? "bg-red-500" : "bg-[#2563eb]"
                            }`}
                    />

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-10 md:gap-0 relative z-10">
                        {steps.map((step, idx) => {
                            const isCompleted = step.completed;
                            const isCurrent = step.current; // Defined in step object now
                            const isActive = isCompleted || isCurrent;
                            const isCancelledStep = status === "CANCELLED" && idx === steps.length - 1;

                            // Default: Future Step
                            let bgClass = "bg-white border-slate-200 text-slate-200";

                            // Active State (Completed or Current)
                            if (isActive) {
                                // Default Blue for active steps
                                bgClass = "bg-[#2563eb] border-[#2563eb] text-white shadow-md shadow-blue-500/20";

                                // Special Green for Delivered step
                                if (step.label === "DELIVERED") {
                                    bgClass = "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30";
                                    if (isCurrent) {
                                        bgClass += " ring-4 ring-emerald-50";
                                    }
                                }
                            }

                            if (isCancelledStep) {
                                bgClass = "bg-red-100 border-red-100 text-red-600 ring-4 ring-red-50";
                            }

                            // Determine position classes based on index
                            let positionClass = "md:left-1/2 md:-translate-x-1/2 md:text-center"; // Default Middle
                            if (idx === 0) {
                                positionClass = "md:left-[-10px] md:translate-x-0 md:text-left"; // Start (offset slightly to align with circle center visually if needed, but 0 is safe)
                            } else if (idx === steps.length - 1) {
                                positionClass = "md:right-[-10px] md:left-auto md:translate-x-0 md:text-right"; // End
                            }

                            return (
                                <div key={idx} className="flex md:flex-col items-center md:items-center gap-4 md:gap-2 relative w-full md:w-auto">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.1 + (idx * 0.2) }}
                                        className={`size-10 rounded-full flex items-center justify-center shrink-0 border-[3px] transition-all duration-500 z-10 ${bgClass}`}
                                    >
                                        <step.icon size={18} strokeWidth={3} />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + (idx * 0.2) }}
                                        className={`md:absolute md:top-14 w-full md:w-40 text-left md:text-center pl-0 md:pl-0 ${positionClass}`}
                                    >
                                        <p className={`text-[11px] font-extrabold uppercase tracking-wider ${step.label === "DELIVERED" && isActive ? "text-emerald-600" : isCurrent ? "text-[#2563eb]" : isCancelledStep ? "text-red-600" : isCompleted ? "text-slate-900" : "text-slate-300"}`}>
                                            {step.label}
                                        </p>
                                    </motion.div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
