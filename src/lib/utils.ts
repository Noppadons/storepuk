
import { FreshnessInfo } from '@/types';

export const calculateFreshness = (harvestDate: Date | string): FreshnessInfo => {
    const date = new Date(harvestDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const daysFromHarvest = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (daysFromHarvest <= 1) {
        return {
            level: 'very_fresh',
            labelTh: 'สดมาก',
            labelEn: 'Very Fresh',
            color: '#22c55e', // green-500
            bgColor: '#dcfce7', // green-100
            daysFromHarvest
        };
    } else if (daysFromHarvest <= 3) {
        return {
            level: 'fresh',
            labelTh: 'สด',
            labelEn: 'Fresh',
            color: '#84cc16', // lime-500
            bgColor: '#ecfccb', // lime-100
            daysFromHarvest
        };
    } else if (daysFromHarvest <= 7) {
        return {
            level: 'normal',
            labelTh: 'ปกติ',
            labelEn: 'Normal',
            color: '#eab308', // yellow-500
            bgColor: '#fef9c3', // yellow-100
            daysFromHarvest
        };
    } else {
        return {
            level: 'expiring',
            labelTh: 'ใกล้เสีย',
            labelEn: 'Expiring',
            color: '#f97316', // orange-500
            bgColor: '#ffedd5', // orange-100
            daysFromHarvest
        };
    }
};

export const formatThaiDate = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};
