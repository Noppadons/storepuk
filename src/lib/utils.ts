import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function calculateFreshness(harvestDate: Date | string) {
    const date = new Date(harvestDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
        return {
            labelTh: 'สดมากที่สุด',
            level: 'very_fresh',
            color: '#16A34A',
            bgColor: '#DCFCE7',
            daysFromHarvest: diffDays
        };
    } else if (diffDays <= 3) {
        return {
            labelTh: 'สดใหม่',
            level: 'fresh',
            color: '#65A30D',
            bgColor: '#F7FEE7',
            daysFromHarvest: diffDays
        };
    } else if (diffDays <= 5) {
        return {
            labelTh: 'คุณภาพปกติ',
            level: 'normal',
            color: '#CA8A04',
            bgColor: '#FEF9C3',
            daysFromHarvest: diffDays
        };
    } else {
        return {
            labelTh: 'ใกล้หมดอายุ',
            level: 'expiring',
            color: '#EA580C',
            bgColor: '#FFEDD5',
            daysFromHarvest: diffDays
        };
    }
}

export function formatThaiDate(date: Date | string) {
    const d = new Date(date);
    return d.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
    });
}

export function formatPrice(price: number) {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
    }).format(price);
}
