'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export function Header() {
    const { user, logout } = useAuth();
    const { itemCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <header className="glass sticky top-0 z-50">
            <div className="container-app">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🥬</span>
                        <span className="text-lg font-bold text-primary">
                            มาซื้อผักกันเถอะ
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
                            หน้าแรก
                        </Link>
                        <Link href="/products" className="text-foreground-muted hover:text-primary transition-colors">
                            สินค้าทั้งหมด
                        </Link>
                        <Link href="/about" className="text-foreground-muted hover:text-primary transition-colors">
                            เกี่ยวกับเรา
                        </Link>
                        {user?.role === 'farmer' && (
                            <Link href="/farmer-portal" className="text-primary font-medium hover:text-primary-dark transition-colors">
                                เมนูเกษตรกร
                            </Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link href="/admin" className="text-primary font-medium hover:text-primary-dark transition-colors">
                                ผู้ดูแลระบบ
                            </Link>
                        )}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search Button */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2 rounded-full hover:bg-surface-hover transition-colors"
                            aria-label="ค้นหา"
                        >
                            <svg className="w-6 h-6 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* User */}
                        {user ? (
                            <div className="relative group">
                                <Link href="/account" className="hidden md:flex p-2 rounded-full hover:bg-surface-hover transition-colors items-center gap-2" aria-label="บัญชีผู้ใช้">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name || 'User'} className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {user.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </Link>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block animate-fadeIn">
                                    <div className="px-4 py-2 border-b">
                                        <p className="font-medium truncate">{user.name}</p>
                                        <p className="text-xs text-foreground-muted truncate">{user.email}</p>
                                    </div>
                                    <Link href="/account" className="block px-4 py-2 hover:bg-surface-hover">บัญชีของฉัน</Link>
                                    <Link href="/account/orders" className="block px-4 py-2 hover:bg-surface-hover">รายการสั่งซื้อ</Link>
                                    <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-surface-hover text-red-500">ออกจากระบบ</button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="hidden md:flex p-2 rounded-full hover:bg-surface-hover transition-colors" aria-label="เข้าสู่ระบบ">
                                <svg className="w-6 h-6 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </Link>
                        )}

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative p-2 rounded-full hover:bg-surface-hover transition-colors"
                            aria-label="ตะกร้าสินค้า"
                        >
                            <svg className="w-6 h-6 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-full hover:bg-surface-hover transition-colors"
                            aria-label="เมนู"
                        >
                            <svg className="w-6 h-6 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                {isSearchOpen && (
                    <div className="py-4 animate-fadeIn">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="ค้นหาผักสด..."
                                className="input pl-12"
                                autoFocus
                            />
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-secondary-light animate-fadeIn">
                        <div className="flex flex-col gap-2">
                            <Link href="/" className="px-4 py-3 rounded-lg hover:bg-surface-hover transition-colors font-medium">
                                หน้าแรก
                            </Link>
                            <Link href="/products" className="px-4 py-3 rounded-lg hover:bg-surface-hover transition-colors">
                                สินค้าทั้งหมด
                            </Link>
                            <Link href="/about" className="px-4 py-3 rounded-lg hover:bg-surface-hover transition-colors">
                                เกี่ยวกับเรา
                            </Link>
                            <Link href="/farmers" className="px-4 py-3 rounded-lg hover:bg-surface-hover transition-colors">
                                ฟาร์มของเรา
                            </Link>
                            <Link href="/account" className="px-4 py-3 rounded-lg hover:bg-surface-hover transition-colors">
                                บัญชีของฉัน
                            </Link>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
