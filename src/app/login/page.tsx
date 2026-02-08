'use client';

import { Header, Footer } from '@/components';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = () => {
        if (phone.length >= 10) {
            setShowOTP(true);
        }
    };

    const handleLogin = async () => {
        setError('');
        setLoading(true);

        if (loginMethod === 'phone') {
            // Mock phone login for now
            if (otp === '123456') {
                // In real app, verify OTP with API
                // For now, simulate success if OTP is correct
                // We need a user to login with. Maybe fetch via phone? 
                // Or just hardcode for demo.
                // Let's focus on Email login which we implemented API for.
                alert('Phone login simulation: OTP Correct. Please use email login for real API test.');
                setLoading(false);
                return;
            }
            setError('Invald OTP');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
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
                        <h1 className="text-2xl font-bold">เข้าสู่ระบบ</h1>
                        <p className="text-foreground-muted mt-2">ยินดีต้อนรับสู่ มาซื้อผักกันเถอะ</p>
                    </div>


                    <div className="card p-6">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-center text-sm">
                                {error}
                            </div>
                        )}
                        {/* Login Method Tabs */}
                        <div className="flex gap-2 mb-6">
                            <button
                                onClick={() => setLoginMethod('phone')}
                                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${loginMethod === 'phone'
                                    ? 'bg-primary text-white'
                                    : 'bg-surface-hover text-foreground-muted'
                                    }`}
                            >
                                📱 เบอร์โทร
                            </button>
                            <button
                                onClick={() => setLoginMethod('email')}
                                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${loginMethod === 'email'
                                    ? 'bg-primary text-white'
                                    : 'bg-surface-hover text-foreground-muted'
                                    }`}
                            >
                                ✉️ อีเมล
                            </button>
                        </div>

                        {loginMethod === 'phone' ? (
                            <div className="space-y-4">
                                {!showOTP ? (
                                    <>
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
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSendOTP}
                                            className="btn btn-primary w-full py-4"
                                            disabled={phone.length < 9}
                                        >
                                            ส่งรหัส OTP
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center mb-4">
                                            <p className="text-foreground-muted">
                                                ส่งรหัส OTP ไปที่ +66{phone}
                                            </p>
                                            <button
                                                onClick={() => setShowOTP(false)}
                                                className="text-primary text-sm mt-1"
                                            >
                                                เปลี่ยนเบอร์
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-center">กรอกรหัส OTP</label>
                                            <input
                                                type="text"
                                                className="input text-center text-2xl tracking-[1em] font-mono"
                                                maxLength={6}
                                                placeholder="------"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={handleLogin}
                                            className="btn btn-primary w-full py-4"
                                            disabled={otp.length < 6}
                                        >
                                            ยืนยัน
                                        </button>
                                        <button className="w-full text-center text-primary text-sm">
                                            ส่งรหัสอีกครั้ง (59s)
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">อีเมล</label>
                                    <input
                                        type="email"
                                        className="input"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">รหัสผ่าน</label>
                                    <input
                                        type="password"
                                        className="input"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Link href="/forgot-password" className="text-primary text-sm">
                                        ลืมรหัสผ่าน?
                                    </Link>
                                </div>
                                <button onClick={handleLogin} className="btn btn-primary w-full py-4">
                                    เข้าสู่ระบบ
                                </button>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <hr className="flex-1 border-secondary-light" />
                            <span className="text-sm text-foreground-muted">หรือ</span>
                            <hr className="flex-1 border-secondary-light" />
                        </div>

                        {/* Social Login */}
                        <div className="space-y-3">
                            <button className="btn btn-secondary w-full py-3">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                เข้าสู่ระบบด้วย Google
                            </button>
                            <button className="btn btn-secondary w-full py-3">
                                <svg className="w-5 h-5" fill="#00B900" viewBox="0 0 24 24">
                                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771z" />
                                </svg>
                                เข้าสู่ระบบด้วย LINE
                            </button>
                        </div>

                        {/* Register Link */}
                        <p className="text-center mt-6 text-foreground-muted">
                            ยังไม่มีบัญชี?{' '}
                            <Link href="/register" className="text-primary font-medium">
                                สมัครสมาชิก
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
