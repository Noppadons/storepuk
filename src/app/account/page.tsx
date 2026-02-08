
'use client';

import { Header, Footer } from '@/components';
import { formatPrice, formatThaiDate } from '@/lib/utils'; // corrected import
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Order } from '@/types';

type Tab = 'overview' | 'orders' | 'addresses' | 'favorites' | 'settings';

export default function AccountPage() {
    const { user, loading, logout, updateUser } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Profile form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            setFormData({
                fullName: user.name || user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
            });
            fetchOrders();
        }
    }, [user, loading, router]);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!user) return;

        try {
            // Optimistic update
            updateUser(formData);

            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to update profile');
            }

            
            alert('บันทึกข้อมูลสำเร็จ');
        } catch (error) {
            console.error('Update failed:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'confirmed': return 'bg-blue-100 text-blue-700';
            case 'shipping': return 'bg-purple-100 text-purple-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Calculate stats
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const activeOrders = orders.filter(o => ['pending', 'confirmed', 'picking', 'packed', 'shipping'].includes(o.status)).length;

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const tabs = [
        { key: 'overview' as Tab, label: 'ภาพรวม', icon: '📊' },
        { key: 'orders' as Tab, label: 'คำสั่งซื้อ', icon: '📦' },
        { key: 'addresses' as Tab, label: 'ที่อยู่', icon: '📍' },
        { key: 'favorites' as Tab, label: 'รายการโปรด', icon: '❤️' },
        { key: 'settings' as Tab, label: 'ตั้งค่า', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container-app py-8">
                {/* Breadcrumb */}
                <nav className="text-sm text-foreground-muted mb-6">
                    <Link href="/" className="hover:text-primary">หน้าแรก</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">บัญชีของฉัน</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* User Card */}
                        <div className="card p-6 mb-4">
                            <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl overflow-hidden">
                                    {(user.image) ? <Image src={user.image} alt="User" width={64} height={64} className="rounded-full object-cover" /> : '👤'}
                                </div>
                                <div>
                                    <h2 className="font-semibold">{user.name || user.fullName}</h2>
                                    <p className="text-sm text-foreground-muted">{user.email}</p>
                                </div>
                            </div>
                            <div className="p-3 bg-accent/10 rounded-lg flex items-center gap-3">
                                <span className="text-2xl">🏆</span>
                                <div>
                                    <p className="text-xs text-foreground-muted">คะแนนสะสม</p>
                                    <p className="font-bold text-accent">{user.loyaltyPoints?.toLocaleString() || 0} แต้ม</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="card overflow-hidden">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeTab === tab.key
                                        ? 'bg-primary/10 text-primary border-l-4 border-primary'
                                        : 'hover:bg-surface-hover border-l-4 border-transparent'
                                        }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-error hover:bg-red-50 transition-colors border-l-4 border-transparent"
                            >
                                <span>🚪</span>
                                <span className="font-medium">ออกจากระบบ</span>
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="animate-fadeIn">
                                <h1 className="text-2xl font-bold mb-6">ภาพรวม</h1>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="card p-4 text-center">
                                        <p className="text-3xl font-bold text-primary">{totalOrders}</p>
                                        <p className="text-sm text-foreground-muted">คำสั่งซื้อทั้งหมด</p>
                                    </div>
                                    <div className="card p-4 text-center">
                                        <p className="text-3xl font-bold text-green-600">{deliveredOrders}</p>
                                        <p className="text-sm text-foreground-muted">จัดส่งสำเร็จ</p>
                                    </div>
                                    <div className="card p-4 text-center">
                                        <p className="text-3xl font-bold text-purple-600">{activeOrders}</p>
                                        <p className="text-sm text-foreground-muted">กำลังดำเนินการ</p>
                                    </div>
                                    <div className="card p-4 text-center">
                                        <p className="text-3xl font-bold text-accent">{user.loyaltyPoints || 0}</p>
                                        <p className="text-sm text-foreground-muted">คะแนนสะสม</p>
                                    </div>
                                </div>

                                {/* Recent Orders */}
                                <div className="card p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold">คำสั่งซื้อล่าสุด</h3>
                                        <button
                                            onClick={() => setActiveTab('orders')}
                                            className="text-primary text-sm"
                                        >
                                            ดูทั้งหมด
                                        </button>
                                    </div>
                                    {loadingOrders ? (
                                        <p>Loading orders...</p>
                                    ) : orders.length === 0 ? (
                                        <p className="text-foreground-muted">ไม่มีการสั่งซื้อล่าสุด</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.slice(0, 3).map((order) => (
                                                <div key={order.id} className="flex items-center justify-between p-3 bg-surface-hover rounded-lg">
                                                    <div>
                                                        <p className="font-medium">#{order.id.slice(-8)}</p>
                                                        <p className="text-sm text-foreground-muted">
                                                            {formatThaiDate(order.createdAt)} • {order.items.length} รายการ
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-primary">{formatPrice(order.total)}</p>
                                                        <span className={`badge text-xs ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="animate-fadeIn">
                                <h1 className="text-2xl font-bold mb-6">📦 คำสั่งซื้อของฉัน</h1>

                                {loadingOrders ? (
                                    <p>Loading orders...</p>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <span className="text-6xl block mb-4">📦</span>
                                        <h3 className="text-xl font-semibold mb-2">ไม่มีคำสั่งซื้อ</h3>
                                        <Link href="/products" className="btn btn-primary mt-4">เลือกซื้อสินค้า</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="card p-6">
                                                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold">#{order.id.slice(-8)}</h3>
                                                            <span className={`badge text-xs ${getStatusColor(order.status)}`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-foreground-muted">
                                                            {formatThaiDate(order.createdAt)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-primary">{formatPrice(order.total)}</p>
                                                        <p className="text-sm text-foreground-muted">{order.items.length} รายการ</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button className="btn btn-secondary py-2 px-4 text-sm">
                                                        ดูรายละเอียด
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="animate-fadeIn">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">📍 ที่อยู่จัดส่ง</h1>
                                    <button className="btn btn-primary">
                                        + เพิ่มที่อยู่ใหม่
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {user.addresses?.map((addr) => (
                                        <div key={addr.id} className="card p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">📍</span>
                                                    <span className="font-semibold">{addr.label}</span>
                                                    {addr.isDefault && (
                                                        <span className="badge bg-primary/10 text-primary text-xs">ค่าเริ่มต้น</span>
                                                    )}
                                                </div>
                                                <button className="text-primary text-sm">แก้ไข</button>
                                            </div>
                                            <p className="font-medium">{addr.fullName}</p>
                                            <p className="text-sm text-foreground-muted">{addr.phone}</p>
                                            <p className="text-sm text-foreground-muted mt-2">
                                                {addr.address}, {addr.subdistrict}, {addr.district}, {addr.province} {addr.postalCode}
                                            </p>
                                        </div>
                                    ))}
                                    {(!user.addresses || user.addresses.length === 0) && (
                                        <p className="col-span-2 text-center text-foreground-muted">ยังไม่มีที่อยู่บันทึกไว้</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Favorites Tab - Placeholder */}
                        {activeTab === 'favorites' && (
                            <div className="animate-fadeIn">
                                <h1 className="text-2xl font-bold mb-6">❤️ รายการโปรด</h1>
                                <div className="text-center py-12">
                                    <span className="text-6xl block mb-4">💚</span>
                                    <h3 className="text-xl font-semibold mb-2">ยังไม่มีรายการโปรด</h3>
                                    <Link href="/products" className="btn btn-primary">
                                        เลือกซื้อสินค้า
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="animate-fadeIn">
                                <h1 className="text-2xl font-bold mb-6">⚙️ ตั้งค่าบัญชี</h1>

                                <div className="card p-6 mb-6">
                                    <h3 className="font-semibold mb-4">ข้อมูลส่วนตัว</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">ชื่อ-นามสกุล</label>
                                            <input
                                                type="text"
                                                className="input"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">เบอร์โทรศัพท์</label>
                                            <input
                                                type="tel"
                                                className="input"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-2">อีเมล</label>
                                            <input
                                                type="email"
                                                className="input"
                                                value={formData.email}
                                                disabled
                                                title="ไม่สามารถเปลี่ยนอีเมลได้"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-primary mt-4"
                                        onClick={handleUpdateProfile}
                                    >
                                        บันทึกข้อมูล
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
