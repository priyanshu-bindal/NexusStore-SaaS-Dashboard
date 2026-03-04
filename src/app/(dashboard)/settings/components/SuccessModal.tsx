"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessModalProps {
    show: boolean;
    onClose: () => void;
    message?: string;
}

export function SuccessModal({ show, onClose, message = "Your changes have been saved." }: SuccessModalProps) {
    // Auto-close after 2.5 s
    useEffect(() => {
        if (!show) return;
        const t = setTimeout(onClose, 2500);
        return () => clearTimeout(t);
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 24 }}
                        className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center w-80 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Animated checkmark SVG */}
                        <svg
                            className="w-16 h-16 text-green-500 mb-4"
                            viewBox="0 0 52 52"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Circle */}
                            <motion.circle
                                cx="26"
                                cy="26"
                                r="24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                pathLength="1"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.45, ease: "easeOut" }}
                            />
                            {/* Checkmark path */}
                            <motion.path
                                d="M14 27 L22 35 L38 19"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.35, delay: 0.35, ease: "easeOut" }}
                            />
                        </svg>

                        <h3 className="text-xl font-bold text-slate-900">Success!</h3>
                        <p className="text-sm text-slate-500 mt-2">{message}</p>

                        {/* Progress bar */}
                        <div className="mt-5 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-green-400 rounded-full"
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 2.5, ease: "linear" }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
