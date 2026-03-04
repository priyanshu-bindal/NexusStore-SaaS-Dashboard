"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

export function SearchInput() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);

        // Reset page on new search
        params.delete("page");

        if (term) {
            params.set("q", term);
            // Remove category when searching to search the whole store
            params.delete("category");
        } else {
            params.delete("q");
        }

        if (pathname === "/shop") {
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        } else {
            router.push(`/shop?${params.toString()}`);
        }
    }, 300);

    return (
        <div className="relative flex-1 max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-10 text-sm focus:ring-2 focus:ring-[#2563eb]/20 focus:bg-white transition-all outline-none"
                    placeholder="Search products, brands and more..."
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get("q")?.toString()}
                />
                {searchParams.get("q") && (
                    <button
                        onClick={() => {
                            const input = document.querySelector('input[placeholder="Search products, brands and more..."]') as HTMLInputElement;
                            if (input) input.value = "";
                            handleSearch("");
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>
        </div>
    );
}
