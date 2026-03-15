import Link from "next/link";
import { PackageX, ShoppingBag, ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <div className="size-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
            <PackageX size={40} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
          Product Not Found
        </h1>
        <p className="text-slate-500 mb-8">
          This product doesn't exist or may have been removed from our catalog.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row justify-center">
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
