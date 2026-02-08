'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
    Search,
    ShoppingCart,
    User as UserIcon,
    Menu,
    X,
    ChevronDown,
    LogOut,
    ShoppingBag,
    UserCircle,
    LayoutDashboard,
    Sprout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Header() {
    const { user, logout } = useAuth();
    const { itemCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
            isScrolled ? "glass-premium py-2" : "bg-transparent py-4 border-transparent"
        )}>
            <div className="container-app">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                            className="text-3xl"
                        >
                            🥬
                        </motion.div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                            มาซื้อผักกันเถอะ
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {[
                            { name: 'หน้าแรก', href: '/' },
                            { name: 'สินค้าทั้งหมด', href: '/products' },
                            { name: 'เกี่ยวกับเรา', href: '/about' },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors relative group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </Link>
                        ))}

                        {user?.role === 'farmer' && (
                            <Link href="/farmer-portal" className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition-colors bg-primary/5 px-3 py-1.5 rounded-lg">
                                <Sprout size={16} />
                                เมนูเกษตรกร
                            </Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link href="/admin" className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition-colors bg-primary/5 px-3 py-1.5 rounded-lg">
                                <LayoutDashboard size={16} />
                                ผู้ดูแลระบบ
                            </Link>
                        )}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2.5 rounded-xl hover:bg-primary/10 text-foreground/70 transition-colors"
                        >
                            <Search size={20} />
                        </motion.button>

                        {/* Cart */}
                        <motion.div whileTap={{ scale: 0.9 }} className="relative">
                            <Link
                                href="/cart"
                                className="flex p-2.5 rounded-xl hover:bg-primary/10 text-foreground/70 transition-colors"
                            >
                                <ShoppingCart size={20} />
                                <AnimatePresence>
                                    {itemCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface shadow-lg"
                                        >
                                            {itemCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        </motion.div>

                        <div className="h-6 w-px bg-foreground/10 mx-1 hidden md:block" />

                        {/* User Profile */}
                        {user ? (
                            <div className="relative group/user">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className="hidden md:flex items-center gap-2 p-1.5 pl-3 rounded-xl border border-foreground/10 hover:border-primary/50 transition-all hover:shadow-sm"
                                >
                                    <div className="text-right hidden lg:block">
                                        <p className="text-xs font-bold leading-tight truncate max-w-[100px]">{user.name}</p>
                                        <p className="text-[10px] text-foreground-muted leading-tight capitalize">{user.role}</p>
                                    </div>
                                    {user.image ? (
                                        <img src={user.image} alt={user.name || ''} className="w-8 h-8 rounded-lg object-cover shadow-sm" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {user.name?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                    <ChevronDown size={14} className="text-foreground/40" />
                                </motion.button>

                                {/* Dropdown */}
                                <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover/user:opacity-100 group-hover/user:translate-y-0 group-hover/user:pointer-events-auto transition-all duration-200">
                                    <div className="w-56 glass-premium rounded-2xl p-2 shadow-2xl border border-foreground/5">
                                        <Link href="/account" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 transition-colors text-sm font-medium">
                                            <UserCircle size={18} className="text-primary" /> บัญชีของฉัน
                                        </Link>
                                        <Link href="/account/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 transition-colors text-sm font-medium">
                                            <ShoppingBag size={18} className="text-primary" /> รายการสั่งซื้อ
                                        </Link>
                                        <div className="h-px bg-foreground/5 my-1" />
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-500 transition-colors text-sm font-medium"
                                        >
                                            <LogOut size={18} /> ออกจากระบบ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="btn-primary rounded-xl !py-2 !px-5 text-sm !font-bold"
                            >
                                เข้าสู่ระบบ
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl hover:bg-primary/10 text-foreground/70 transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.nav
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="py-6 flex flex-col gap-2">
                                {[
                                    { name: 'หน้าแรก', href: '/' },
                                    { name: 'สินค้าทั้งหมด', href: '/products' },
                                    { name: 'เกี่ยวกับเรา', href: '/about' },
                                    { name: 'บัญชีของฉัน', href: '/account' },
                                ].map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="px-4 py-3 rounded-xl hover:bg-primary/10 font-bold transition-all active:scale-95"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>

                {/* Search Overlay */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="py-4"
                        >
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                                <input
                                    type="text"
                                    placeholder="ค้นหาผักสดจากฟาร์ม..."
                                    className="w-full py-4 pl-12 pr-4 glass-premium rounded-2xl outline-none border-none focus:ring-2 ring-primary/30 transition-shadow transition-all"
                                    autoFocus
                                />
                                <button
                                    onClick={() => setIsSearchOpen(false)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-foreground/5 hover:bg-foreground/10 px-2 py-1 rounded-md transition-colors"
                                >
                                    ESC
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}

