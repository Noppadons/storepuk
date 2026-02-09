
'use client';

import { Header, Footer } from '@/components';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
    const { user, loading, logout, updateUser } = useAuth();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    // Profile form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            setFormData({
                fullName: user.name || user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user, loading, router]);

    const handleUpdateProfile = async () => {
        if (!user) return;

        setSubmitting(true);
        try {
            // Optimistic update
            updateUser(formData);

            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to update profile');
            }

            alert('บันทึกข้อมูลสำเร็จ');
        } catch (error) {
            console.error('Update failed:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container-app py-8">
                {/* Breadcrumb */}
                <nav className="text-sm text-foreground-muted mb-8">
                    <Link href="/" className="hover:text-primary">หน้าแรก</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">บัญชีของฉัน</span>
                </nav>

                <div className="max-w-2xl mx-auto">
                    {/* Profile Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">บัญชีของฉัน</h1>
                        <p className="text-foreground-muted">จัดการข้อมูลส่วนตัวของคุณ</p>
                    </div>

                    {/* User Profile Card */}
                    <div className="card p-8 mb-8">
                        <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden">
                                {(user.image) ? <Image src={user.image} alt="User" width={80} height={80} className="rounded-full object-cover" /> : '👤'}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-1">{user.name || user.fullName || 'ผู้ใช้'}</h2>
                                <p className="text-foreground-muted mb-4">{user.email}</p>
                                <p className="text-sm text-foreground-muted">
                                    บทบาท: <span className="font-semibold capitalize text-foreground">{user.role || 'customer'}</span>
                                </p>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">แก้ไขข้อมูลส่วนตัว</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">ชื่อ-นามสกุล</label>
                                    <input
                                        type="text"
                                        className="input w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="กรุณากรอกชื่อ-นามสกุล"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">เบอร์โทรศัพท์</label>
                                    <input
                                        type="tel"
                                        className="input w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="กรุณากรอกเบอร์โทรศัพท์"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">อีเมล</label>
                                    <input
                                        type="email"
                                        className="input w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 outline-none"
                                        value={formData.email}
                                        disabled
                                        title="ไม่สามารถเปลี่ยนอีเมลได้"
                                    />
                                    <p className="text-xs text-foreground-muted mt-1">อีเมลไม่สามารถเปลี่ยนได้</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                                <button
                                    className="flex-1 btn btn-primary py-3 rounded-lg font-medium disabled:opacity-50"
                                    onClick={handleUpdateProfile}
                                    disabled={submitting}
                                >
                                    {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                                </button>
                                <button
                                    onClick={() => logout()}
                                    className="px-6 py-3 btn bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
                                >
                                    ออกจากระบบ
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Link href="/account/orders" className="card p-4 text-center hover:shadow-lg transition-shadow">
                            <span className="text-2xl block mb-2">📦</span>
                            <p className="font-medium">คำสั่งซื้อ</p>
                        </Link>
                        <Link href="/account/addresses" className="card p-4 text-center hover:shadow-lg transition-shadow">
                            <span className="text-2xl block mb-2">📍</span>
                            <p className="font-medium">ที่อยู่</p>
                        </Link>
                        <Link href="/account/favorites" className="card p-4 text-center hover:shadow-lg transition-shadow">
                            <span className="text-2xl block mb-2">❤️</span>
                            <p className="font-medium">รายการโปรด</p>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}