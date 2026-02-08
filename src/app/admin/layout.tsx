'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { href: '/admin', label: 'ภาพรวม (Overview)', icon: '📊' },
        { href: '/admin/users', label: 'ผู้ใช้งาน (Users)', icon: '👥' },
        { href: '/admin/farmers', label: 'เกษตรกร (Farmers)', icon: '🧑‍🌾' },
        { href: '/admin/orders', label: 'คำสั่งซื้อ (Orders)', icon: '📝' },
        { href: '/admin/settings', label: 'ตั้งค่า (Settings)', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white fixed h-full z-10 transition-all">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <span className="text-3xl">🛡️</span>
                    <span className="font-bold text-lg text-white">Admin Portal</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.href
                                    ? 'bg-blue-600 text-white font-medium shadow-md'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800 bg-slate-950">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">System Admin</p>
                            <p className="text-xs text-slate-500">Super User</p>
                        </div>
                    </div>
                    <Link
                        href="/login"
                        className="flex items-center gap-2 px-4 py-2 mt-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors justify-center"
                    >
                        🚪 ออกจากระบบ
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 rounded-lg hover:bg-gray-100">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <span className="font-bold text-slate-800 text-lg">Admin Portal</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                        AD
                    </div>
                </header>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-30">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                        <aside className="absolute inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col shadow-2xl">
                            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                                <span className="font-bold text-lg">เมนูหลัก</span>
                                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-slate-800">
                                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.href
                                                ? 'bg-blue-600 text-white'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                            }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </aside>
                    </div>
                )}

                <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
