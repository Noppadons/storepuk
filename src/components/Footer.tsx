'use client';

import Link from 'next/link';
import {
    Facebook,
    Instagram,
    Phone,
    Mail,
    Clock,
    ShieldCheck,
    ArrowUpRight,
    Leaf
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const footerLinks = [
    {
        title: 'หมวดหมู่สินค้า',
        links: [
            { name: 'ผักใบเขียว', href: '/category/leafy-greens' },
            { name: 'ผักหัวและราก', href: '/category/root-vegetables' },
            { name: 'ผักผล', href: '/category/fruit-vegetables' },
            { name: 'สมุนไพรสด', href: '/category/herbs' },
            { name: 'เห็ดคุณภาพ', href: '/category/mushrooms' },
        ]
    },
    {
        title: 'ช่วยเหลือ & ข้อมูล',
        links: [
            { name: 'เกี่ยวกับเรา', href: '/about' },
            { name: 'ฟาร์มของเรา', href: '/farmers' },
            { name: 'การจัดส่ง & ค่าธรรมเนียม', href: '/delivery' },
            { name: 'คำถามที่พบบ่อย (FAQ)', href: '/faq' },
            { name: 'ติดต่อทีมงาน', href: '/contact' },
        ]
    },
    {
        title: 'ส่วนธุรกิจ',
        links: [
            { name: 'สำหรับเกษตรกร', href: '/farmer-register' },
            { name: 'Farmer Portal', href: '/farmer-portal' },
            { name: 'Admin Dashboard', href: '/admin' },
            { name: 'นโยบายความเป็นส่วนตัว', href: '/privacy' },
            { name: 'ข้อกำหนดการใช้งาน', href: '/terms' },
        ]
    }
];

export function Footer() {
    return (
        <footer className="bg-surface border-t border-primary/5 mt-auto relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container-app py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <motion.div
                                whileHover={{ rotate: 15 }}
                                className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"
                            >
                                <Leaf size={24} />
                            </motion.div>
                            <span className="text-2xl font-black bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                                มาซื้อผักกันเถอะ
                            </span>
                        </Link>

                        <p className="text-foreground/50 text-sm leading-relaxed max-w-xs">
                            แพลตฟอร์มที่เชื่อมโยงเกษตรกรไทยกับคุณโดยตรง มอบผลผลิตที่สดใหม่ ปลอดภัย และยั่งยืน เพื่อสุขภาพที่ดีของคนไทยในทุกวัน
                        </p>

                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, href: '#', color: 'hover:bg-[#1877F2]' },
                                { Icon: Instagram, href: '#', color: 'hover:bg-gradient-to-tr from-[#F58529] via-[#D12D7A] to-[#8134AF]' },
                            ].map(({ Icon, href, color }, i) => (
                                <motion.a
                                    key={i}
                                    href={href}
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    className={cn(
                                        "w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/40 hover:text-white transition-all duration-300",
                                        color
                                    )}
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title} className="space-y-6">
                            <h4 className="text-sm font-black uppercase tracking-widest text-foreground/30">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-[13px] font-bold text-foreground/60 hover:text-primary transition-colors flex items-center gap-1 group/link"
                                        >
                                            {link.name}
                                            <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Section */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground/30">
                            ติดต่อฝ่ายบริการ
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Phone size={14} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] uppercase font-black text-foreground/30 leading-none">โทรสั่งด่วน</p>
                                    <p className="text-sm font-bold text-foreground/70">02-xxx-xxxx</p>
                                </div>
                            </li>
                            <li className="flex gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Mail size={14} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] uppercase font-black text-foreground/30 leading-none">อีเมลสอบถาม</p>
                                    <p className="text-sm font-bold text-foreground/70">care@masuepak.com</p>
                                </div>
                            </li>
                            <li className="flex gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Clock size={14} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] uppercase font-black text-foreground/30 leading-none">เวลาทำการ</p>
                                    <p className="text-sm font-bold text-foreground/70">ทุกวัน: 08:00 - 20:00</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6 text-xs font-bold text-foreground/30">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck size={14} className="text-primary" />
                            ปลอดภัย 100% ด้วยมาตรฐาน GAP
                        </span>
                    </div>

                    <p className="text-[11px] font-bold text-foreground/20 uppercase tracking-widest text-center md:text-right">
                        © 2026 มาซื้อผักกันเถอะ • Fresh from Thai Farmers to Your Table
                    </p>
                </div>
            </div>
        </footer>
    );
}
