import Link from "next/link";
import { Search, Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <div className="size-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <Search size={48} />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Page Not Found
        </h1>
        <p className="text-slate-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or removed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Home size={18} />
            Go Home
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
          >
            <ShoppingBag size={18} />
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
