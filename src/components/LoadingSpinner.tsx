'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/40 backdrop-blur-sm"
        >
            <div className="relative flex items-center justify-center h-[50px] w-[50px]">
                {/* Outer Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                    }}
                    className="absolute h-full w-full rounded-full border-4 border-transparent border-t-[#d97706] border-r-[#86efac] border-b-[#d97706] border-l-[#86efac]"
                />

                {/* Inner static or pulsating center (optional, for extra detail) */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="h-2 w-2 rounded-full bg-[#d97706]"
                />
            </div>
        </motion.div>
    );
}
