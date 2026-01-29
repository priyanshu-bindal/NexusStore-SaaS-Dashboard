import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string | null | undefined) {
    const value = Number(amount) || 0;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value)
}

export function getStatusStyles(status: string) {
    switch (status.toUpperCase()) {
        case 'PAID':
            return 'bg-blue-50 text-blue-600 border border-blue-100';
        case 'PROCESSING':
            return 'bg-orange-50 text-orange-500 border border-orange-100';
        case 'SHIPPED':
        case 'DELIVERED':
            return 'bg-blue-50 text-blue-500 border border-blue-100';
        case 'CANCELLED':
        case 'REFUNDED':
            return 'bg-red-50 text-red-500 border border-red-100';
        default:
            return 'bg-slate-50 text-slate-500 border border-slate-100';
    }
}

export function getFulfillmentStyles(status: string) {
    switch (status) {
        case 'Fulfilled':
            return 'bg-blue-50 text-blue-600 border border-blue-100';
        case 'Partially Fulfilled':
            return 'bg-sky-50 text-sky-700 border border-sky-100';
        case 'Unfulfilled':
        default:
            return 'bg-orange-50 text-orange-700 border border-orange-100';
    }
}
