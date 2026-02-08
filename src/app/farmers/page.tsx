import { Header, Footer } from '@/components';
import { farms } from '@/data/mock-data';
import Link from 'next/link';

const additionalFarms = [
    {
        id: 'f5',
        name: 'สวนผักคุณยาย',
        province: 'ราชบุรี',
        description: 'สวนผักพื้นบ้านแบบดั้งเดิม ปลูกด้วยวิธีธรรมชาติ',
        certifications: ['GAP'],
        specialties: ['ผักพื้นบ้าน', 'ผักสลัด'],
        image: '👵',
        farmerName: 'คุณยายสมศรี',
        established: 2555,
        area: '3 ไร่',
    },
    {
        id: 'f6',
        name: 'ฟาร์มตะวันรุ่ง',
        province: 'นครปฐม',
        description: 'เชี่ยวชาญเรื่องผักไฮโดรโปนิกส์คุณภาพสูง',
        certifications: ['Organic', 'GAP'],
        specialties: ['ผักไฮโดร', 'สลัดหลากหลาย'],
        image: '🌅',
        farmerName: 'คุณประวิทย์',
        established: 2563,
        area: '5 ไร่',
    },
];

const allFarms = [
    ...farms.map(f => ({
        id: f.id,
        name: f.name,
        province: f.province,
        description: f.description || 'ฟาร์มผักคุณภาพดี ปลอดภัย ใส่ใจผู้บริโภค',
        certifications: f.certifications || (f.certification ? [f.certification] : []),
        specialties: f.specialties || ['ผักคุณภาพ', 'สดใหม่ทุกวัน'],
        image: f.image || '🌱',
        farmerName: f.farmerName || 'เกษตรกรพันธมิตร',
        established: f.established || 2560,
        area: f.area || '5 ไร่',
    })),
    ...additionalFarms,
];

const provinces = ['ทั้งหมด', 'เชียงใหม่', 'นครปฐม', 'ราชบุรี', 'กาญจนบุรี'];

export default function FarmersPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-16">
                    <div className="container-app">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                🧑‍🌾 ฟาร์มของเรา
                            </h1>
                            <p className="text-xl text-foreground-muted mb-4">
                                รู้จักเกษตรกรผู้ปลูกผักสดที่คุณกิน
                            </p>
                            <p className="text-foreground-muted">
                                เราคัดเลือกฟาร์มคุณภาพจากทั่วประเทศ ทุกฟาร์มผ่านมาตรฐาน GAP หรือ Organic
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-8 bg-white border-b">
                    <div className="container-app">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-3xl font-bold text-primary">500+</p>
                                <p className="text-sm text-foreground-muted">เกษตรกรพันธมิตร</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary">77</p>
                                <p className="text-sm text-foreground-muted">จังหวัด</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary">100%</p>
                                <p className="text-sm text-foreground-muted">ผ่านมาตรฐาน</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters */}
                <section className="py-6 bg-surface-hover sticky top-16 z-40">
                    <div className="container-app">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {provinces.map((province) => (
                                <button
                                    key={province}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${province === 'ทั้งหมด'
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-foreground hover:bg-primary/10'
                                        }`}
                                >
                                    {province}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Farm Grid */}
                <section className="py-12">
                    <div className="container-app">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allFarms.map((farm) => (
                                <div key={farm.id} className="card overflow-hidden group">
                                    {/* Farm Image */}
                                    <div className="aspect-video bg-gradient-to-br from-green-50 to-lime-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                                        {farm.image}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-semibold text-lg">{farm.name}</h3>
                                                <p className="text-sm text-foreground-muted">📍 {farm.province}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                {farm.certifications?.includes('Organic') && (
                                                    <span className="badge bg-green-100 text-green-700 text-xs">Organic</span>
                                                )}
                                                {farm.certifications?.includes('GAP') && (
                                                    <span className="badge bg-blue-100 text-blue-700 text-xs">GAP</span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-sm text-foreground-muted mb-4 line-clamp-2">
                                            {farm.description}
                                        </p>

                                        {/* Farmer Info */}
                                        <div className="flex items-center gap-3 mb-4 p-3 bg-surface-hover rounded-lg">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                                                👨‍🌾
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{farm.farmerName}</p>
                                                <p className="text-xs text-foreground-muted">
                                                    ก่อตั้ง พ.ศ. {farm.established} • {farm.area}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Specialties */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {(Array.isArray(farm.specialties)
                                                ? farm.specialties
                                                : farm.specialties
                                                    ? [farm.specialties]
                                                    : []
                                            ).map((specialty, idx) => (
                                                <span key={idx} className="text-xs bg-surface-hover px-2 py-1 rounded-full">
                                                    {specialty}
                                                </span>
                                            ))}
                                        </div>

                                        <Link
                                            href={`/farm/${farm.id}`}
                                            className="btn btn-secondary w-full text-center"
                                        >
                                            ดูผักจากฟาร์มนี้
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Join CTA */}
                <section className="py-16 bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                    <div className="container-app text-center">
                        <span className="text-5xl block mb-4">🌾</span>
                        <h2 className="text-3xl font-bold mb-4">คุณเป็นเกษตรกรหรือเปล่า?</h2>
                        <p className="text-amber-100 mb-8 max-w-xl mx-auto">
                            มาร่วมเป็นพันธมิตรกับเรา ขายผักสดตรงถึงลูกค้า ได้ราคาดี ไม่ผ่านคนกลาง
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/farmer-register" className="btn bg-white text-orange-600 hover:bg-orange-50">
                                สมัครเป็นพันธมิตร
                            </Link>
                            <Link href="/farmer-info" className="btn border-2 border-white text-white hover:bg-white/10">
                                ดูข้อมูลเพิ่มเติม
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Trust Section */}
                <section className="py-16">
                    <div className="container-app">
                        <h2 className="text-2xl font-bold text-center mb-12">เราคัดสรรฟาร์มอย่างไร</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                                    📋
                                </div>
                                <h3 className="font-semibold mb-2">ตรวจสอบใบรับรอง</h3>
                                <p className="text-sm text-foreground-muted">
                                    ทุกฟาร์มต้องมีใบรับรอง GAP หรือ Organic ที่ถูกต้อง
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-3xl">
                                    🔍
                                </div>
                                <h3 className="font-semibold mb-2">เยี่ยมฟาร์มจริง</h3>
                                <p className="text-sm text-foreground-muted">
                                    ทีมงานของเราลงพื้นที่เยี่ยมฟาร์มทุกแห่งก่อนรับเข้ามา
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center text-3xl">
                                    ⭐
                                </div>
                                <h3 className="font-semibold mb-2">ติดตามคุณภาพ</h3>
                                <p className="text-sm text-foreground-muted">
                                    ระบบคะแนนจากลูกค้าช่วยให้เรารักษาคุณภาพตลอด
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
