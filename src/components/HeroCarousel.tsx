'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

import React from 'react';

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    cta: string;
    ctaLink: string;
    bgGradient: string;
    icon: string;
    badge: string;
    badgeIcon: React.ComponentType<Record<string, unknown>>;
}

const slides: Slide[] = [
    {
        id: 1,
        title: 'ผักสดวันนี้จากไร่เชียงใหม่',
        subtitle: 'คัดลัดจากยอดดอย ส่งตรงถึงหน้าบ้านคุณ สดใหม่ทุกล็อต มั่นใจคุณภาพระดับส่งออก',
        cta: 'ช้อปผักสดวันนี้',
        ctaLink: '/products',
        bgGradient: 'from-[#ECFDF5] to-[#D1FAE5]',
        icon: '🥬',
        badge: 'เก็บเกี่ยววันนี้',
        badgeIcon: Clock
    },
    {
        id: 2,
        title: 'สมุนไพรพื้นบ้าน ออร์แกนิคแท้',
        subtitle: 'กลิ่นหอม รสชาติเข้มข้น ปลอดสารเคมี 100% ดูแลสุขภาพอย่างยั่งยืนเพื่อคนที่คุณรัก',
        cta: 'ดูสมุนไพร',
        ctaLink: '/category/herbs',
        bgGradient: 'from-[#F7FEE7] to-[#ECFCCB]',
        icon: '🌿',
        badge: 'ออร์แกนิค 100%',
        badgeIcon: Sprout
    },
    {
        id: 3,
        title: 'เทศกาลเห็ดสด ลดพิเศษ 20%',
        subtitle: 'เห็ดนางฟ้า เห็ดโคนญี่ปุ่น และเห็ดพื้นบ้านนานาชนิด สดจากหน้าฟาร์มทุกวัน',
        cta: 'รับส่วนลดเลย',
        ctaLink: '/category/mushrooms',
        bgGradient: 'from-[#FFFBEB] to-[#FEF3C7]',
        icon: '🍄',
        badge: 'โปรโมชันแนะนำ',
        badgeIcon: Sparkles
    },
];

// Reusing icons from Lucide
function Sprout(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 20h10" />
            <path d="M10 20c5.5-2.5 8-6.4 8-10 0-4.4-3.6-8-8-8s-8 3.6-8 8c0 3.6 2.5 7.5 8 10" />
            <path d="M12 20v-8" />
        </svg>
    )
}

export function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const paginate = (newDirection: number) => {
        setCurrentSlide((prev) => (prev + newDirection + slides.length) % slides.length);
    };

    return (
        <div className="relative h-[340px] md:h-[480px] w-full overflow-hidden rounded-3xl group/carousel shadow-premium border border-primary/5">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                        "absolute inset-0 bg-gradient-to-br flex items-center px-8 md:px-20",
                        slides[currentSlide].bgGradient
                    )}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full items-center gap-12">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-white/50 w-fit"
                            >
                                {(() => {
                                    const BadgeIcon = slides[currentSlide].badgeIcon;
                                    return <BadgeIcon className="text-primary" size={14} />;
                                })()}
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                    {slides[currentSlide].badge}
                                </span>
                            </motion.div>

                            <div className="space-y-2">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1]"
                                >
                                    {slides[currentSlide].title.split(' ').map((word, i) => (
                                        <span key={i} className={i === 1 ? "text-primary block md:inline" : ""}>
                                            {word}{' '}
                                        </span>
                                    ))}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-lg text-foreground/60 max-w-md font-medium"
                                >
                                    {slides[currentSlide].subtitle}
                                </motion.p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Link
                                    href={slides[currentSlide].ctaLink}
                                    className="btn btn-primary group/btn !rounded-2xl !py-4 !px-8 shadow-xl"
                                >
                                    {slides[currentSlide].cta}
                                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.4, type: 'spring', damping: 15 }}
                            className="hidden md:flex justify-center flex-col items-center gap-4"
                        >
                            <div className="text-[180px] filter drop-shadow-2xl select-none animate-float">
                                {slides[currentSlide].icon}
                            </div>
                            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/40 shadow-sm">
                                <ShieldCheck className="text-primary" />
                                <span className="text-sm font-bold text-foreground/70">รับรองคุณภาพ GAP ทุกรายการ</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute bottom-10 left-8 md:left-20 flex items-center gap-6 z-10">
                <div className="flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className="group relative py-2"
                        >
                            <div className={cn(
                                "h-1.5 rounded-full transition-all duration-500",
                                index === currentSlide ? "bg-primary w-12" : "bg-foreground/10 w-4 group-hover:bg-foreground/20"
                            )} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="absolute right-8 bottom-10 flex gap-3 z-10">
                <button
                    onClick={() => paginate(-1)}
                    className="w-12 h-12 rounded-2xl glass-premium flex items-center justify-center hover:bg-white transition-all shadow-md active:scale-95 border border-white/50"
                >
                    <ChevronLeft size={24} className="text-foreground/70" />
                </button>
                <button
                    onClick={() => paginate(1)}
                    className="w-12 h-12 rounded-2xl !bg-primary flex items-center justify-center hover:!bg-primary-dark transition-all shadow-lg active:scale-95 text-white"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
