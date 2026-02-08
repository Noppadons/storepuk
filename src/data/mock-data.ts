import { Category, Product, HarvestBatch, Farm, Farmer, FreshnessLevel, FreshnessInfo, User, Order, OrderItem, Address, OrderStatus } from '@/types';

// Categories
export const categories: Category[] = [
    { id: '1', nameEn: 'Leafy Greens', nameTh: 'ผักใบเขียว', slug: 'leafy-greens', icon: '🥬', sortOrder: 1 },
    { id: '2', nameEn: 'Root Vegetables', nameTh: 'ผักหัว', slug: 'root-vegetables', icon: '🥕', sortOrder: 2 },
    { id: '3', nameEn: 'Fruit Vegetables', nameTh: 'ผักผล', slug: 'fruit-vegetables', icon: '🍅', sortOrder: 3 },
    { id: '4', nameEn: 'Herbs', nameTh: 'สมุนไพร', slug: 'herbs', icon: '🌿', sortOrder: 4 },
    { id: '5', nameEn: 'Gourds & Pods', nameTh: 'ผักฝัก', slug: 'gourds-pods', icon: '🥒', sortOrder: 5 },
    { id: '6', nameEn: 'Mushrooms', nameTh: 'เห็ด', slug: 'mushrooms', icon: '🍄', sortOrder: 6 },
];

// Farms
export const farms: Farm[] = [
    {
        id: 'f1',
        name: 'ฟาร์มสุขใจ',
        province: 'เชียงใหม่',
        isVerified: true,
        certification: 'GAP',
        certifications: ['GAP'],
        description: 'ฟาร์มผักปลอดสารพิษบนดอยเชียงใหม่ อากาศเย็นตลอดปี ผักจึงหวานกรอบเป็นพิเศษ',
        farmerName: 'ลุงสมชาย',
        established: 2550,
        area: '10 ไร่',
        specialties: ['ผักเมืองหนาว', 'กะหล่ำปลี'],
        image: '🏔️'
    },
    {
        id: 'f2',
        name: 'สวนผักบ้านไร่',
        province: 'นครปฐม',
        isVerified: true,
        certification: 'Organic Thailand',
        certifications: ['Organic Thailand'],
        description: 'สวนผักออร์แกนิค 100% ไม่ใช้สารเคมี ใช้ปุ๋ยหมักทำเอง มั่นใจได้ในความปลอดภัย',
        farmerName: 'ป้าสมหญิง',
        established: 2558,
        area: '5 ไร่',
        specialties: ['ผักใบเขียว', 'คะน้า'],
        image: '🏡'
    },
    {
        id: 'f3',
        name: 'ไร่ทองคำ',
        province: 'ขอนแก่น',
        isVerified: true,
        certifications: [],
        description: 'ไร่นาส่วนผสม ปลูกผักตามฤดูกาล เน้นความเป็นธรรมชาติและวิถีชาวบ้าน',
        farmerName: 'พี่เอก',
        established: 2562,
        area: '15 ไร่',
        specialties: ['ผักพื้นบ้าน', 'มะเขือเทศ'],
        image: '🌾'
    },
    {
        id: 'f4',
        name: 'ฟาร์มรักษ์โลก',
        province: 'เชียงราย',
        isVerified: true,
        certification: 'GAP',
        certifications: ['GAP'],
        description: 'ฟาร์มเกษตรสมัยใหม่ ใช้เทคโนโลยีช่วยในการดูแลรักษาคุณภาพผลผลิต',
        farmerName: 'น้องแนน',
        established: 2564,
        area: '8 ไร่',
        specialties: ['ผักสลัด', 'สมุนไพร'],
        image: '🌍'
    },
];

// Farmers
export const farmers: Farmer[] = [
    { id: 'fa1', name: 'ลุงสมชาย', farm: farms[0] },
    { id: 'fa2', name: 'ป้าสมหญิง', farm: farms[1] },
    { id: 'fa3', name: 'พี่เอก', farm: farms[2] },
    { id: 'fa4', name: 'น้องแนน', farm: farms[3] },
];

// Helper to create dates relative to today
const daysAgo = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
};

const daysFromNow = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

// Harvest Batches
export const harvestBatches: HarvestBatch[] = [
    {
        id: 'b1',
        productId: 'p1',
        farmer: farmers[0],
        harvestDate: daysAgo(1),
        quantityKg: 50,
        remainingKg: 35,
        pricePerKg: 45,
        qualityGrade: 'A',
        photos: ['/vegetables/cabbage.jpg'],
        expiresAt: daysFromNow(6),
        status: 'available',
    },
    {
        id: 'b2',
        productId: 'p2',
        farmer: farmers[1],
        harvestDate: daysAgo(0),
        quantityKg: 30,
        remainingKg: 28,
        pricePerKg: 55,
        qualityGrade: 'A',
        photos: ['/vegetables/kale.jpg'],
        expiresAt: daysFromNow(5),
        status: 'available',
    },
    {
        id: 'b3',
        productId: 'p3',
        farmer: farmers[0],
        harvestDate: daysAgo(2),
        quantityKg: 40,
        remainingKg: 15,
        pricePerKg: 35,
        qualityGrade: 'A',
        photos: ['/vegetables/morning-glory.jpg'],
        expiresAt: daysFromNow(3),
        status: 'available',
    },
    {
        id: 'b4',
        productId: 'p4',
        farmer: farmers[2],
        harvestDate: daysAgo(1),
        quantityKg: 25,
        remainingKg: 20,
        pricePerKg: 65,
        qualityGrade: 'A',
        photos: ['/vegetables/tomato.jpg'],
        expiresAt: daysFromNow(7),
        status: 'available',
    },
    {
        id: 'b5',
        productId: 'p5',
        farmer: farmers[3],
        harvestDate: daysAgo(0),
        quantityKg: 20,
        remainingKg: 18,
        pricePerKg: 80,
        qualityGrade: 'A',
        photos: ['/vegetables/basil.jpg'],
        expiresAt: daysFromNow(4),
        status: 'available',
    },
    {
        id: 'b6',
        productId: 'p6',
        farmer: farmers[1],
        harvestDate: daysAgo(1),
        quantityKg: 35,
        remainingKg: 30,
        pricePerKg: 40,
        qualityGrade: 'A',
        photos: ['/vegetables/cucumber.jpg'],
        expiresAt: daysFromNow(5),
        status: 'available',
    },
    {
        id: 'b7',
        productId: 'p7',
        farmer: farmers[2],
        harvestDate: daysAgo(0),
        quantityKg: 15,
        remainingKg: 12,
        pricePerKg: 120,
        qualityGrade: 'A',
        photos: ['/vegetables/shiitake.jpg'],
        expiresAt: daysFromNow(4),
        status: 'available',
    },
    {
        id: 'b8',
        productId: 'p8',
        farmer: farmers[0],
        harvestDate: daysAgo(1),
        quantityKg: 25,
        remainingKg: 20,
        pricePerKg: 50,
        qualityGrade: 'A',
        photos: ['/vegetables/carrot.jpg'],
        expiresAt: daysFromNow(10),
        status: 'available',
    },
];

// Products
export const products: Product[] = [
    {
        id: 'p1',
        categoryId: categories[0].id,
        category: categories[0],
        nameEn: 'Chinese Cabbage',
        nameTh: 'ผักกาดขาว',
        slug: 'chinese-cabbage',
        description: 'ผักกาดขาวสดจากฟาร์ม ใบหนา กรอบ หวานธรรมชาติ เหมาะสำหรับผัด ต้มจืด หรือทำสลัด',
        unit: 'กก.',
        shelfLifeDays: 7,
        storageTemp: '2-8°C',
        basePrice: 45,
        activeBatches: [harvestBatches[0]],
    },
    {
        id: 'p2',
        categoryId: categories[1].id,
        category: categories[0],
        nameEn: 'Kale',
        nameTh: 'คะน้า',
        slug: 'kale',
        description: 'คะน้าใบหนา ก้านกรอบ ไม่มีเส้นใย เก็บสดใหม่ทุกเช้า เหมาะสำหรับผัดน้ำมันหอย',
        unit: 'กก.',
        shelfLifeDays: 5,
        storageTemp: '2-8°C',
        basePrice: 55,
        activeBatches: [harvestBatches[1]],
    },
    {
        id: 'p3',
        categoryId: categories[0].id,
        category: categories[0],
        nameEn: 'Morning Glory',
        nameTh: 'ผักบุ้ง',
        slug: 'morning-glory',
        description: 'ผักบุ้งไทย ก้านกรอบ ใบสด ไม่ฉีดยา ปลอดภัย เหมาะสำหรับผัดไฟแดง',
        unit: 'กก.',
        shelfLifeDays: 3,
        storageTemp: '2-8°C',
        basePrice: 35,
        activeBatches: [harvestBatches[2]],
    },
    {
        id: 'p4',
        categoryId: categories[2].id,
        category: categories[2],
        nameEn: 'Cherry Tomato',
        nameTh: 'มะเขือเทศราชินี',
        slug: 'cherry-tomato',
        description: 'มะเขือเทศราชินีสีแดงสด รสหวานอมเปรี้ยว เหมาะสำหรับทำสลัดหรือทานสด',
        unit: 'กก.',
        shelfLifeDays: 7,
        storageTemp: '10-15°C',
        basePrice: 65,
        activeBatches: [harvestBatches[3]],
    },
    {
        id: 'p5',
        categoryId: categories[3].id,
        category: categories[3],
        nameEn: 'Thai Basil',
        nameTh: 'กะเพรา',
        slug: 'thai-basil',
        description: 'กะเพราแดง ใบหอม กลิ่นเข้ม สดใหม่จากสวน เก็บเช้าส่งบ่าย',
        unit: 'กก.',
        shelfLifeDays: 4,
        storageTemp: '10-15°C',
        basePrice: 80,
        activeBatches: [harvestBatches[4]],
    },
    {
        id: 'p6',
        categoryId: categories[1].id,
        category: categories[4],
        nameEn: 'Cucumber',
        nameTh: 'แตงกวา',
        slug: 'cucumber',
        description: 'แตงกวาสดกรอบ ไม่มีรสขม เหมาะสำหรับจิ้มน้ำพริก ทำสลัด หรือทานสด',
        unit: 'กก.',
        shelfLifeDays: 5,
        storageTemp: '10-15°C',
        basePrice: 40,
        activeBatches: [harvestBatches[5]],
    },
    {
        id: 'p7',
        categoryId: categories[5].id,
        category: categories[5],
        nameEn: 'Shiitake Mushroom',
        nameTh: 'เห็ดหอม',
        slug: 'shiitake-mushroom',
        description: 'เห็ดหอมสด เนื้อหนา กลิ่นหอม รสชาติเข้มข้น เหมาะสำหรับผัด ต้ม หรือทำซุป',
        unit: 'กก.',
        shelfLifeDays: 5,
        storageTemp: '2-8°C',
        basePrice: 120,
        activeBatches: [harvestBatches[6]],
    },
    {
        id: 'p8',
        categoryId: categories[1].id,
        category: categories[1],
        nameEn: 'Carrot',
        nameTh: 'แครอท',
        slug: 'carrot',
        description: 'แครอทสดหวาน สีส้มสด เนื้อกรอบ เหมาะสำหรับทำน้ำ ผัด หรือทานสด',
        unit: 'กก.',
        shelfLifeDays: 14,
        storageTemp: '2-8°C',
        basePrice: 50,
        activeBatches: [harvestBatches[7]],
    },
];

// Freshness calculation
export const calculateFreshness = (harvestDate: Date | string) => {
    const date = new Date(harvestDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const daysFromHarvest = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (daysFromHarvest <= 1) {
        return {
            level: 'very_fresh',
            labelTh: 'สดมาก',
            labelEn: 'Very Fresh',
            daysFromHarvest,
            color: '#22C55E',
            bgColor: 'rgba(34, 197, 94, 0.15)',
        };
    } else if (daysFromHarvest <= 3) {
        return {
            level: 'fresh',
            labelTh: 'สด',
            labelEn: 'Fresh',
            daysFromHarvest,
            color: '#84CC16',
            bgColor: 'rgba(132, 204, 22, 0.15)',
        };
    } else if (daysFromHarvest <= 5) {
        return {
            level: 'normal',
            labelTh: 'ปกติ',
            labelEn: 'Normal',
            daysFromHarvest,
            color: '#EAB308',
            bgColor: 'rgba(234, 179, 8, 0.15)',
        };
    } else {
        return {
            level: 'expiring',
            labelTh: 'ใกล้หมดอายุ',
            labelEn: 'Expiring',
            daysFromHarvest,
            color: '#EA580C',
            bgColor: 'rgba(234, 88, 12, 0.15)',
        };
    }
}

// Format date to Thai Buddhist calendar
export function formatThaiDate(date: Date): string {
    const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // Buddhist year

    return `${day} ${month} ${year.toString().slice(-2)}`;
}

// Format price to Thai Baht
export function formatPrice(price: number): string {
    return `฿${price.toLocaleString('th-TH')}`;
}

// Users
export const users: User[] = [
    {
        id: 'u1',
        email: 'somchai@email.com',
        phone: '081-234-5678',
        fullName: 'คุณสมชาย รักผัก',
        role: 'customer',
        loyaltyPoints: 1250,
        addresses: [
            {
                id: 'a1',
                label: 'บ้าน',
                fullName: 'คุณสมชาย รักผัก',
                phone: '081-234-5678',
                address: '123/45 ถ.สุขุมวิท',
                subdistrict: 'คลองตันเหนือ',
                district: 'วัฒนา',
                province: 'กรุงเทพมหานคร',
                postalCode: '10110',
                isDefault: true
            }
        ]
    },
    {
        id: 'u_admin',
        email: 'admin@sodsai.com',
        phone: '080-000-0000',
        fullName: 'Admin System',
        role: 'admin',
        loyaltyPoints: 0,
        password: 'password123'
    }
];


// Orders
export const orders: Order[] = [
    {
        id: 'o1',
        orderNumber: 'VEG-2569020847',
        user: users[0],
        address: users[0].addresses![0],
        items: [
            { id: 'oi1', batch: harvestBatches[0], quantityKg: 2, unitPrice: 45, totalPrice: 90 }, // Farmer 1
            { id: 'oi2', batch: harvestBatches[1], quantityKg: 1, unitPrice: 55, totalPrice: 55 }  // Farmer 2
        ],
        subtotal: 145,
        deliveryFee: 0,
        discount: 0,
        total: 145,
        status: 'shipping',
        deliveryDate: daysFromNow(1),
        timeSlot: '09:00 - 12:00',
        createdAt: daysAgo(0)
    },
    {
        id: 'o2',
        orderNumber: 'VEG-2569020512',
        user: users[0],
        address: users[0].addresses![0],
        items: [
            { id: 'oi3', batch: harvestBatches[0], quantityKg: 5, unitPrice: 45, totalPrice: 225 } // Farmer 1
        ],
        subtotal: 225,
        deliveryFee: 50,
        discount: 0,
        total: 275,
        status: 'delivered',
        deliveryDate: daysAgo(1),
        timeSlot: '13:00 - 16:00',
        createdAt: daysAgo(3)
    },
    {
        id: 'o3',
        orderNumber: 'VEG-2569012001',
        user: users[0],
        address: users[0].addresses![0],
        items: [
            { id: 'oi4', batch: harvestBatches[2], quantityKg: 10, unitPrice: 35, totalPrice: 350 } // Farmer 1
        ],
        subtotal: 350,
        deliveryFee: 0,
        discount: 0,
        total: 350,
        status: 'pending',
        deliveryDate: daysFromNow(2),
        timeSlot: '09:00 - 12:00',
        createdAt: daysAgo(0)
    }
];
