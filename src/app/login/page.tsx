'use client';

import { Header, Footer } from '@/components';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { User as AppUser } from '@/types';
import { Mail, Phone, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('email');
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
            toast.info('จำลองการส่ง OTP', { description: 'ในระบบจริงจะส่ง SMS ไปที่เบอร์ของคุณ' });
        } else {
            setError('กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก');
        }
    };

    const handleLogin = async () => {
        setError('');
        if (loginMethod === 'email') {
            if (!email || !password) {
                setError('กรุณากรอกอีเมลและรหัสผ่าน');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError('กรุณากรอกอีเมลในรูปแบบที่ถูกต้อง');
                return;
            }
            if (password.length < 8) {
                setError('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
                return;
            }
        }

        setLoading(true);

        if (loginMethod === 'phone') {
            if (otp === '123456') {
                toast.success('เข้าสู่ระบบสำเร็จ (จำลองการทำงาน)');
                router.push('/account');
                setLoading(false);
                return;
            }
            setError('รหัส OTP ไม่ถูกต้อง (ใช้ 123456 สำหรับการทดสอบ)');
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
                throw new Error(data?.error || 'การเข้าสู่ระบบล้มเหลว');
            }

            // Expecting the API to return the user object at top-level
            const user = data as Record<string, unknown>;
            login(user as unknown as AppUser);
            const displayName = (user && (user.name || user.fullName)) || '';
            toast.success('เข้าสู่ระบบสำเร็จ', { description: displayName ? `ยินดีต้อนรับคุณ ${displayName}` : undefined });
            router.push('/account');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
            toast.error('เกิดข้อผิดพลาด', { description: message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 container-app py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-[440px] mx-auto"
                >
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 12 }}
                            className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 text-4xl"
                        >
                            🥬
                        </motion.div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">เข้าสู่ระบบ</h1>
                        <p className="text-foreground/40 font-medium">เลือกวิธีเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
                    </div>

                    <div className="card-premium p-8 bg-white/80 backdrop-blur-xl">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm font-bold border border-red-100"
                                >
                                    <AlertCircle size={18} className="shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Login Method Tabs */}
                        <div className="flex p-1.5 bg-foreground/5 rounded-2xl mb-8">
                            <button
                                onClick={() => { setLoginMethod('phone'); setError(''); }}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all duration-300",
                                    loginMethod === 'phone'
                                        ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                                        : "text-foreground/40 hover:text-foreground/60"
                                )}
                            >
                                <Phone size={16} /> เบอร์โทร
                            </button>
                            <button
                                onClick={() => { setLoginMethod('email'); setError(''); }}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all duration-300",
                                    loginMethod === 'email'
                                        ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                                        : "text-foreground/40 hover:text-foreground/60"
                                )}
                            >
                                <Mail size={16} /> อีเมล
                            </button>
                        </div>

                        {loginMethod === 'phone' ? (
                            <div className="space-y-6">
                                {!showOTP ? (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 px-1">เบอร์โทรศัพท์</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 font-bold border-r pr-3 border-foreground/10 group-focus-within:text-primary transition-colors">
                                                    +66
                                                </div>
                                                <input
                                                    type="tel"
                                                    className="w-full bg-foreground/5 border-none rounded-2xl py-4 pl-16 pr-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-foreground/20"
                                                    placeholder="8x-xxx-xxxx"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSendOTP}
                                            className="btn btn-primary w-full !rounded-2xl py-4 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                            disabled={phone.length < 9}
                                        >
                                            ส่งรหัส OTP <ArrowRight size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center space-y-2">
                                            <p className="text-sm font-bold text-foreground/40">
                                                รหัส OTP ส่งไปที่ <span className="text-foreground">+66{phone}</span>
                                            </p>
                                            <button
                                                onClick={() => setShowOTP(false)}
                                                className="text-primary text-[11px] font-black uppercase tracking-wider hover:underline"
                                            >
                                                แก้ไขเบอร์โทรศัพท์
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 text-center block">กรอกรหัส 6 หลัก</label>
                                            <input
                                                type="text"
                                                className="w-full bg-foreground/5 border-none rounded-2xl py-5 text-center text-3xl font-black tracking-[0.5em] focus:ring-2 focus:ring-primary/20 transition-all"
                                                maxLength={6}
                                                placeholder="------"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={handleLogin}
                                            className="btn btn-primary w-full !rounded-2xl py-4 flex items-center justify-center gap-2"
                                            disabled={otp.length < 6 || loading}
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : 'ยืนยันเพื่อเข้าสู่ระบบ'}
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 px-1">อีเมลผู้ใช้งาน</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-colors" size={20} />
                                        <input
                                            type="email"
                                            className="w-full bg-foreground/5 border-none rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-foreground/20"
                                            placeholder="example@mail.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 px-1">รหัสผ่าน</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-colors" size={20} />
                                        <input
                                            type="password"
                                            className="w-full bg-foreground/5 border-none rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-foreground/20"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Link href="/forgot-password" className="text-[11px] font-black uppercase text-primary tracking-wider hover:underline">
                                        ลืมรหัสผ่าน?
                                    </Link>
                                </div>
                                <button
                                    onClick={handleLogin}
                                    className="btn btn-primary w-full !rounded-2xl py-4 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 mt-4"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            กำลังตรวจสอบ...
                                        </>
                                    ) : (
                                        <>
                                            เข้าสู่ระบบ <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-8">
                            <hr className="flex-1 border-foreground/5" />
                            <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">หรือ</span>
                            <hr className="flex-1 border-foreground/5" />
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 py-3 bg-white border border-foreground/5 rounded-xl hover:bg-foreground/5 transition-all text-sm font-bold shadow-sm active:scale-95">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 bg-[#06C755] text-white rounded-xl hover:opacity-90 transition-all text-sm font-bold shadow-sm active:scale-95">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771z" />
                                </svg>
                                LINE
                            </button>
                        </div>

                        {/* Register Link */}
                        <div className="mt-10 text-center">
                            <span className="text-sm font-bold text-foreground/40">ยังไม่มีบัญชีกับพวกเรา?</span><br />
                            <Link href="/register" className="inline-block mt-1 text-primary font-black uppercase tracking-widest text-[11px] hover:underline">
                                สมัครสมาชิกใหม่ทันที
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
