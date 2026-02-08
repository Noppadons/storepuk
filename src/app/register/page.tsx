'use client';

import { Header, Footer } from '@/components';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            login(data);
            router.push('/account');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container-app py-12">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <span className="text-5xl block mb-4">🥬</span>
                        <h1 className="text-2xl font-bold">สมัครสมาชิก</h1>
                        <p className="text-foreground-muted mt-2">เริ่มต้นซื้อผักสดกับ มาซื้อผักกันเถอะ</p>
                    </div>

                    <div className="card p-6">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-center text-sm">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">ชื่อ-นามสกุล</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="ชื่อของคุณ"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">เบอร์โทรศัพท์</label>
                                <div className="flex gap-2">
                                    <span className="input w-20 flex items-center justify-center bg-surface-hover">
                                        +66
                                    </span>
                                    <input
                                        type="tel"
                                        className="input flex-1"
                                        placeholder="8x-xxx-xxxx"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">อีเมล</label>
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">รหัสผ่าน</label>
                                <input
                                    type="password"
                                    className="input"
                                    placeholder="อย่างน้อย 8 ตัวอักษร"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={8}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">ยืนยันรหัสผ่าน</label>
                                <input
                                    type="password"
                                    className="input"
                                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="w-5 h-5 mt-0.5 text-primary rounded"
                                    checked={formData.acceptTerms}
                                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                                    required
                                />
                                <label htmlFor="terms" className="text-sm text-foreground-muted">
                                    ฉันยอมรับ{' '}
                                    <Link href="/terms" className="text-primary">ข้อกำหนดการใช้งาน</Link>
                                    {' '}และ{' '}
                                    <Link href="/privacy" className="text-primary">นโยบายความเป็นส่วนตัว</Link>
                                </label>
                            </div>

                            <button type="submit" className="btn btn-primary w-full py-4">
                                สมัครสมาชิก
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <hr className="flex-1 border-secondary-light" />
                            <span className="text-sm text-foreground-muted">หรือ</span>
                            <hr className="flex-1 border-secondary-light" />
                        </div>

                        {/* Social Register */}
                        <div className="space-y-3">
                            <button className="btn btn-secondary w-full py-3">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                สมัครด้วย Google
                            </button>
                            <button className="btn btn-secondary w-full py-3">
                                <svg className="w-5 h-5" fill="#00B900" viewBox="0 0 24 24">
                                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755z" />
                                </svg>
                                สมัครด้วย LINE
                            </button>
                        </div>

                        {/* Login Link */}
                        <p className="text-center mt-6 text-foreground-muted">
                            มีบัญชีอยู่แล้ว?{' '}
                            <Link href="/login" className="text-primary font-medium">
                                เข้าสู่ระบบ
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
