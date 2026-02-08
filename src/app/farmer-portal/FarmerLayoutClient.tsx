"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type ServerUser = {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    phone?: string | null;
    farm?: { id: string; name?: string | null } | null;
};

export default function FarmerLayoutClient({ children, serverUser }: { children: React.ReactNode; serverUser?: ServerUser }) {
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { href: '/farmer-portal', label: 'ภาพรวม', icon: '📊' },
        { href: '/farmer-portal/inventory', label: 'จัดการสต็อก', icon: '📦' },
        { href: '/farmer-portal/orders', label: 'คำสั่งซื้อ', icon: '📝' },
        { href: '/farmer-portal/earnings', label: 'รายรับ', icon: '💰' },
        { href: '/farmer-portal/settings', label: 'ตั้งค่าร้าน', icon: '⚙️' },
    ];

    function UserSummary() {
        const { user, loading, logout } = useAuth();

        // Prefer server-provided user for immediate accurate display
        const displayName = serverUser?.name ?? user?.name ?? (user as any)?.displayName ?? 'ผู้ใช้';
        const farmName = serverUser?.farm?.name ?? (user as any)?.farm?.name ?? (user as any)?.farmName ?? '';

        return (
            <div>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">👨‍🌾</div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{loading ? 'กำลังโหลด…' : displayName}</p>
                        {farmName ? <p className="text-xs text-gray-500">{farmName}</p> : null}
                    </div>
                </div>
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-2 px-4 py-2 mt-2 w-full text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors justify-center"
                >
                    🚪 ออกจากระบบ
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-10 transition-all">
                <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                    <span className="text-3xl">🧑‍🌾</span>
                    <span className="font-bold text-lg text-primary">Farmer Portal</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === item.href
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <UserSummary />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 rounded-lg hover:bg-gray-100">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <span className="font-bold text-primary text-lg">Farmer Portal</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm border border-primary/20">👨‍🌾</div>
                </header>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-30">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                        <aside className="absolute inset-y-0 left-0 w-64 bg-white flex flex-col shadow-2xl">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <span className="font-bold text-lg text-primary">เมนูหลัก</span>
                                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === item.href
                                                ? 'bg-primary/10 text-primary font-medium'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <UserSummary />
                            </div>
                        </aside>
                    </div>
                )}

                <main className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-fadeIn">
                    {children}
                </main>
            </div>
        </div>
    );
}
