
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
            updateUser(formData);
            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Failed to update profile');
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
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/10 via-white to-white">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center px-2 py-8">
                {/* Floating Profile Card */}
                <div className="relative w-full max-w-lg">
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-secondary shadow-lg flex items-center justify-center overflow-hidden border-4 border-white">
                            {user.image ? (
                                <Image src={user.image} alt="User" width={128} height={128} className="rounded-full object-cover w-full h-full" />
                            ) : (
                                <span className="text-6xl">👤</span>
                            )}
                        </div>
                        {/* Edit avatar button (mock) */}
                        <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100 border border-gray-200 text-primary text-xl" title="เปลี่ยนรูปโปรไฟล์" disabled>
                            <span>✏️</span>
                        </button>
                    </div>
                    <div className="pt-20 pb-10 px-6 bg-white/90 rounded-3xl shadow-xl flex flex-col items-center">
                        <h1 className="text-2xl font-bold mb-1 mt-2 text-center">{user.name || user.fullName || 'ผู้ใช้'}</h1>
                        <p className="text-foreground-muted text-center mb-2">{user.email}</p>
                        <span className="inline-block text-xs bg-primary/10 text-primary px-3 py-1 rounded-full mb-4">{user.role || 'customer'}</span>
                        {/* Form */}
                        <form className="w-full max-w-md mx-auto space-y-6 mt-2" onSubmit={e => { e.preventDefault(); handleUpdateProfile(); }}>
                            <div>
                                <label className="block text-sm font-medium mb-1">ชื่อ-นามสกุล</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none bg-white text-lg shadow-sm"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="กรุณากรอกชื่อ-นามสกุล"
                                    autoComplete="name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">เบอร์โทรศัพท์</label>
                                <input
                                    type="tel"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none bg-white text-lg shadow-sm"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="กรุณากรอกเบอร์โทรศัพท์"
                                    autoComplete="tel"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">อีเมล</label>
                                <input
                                    type="email"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none text-lg shadow-sm"
                                    value={formData.email}
                                    disabled
                                    title="ไม่สามารถเปลี่ยนอีเมลได้"
                                />
                                <p className="text-xs text-foreground-muted mt-1">อีเมลไม่สามารถเปลี่ยนได้</p>
                            </div>
                            <div className="flex flex-col gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="w-full btn btn-primary py-3 rounded-xl font-semibold text-lg disabled:opacity-50 shadow"
                                    disabled={submitting}
                                >
                                    {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => logout()}
                                    className="w-full py-3 rounded-xl font-semibold text-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow"
                                >
                                    ออกจากระบบ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Minimal Quick Links */}
                <div className="w-full max-w-lg mt-10 flex justify-center gap-6">
                    <Link href="/account/orders" className="flex flex-col items-center text-2xl text-primary/80 hover:text-primary transition-colors">
                        <span>📦</span>
                        <span className="text-xs mt-1">คำสั่งซื้อ</span>
                    </Link>
                    <Link href="/account/addresses" className="flex flex-col items-center text-2xl text-primary/80 hover:text-primary transition-colors">
                        <span>📍</span>
                        <span className="text-xs mt-1">ที่อยู่</span>
                    </Link>
                    <Link href="/account/favorites" className="flex flex-col items-center text-2xl text-primary/80 hover:text-primary transition-colors">
                        <span>❤️</span>
                        <span className="text-xs mt-1">รายการโปรด</span>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}