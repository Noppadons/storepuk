import { Header, Footer } from '@/components';
import Link from 'next/link';

const teamMembers = [
    {
        name: 'คุณสมศักดิ์ รักชาวไร่',
        role: 'ผู้ก่อตั้งและ CEO',
        image: '👨‍💼',
        bio: 'มากกว่า 15 ปีในธุรกิจเกษตรกรรม',
    },
    {
        name: 'คุณนภา ใจดี',
        role: 'ผู้อำนวยการฝ่ายพันธมิตรเกษตรกร',
        image: '👩‍🌾',
        bio: 'เชี่ยวชาญด้านการเชื่อมต่อเกษตรกรกับตลาด',
    },
    {
        name: 'คุณธนภัทร เทคโน',
        role: 'CTO',
        image: '👨‍💻',
        bio: 'ผู้เชี่ยวชาญด้านเทคโนโลยีการเกษตร',
    },
];

const stats = [
    { value: '500+', label: 'เกษตรกรพันธมิตร' },
    { value: '77', label: 'จังหวัดทั่วไทย' },
    { value: '50,000+', label: 'ลูกค้าที่ไว้วางใจ' },
    { value: '100,000+', label: 'กก. ผักต่อเดือน' },
];

const values = [
    {
        icon: '🌱',
        title: 'ความสดใหม่',
        description: 'เก็บเกี่ยววันต่อวัน ส่งถึงมือเร็วที่สุด ติดตามความสดได้ตลอด',
    },
    {
        icon: '🤝',
        title: 'ความโปร่งใส',
        description: 'รู้ที่มาทุกผัก รู้จักเกษตรกร เห็นราคาที่เป็นธรรม',
    },
    {
        icon: '🌍',
        title: 'ความยั่งยืน',
        description: 'สนับสนุนเกษตรกรท้องถิ่น ลดคาร์บอนฟุตพริ้นท์',
    },
    {
        icon: '💚',
        title: 'สุขภาพดี',
        description: 'ผักคุณภาพดี ปลอดภัย มาตรฐาน GAP และออร์แกนิค',
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-green-50 to-lime-50 py-16 md:py-24">
                    <div className="container-app">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                🥬 มาซื้อผักกันเถอะ
                            </h1>
                            <p className="text-xl text-foreground-muted mb-8">
                                เชื่อมเกษตรกรไทยสู่ผู้บริโภค ผักสดจากไร่ ถึงมือคุณ
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/products" className="btn btn-primary">
                                    เริ่มซื้อผักสด
                                </Link>
                                <Link href="/farmers" className="btn btn-secondary">
                                    รู้จักเกษตรกรของเรา
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-12 bg-primary text-white">
                    <div className="container-app">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                                    <p className="text-green-100">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-16">
                    <div className="container-app">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">เรื่องราวของเรา</h2>
                                <div className="space-y-4 text-foreground-muted">
                                    <p>
                                        มาซื้อผักกันเถอะ เกิดจากความเชื่อที่ว่า ทุกคนควรได้กินผักสดที่มีคุณภาพ
                                        ในราคาที่เป็นธรรม และเกษตรกรสมควรได้รับค่าตอบแทนที่คุ้มค่ากับความเหนื่อยยาก
                                    </p>
                                    <p>
                                        เราเริ่มต้นในปี พ.ศ. 2566 จากเครือข่ายเกษตรกรเพียง 10 ราย
                                        ในจังหวัดเชียงใหม่ ปัจจุบันเราเชื่อมต่อกับเกษตรกรกว่า 500 รายทั่วประเทศ
                                    </p>
                                    <p>
                                        ระบบของเราติดตามความสดของผักตั้งแต่ตอนเก็บเกี่ยว
                                        เพื่อให้คุณมั่นใจว่าจะได้รับผักที่สดที่สุดเสมอ
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-100 rounded-2xl p-8 flex items-center justify-center text-6xl">
                                    🌾
                                </div>
                                <div className="bg-lime-100 rounded-2xl p-8 flex items-center justify-center text-6xl">
                                    🧑‍🌾
                                </div>
                                <div className="bg-amber-100 rounded-2xl p-8 flex items-center justify-center text-6xl">
                                    🚚
                                </div>
                                <div className="bg-emerald-100 rounded-2xl p-8 flex items-center justify-center text-6xl">
                                    🥗
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16 bg-surface-hover">
                    <div className="container-app">
                        <h2 className="text-3xl font-bold text-center mb-12">คุณค่าของเรา</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, index) => (
                                <div key={index} className="card p-6 text-center">
                                    <span className="text-5xl block mb-4">{value.icon}</span>
                                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                                    <p className="text-foreground-muted text-sm">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16">
                    <div className="container-app">
                        <h2 className="text-3xl font-bold text-center mb-12">วิธีการทำงาน</h2>
                        <div className="max-w-4xl mx-auto">
                            <div className="relative">
                                {/* Line */}
                                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2" />

                                {[
                                    { step: 1, title: 'เกษตรกรเก็บเกี่ยว', desc: 'ผักสดถูกเก็บเกี่ยวตอนเช้า และอัพเดทเข้าระบบทันที', icon: '🌿' },
                                    { step: 2, title: 'คุณสั่งซื้อ', desc: 'เลือกผักสดที่ต้องการ ดูวันเก็บเกี่ยวและความสด', icon: '📱' },
                                    { step: 3, title: 'คัดเกรดและบรรจุ', desc: 'ทีมงานคัดแยกคุณภาพและบรรจุด้วยความใส่ใจ', icon: '📦' },
                                    { step: 4, title: 'ส่งถึงบ้าน', desc: 'จัดส่งด้วยรถควบคุมอุณหภูมิ ถึงบ้านสดใหม่', icon: '🏠' },
                                ].map((item, index) => (
                                    <div key={item.step} className={`flex items-center gap-6 mb-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                                        <div className="hidden md:block flex-1" />
                                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-3xl shrink-0 z-10">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="card p-6">
                                                <span className="text-primary font-bold">ขั้นตอนที่ {item.step}</span>
                                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                                <p className="text-foreground-muted">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-16 bg-surface-hover">
                    <div className="container-app">
                        <h2 className="text-3xl font-bold text-center mb-12">ทีมผู้ก่อตั้ง</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="card p-6 text-center">
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-5xl">
                                        {member.image}
                                    </div>
                                    <h3 className="text-lg font-semibold">{member.name}</h3>
                                    <p className="text-primary text-sm mb-2">{member.role}</p>
                                    <p className="text-foreground-muted text-sm">{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-br from-primary to-green-600 text-white">
                    <div className="container-app text-center">
                        <h2 className="text-3xl font-bold mb-4">พร้อมเริ่มกินผักสดแล้วหรือยัง?</h2>
                        <p className="text-green-100 mb-8 max-w-xl mx-auto">
                            เริ่มต้นสั่งผักสดจากเกษตรกรไทยวันนี้ ส่งฟรีเมื่อสั่งครบ ฿500
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/products" className="btn bg-white text-primary hover:bg-green-50">
                                เลือกซื้อผักสด
                            </Link>
                            <Link href="/register" className="btn border-2 border-white text-white hover:bg-white/10">
                                สมัครสมาชิก
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
