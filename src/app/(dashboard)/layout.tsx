import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="h-16 border-b bg-white flex items-center px-6 gap-6">
                <span className="font-bold text-emerald-600 text-xl mr-4">NexusStore</span>
                <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
                    <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/dashboard/orders" className="hover:text-emerald-600 transition-colors">
                        Orders
                    </Link>
                    <Link href="/dashboard/products" className="hover:text-emerald-600 transition-colors">
                        Products
                    </Link>
                </div>
            </nav>
            <main className="p-8">{children}</main>
        </div>
    );
}
