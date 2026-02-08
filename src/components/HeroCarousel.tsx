'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    cta: string;
    ctaLink: string;
    bgGradient: string;
    icon: string;
}

const slides: Slide[] = [
    {
        id: 1,
        title: 'ผักสดวันนี้จากเชียงใหม่',
        subtitle: 'ส่งฟรี! สั่งก่อน 15:00',
        cta: 'สั่งเลย',
        ctaLink: '/products',
        bgGradient: 'from-green-50 to-green-100',
        icon: '🥬',
    },
    {
        id: 2,
        title: 'สมุนไพรสดจากสวน',
        subtitle: 'เก็บเช้า ส่งบ่าย ไม่ผ่านคนกลาง',
        cta: 'ดูสินค้า',
        ctaLink: '/category/herbs',
        bgGradient: 'from-lime-50 to-lime-100',
        icon: '🌿',
    },
    {
        id: 3,
        title: 'ลด 20% เห็ดสดทุกชนิด',
        subtitle: 'โปรโมชันพิเศษเฉพาะสัปดาห์นี้',
        cta: 'รับส่วนลด',
        ctaLink: '/category/mushrooms',
        bgGradient: 'from-amber-50 to-amber-100',
        icon: '🍄',
    },
];

export function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <div className="relative overflow-hidden rounded-2xl">
            {/* Slides */}
            <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className={`min-w-full bg-gradient-to-br ${slide.bgGradient} p-6 md:p-10`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="max-w-lg">
                                <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
                                    {slide.title}
                                </h2>
                                <p className="text-lg text-foreground-muted mb-6">
                                    {slide.subtitle}
                                </p>
                                <Link href={slide.ctaLink} className="btn btn-primary">
                                    {slide.cta}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                            <div className="hidden md:block text-8xl animate-pulse-soft">
                                {slide.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                                ? 'bg-primary w-6'
                                : 'bg-secondary-light hover:bg-secondary'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Arrows */}
            <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors shadow-md"
                aria-label="Previous slide"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors shadow-md"
                aria-label="Next slide"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
