// Types for SodSai Vegetable E-Commerce Platform

export interface Category {
    id: string;
    nameEn: string;
    nameTh: string;
    slug: string;
    icon?: string | null;
    sortOrder: number;
}

export interface Farm {
    id: string;
    name: string;
    province: string;
    isVerified: boolean;
    certification?: string; // Deprecated, use certifications
    certifications?: string[] | string | null;
    description?: string | null;
    image?: string | null;
    farmerName?: string | null;
    established?: number | null;
    area?: string | null;
    specialties?: string[] | string | null;
}

export interface Farmer {
    id: string;
    name: string;
    farm: Farm;
}

export interface HarvestBatch {
    id: string;
    productId: string;
    // farmer: Farmer; // Simplify for now or match seeding structure
    farmer?: Farmer; // Use `Farmer` type instead of `any` to satisfy type checks
    harvestDate: Date | string; // Date on server, string on client
    quantityKg: number;
    remainingKg: number;
    pricePerKg: number;
    qualityGrade: string;
    photos?: string[]; // JSON string in DB, but parsed
    expiresAt?: Date | string;
    status: string;
    farm?: Farm; // Added for relation
    farmId?: string;
    product?: Product;
}

export interface Product {
    id: string;
    category: Category;
    categoryId: string;
    nameEn: string;
    nameTh: string;
    slug: string;
    description: string | null;
    unit: string;
    shelfLifeDays: number;
    storageTemp?: string | null;
    basePrice?: number; // Deprecated, kept for mock data compatibility
    activeBatches?: HarvestBatch[]; // Optional, populated via include
    batches?: HarvestBatch[]; // Prisma uses 'batches' relation name
    images?: string[]; // Added
    farms?: Farm[];
}

export interface CartItem {
    id?: string; // cart item id
    product: Product;
    batch: HarvestBatch;
    quantityKg: number;
}

export interface Address {
    id: string;
    label: string | null;
    fullName: string;
    phone: string;
    address: string;
    subdistrict: string;
    district: string;
    province: string;
    postalCode: string;
    isDefault: boolean;
}

export interface User {
    id: string;
    email: string;
    password?: string;
    phone?: string;
    name?: string;
    fullName?: string; // legacy support if needed
    image?: string;
    role: 'customer' | 'admin' | 'farmer';
    loyaltyPoints: number;
    addresses?: Address[];
}

export interface OrderItem {
    id: string;
    batch: HarvestBatch;
    quantityKg: number;
    unitPrice: number;
    totalPrice: number;
}

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'picking'
    | 'packed'
    | 'shipping'
    | 'delivered'
    | 'cancelled';

export interface Order {
    id: string;
    orderNumber: string;
    user: User;
    address: Address;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    status: OrderStatus;
    deliveryDate: Date;
    timeSlot: string;
    createdAt: Date;
}

// Freshness calculation helpers
export type FreshnessLevel = 'very_fresh' | 'fresh' | 'normal' | 'expiring';

export interface FreshnessInfo {
    level: FreshnessLevel;
    labelTh: string;
    labelEn: string;
    daysFromHarvest: number;
    color: string;
    bgColor: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, { th: string; en: string }> = {
    pending: { th: 'รอยืนยัน', en: 'Pending' },
    confirmed: { th: 'ยืนยันแล้ว', en: 'Confirmed' },
    picking: { th: 'กำลังจัดเตรียม', en: 'Picking' },
    packed: { th: 'พร้อมจัดส่ง', en: 'Packed' },
    shipping: { th: 'กำลังจัดส่ง', en: 'Shipping' },
    delivered: { th: 'จัดส่งแล้ว', en: 'Delivered' },
    cancelled: { th: 'ยกเลิก', en: 'Cancelled' },
};
