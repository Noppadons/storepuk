'use client';

import { Header, Footer } from '@/components';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, ShieldCheck, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

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
            setError('รหัสผ่านไม่ตรงกัน');
            toast.error('รหัสผ่านไม่ตรงกัน', { description: 'กรุณาตรวจสอบการยืนยันรหัสผ่านอีกครั้ง' });
            return;
        }

        if (!formData.acceptTerms) {
            setError('กรุณายอมรับเงื่อนไขการใช้งาน');
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
                throw new Error(data.error || 'การสมัครสมาชิกล้มเหลว');
            }

            login(data);
            toast.success('ยินดีต้อนรับ!', { description: 'สมัครสมาชิกและเข้าสู่ระบบสำเร็จแล้ว' });
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
                    className="max-w-[480px] mx-auto"
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
                        <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">สมัครสมาชิก</h1>
                        <p className="text-foreground/40 font-medium tracking-wide">เข้าร่วมครอบครัวผักสดเพื่อสุขภาพที่ดีกว่า</p>
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

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 px-1">ชื่อ-นามสกุล</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        className="w-full bg-foreground/5 border-none rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-foreground/20"
                                        placeholder="ระบุชื่อจริงของคุณ"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 px-1">เบอร์โทรศัพท์</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="tel"
                                            className="w-full bg-foreground/5 border-none rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-foreground/20 text-sm"
                                            placeholder="08x-xxx-xxxx"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 px-1">อีเมล</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="email"
                                            className="w-full bg-foreground/5 border-none rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-foreground/20 text-sm"
                                            placeholder="your@mail.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 px-1">รหัสผ่าน</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="password"
                                        className="w-full bg-foreground/5 border-none rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-foreground/20"
                                        placeholder="อย่างน้อย 8 ตัวอักษร"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 px-1">ยืนยันรหัสผ่าน</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="password"
                                        className="w-full bg-foreground/5 border-none rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-foreground/20"
                                        placeholder="ระบุรหัสผ่านอีกครั้ง"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3 py-2">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                                        checked={formData.acceptTerms}
                                        onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                                        required
                                    />
                                    <div className="w-5 h-5 border-2 border-foreground/10 rounded-lg flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-all pointer-events-none">
                                        <div className="w-2 h-3 border-r-2 border-b-2 border-white rotate-45 mb-0.5" />
                                    </div>
                                </div>
                                <label htmlFor="terms" className="text-xs font-bold text-foreground/40 leading-relaxed cursor-pointer select-none">
                                    ฉันยอมรับ <Link href="/terms" className="text-primary hover:underline">ข้อกำหนดการใช้งาน</Link> และ <Link href="/privacy" className="text-primary hover:underline">นโยบายความเป็นส่วนตัว</Link> ของแพลตฟอร์ม
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full !rounded-2xl py-4 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 mt-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        กำลังสร้างบัญชี...
                                    </>
                                ) : (
                                    <>
                                        สมัครสมาชิก <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-8">
                            <hr className="flex-1 border-foreground/5" />
                            <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">หรือ</span>
                            <hr className="flex-1 border-foreground/5" />
                        </div>

                        {/* Social Register */}
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
                                <svg className="w-5 h-5" fill="#00B900" viewBox="0 0 24 24">
                                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755z" />
                                </svg>
                                LINE
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="mt-10 text-center">
                            <span className="text-sm font-bold text-foreground/40">มีบัญชีอยู่แล้ว?</span><br />
                            <Link href="/login" className="inline-block mt-1 text-primary font-black uppercase tracking-widest text-[11px] hover:underline">
                                เข้าสู่ระบบทันที
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
