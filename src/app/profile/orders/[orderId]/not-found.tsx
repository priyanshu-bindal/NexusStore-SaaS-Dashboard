import Link from "next/link";
import { CopyX, Package, ArrowLeft } from "lucide-react";

export default function OrderNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <div className="size-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
            <CopyX size={40} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
          Order Not Found
        </h1>
        <p className="text-slate-500 mb-8">
          We couldn't find the details for this order. It might belong to another account or the order ID is incorrect.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row justify-center">
          <Link
            href="/profile/orders"
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
          >
            <Package size={18} />
            View My Orders
          </Link>
          <Link 
            href="/shop"
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft size={18} />
            Return to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
