'use client';

import { formatPrice, formatThaiDate } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface User {
    id: string;
    name?: string | null;
    email?: string | null;
}

interface Order {
    id: string;
    orderNumber: string;
    total: number;
    createdAt: string; // Assuming ISO string from API
    status: 'pending' | 'delivered' | 'shipping' | 'cancelled';
    user?: User | null;
}

interface Farm {
    id: string;
    name: string;
    province: string;
    isVerified: boolean;
    user?: User; // User associated with the farm
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalFarmers: 0,
        totalUsers: 0,
        pendingOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [farms, setFarms] = useState<Farm[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch Orders
            const ordersRes = await fetch('/api/orders');
            const orders: Order[] = await ordersRes.json();

            // Fetch Farmers
            const farmersRes = await fetch('/api/farmers');
            const farmers: Farm[] = await farmersRes.json();

            // Fetch All Users (for stats)
            const usersRes = await fetch('/api/user?all=true'); // We'll assume this works or fallback
            const users: User[] = await usersRes.json();

            const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
            const pendingOrders = orders.filter(o => o.status === 'pending').length;

            setStats({
                totalSales,
                totalOrders: orders.length,
                totalFarmers: farmers.length,
                totalUsers: Array.isArray(users) ? users.length : 0,
                pendingOrders
            });

            setRecentOrders(orders.slice(0, 10));
            setFarms(farmers);
        } catch (error) {
            console.error('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleVerifyFarmer = async (farmId: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/farmers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ farmId, isVerified: !currentStatus })
            });

            if (res.ok) {
                setFarms(farms.map(f => f.id === farmId ? { ...f, isVerified: !currentStatus } : f));
            }
        } catch (error) {
            console.error('Verify toggle error:', error);
        }
    };

    if (loading) return <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">กำลังโหลดข้อมูลแดชบอร์ด...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                    <p className="text-slate-500">ภาพรวมระบบเว็บไซต์ มาซื้อผักกันเถอะ</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <p className="text-slate-500 text-sm mb-1">ยอดขายรวม</p>
                    <h3 className="text-2xl font-bold text-slate-800">{formatPrice(stats.totalSales)}</h3>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <p className="text-slate-500 text-sm mb-1">คำสั่งซื้อทั้งหมด</p>
                    <h3 className="text-2xl font-bold text-slate-800">{stats.totalOrders}</h3>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <p className="text-slate-500 text-sm mb-1">เกษตรกร</p>
                    <h3 className="text-2xl font-bold text-slate-800">{stats.totalFarmers}</h3>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <p className="text-slate-500 text-sm mb-1">ผู้ใช้งาน</p>
                    <h3 className="text-2xl font-bold text-slate-800">{stats.totalUsers}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-slate-800">คำสั่งซื้อล่าสุด</h3>
                        <Link href="/admin/orders" className="text-blue-600 text-sm hover:underline">ดูทั้งหมด</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-3 text-sm font-semibold text-slate-600">Order ID</th>
                                    <th className="p-3 text-sm font-semibold text-slate-600">ลูกค้า</th>
                                    <th className="p-3 text-sm font-semibold text-slate-600">วันที่</th>
                                    <th className="p-3 text-sm font-semibold text-slate-600 text-right">ยอดรวม</th>
                                    <th className="p-3 text-sm font-semibold text-slate-600 text-center">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-slate-500">ไม่มีคำสั่งซื้อ</td>
                                    </tr>
                                ) : (
                                    recentOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-slate-50">
                                            <td className="p-3 font-medium">#{order.orderNumber}</td>
                                            <td className="p-3 text-slate-600">{order.user?.name || 'Unknown'}</td>
                                            <td className="p-3 text-slate-600">{formatThaiDate(new Date(order.createdAt))}</td>
                                            <td className="p-3 text-right font-bold text-slate-800">{formatPrice(order.total)}</td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Farmer Verification */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-6">อนุมัติเกษตรกร</h3>
                    <div className="space-y-4">
                        {farms.map(farm => (
                            <div key={farm.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-800">{farm.name}</p>
                                    <p className="text-xs text-slate-500">{farm.user?.name} · {farm.province}</p>
                                </div>
                                <button
                                    onClick={() => toggleVerifyFarmer(farm.id, farm.isVerified)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${farm.isVerified
                                            ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                                        }`}
                                >
                                    {farm.isVerified ? '✓ อนุมัติแล้ว' : 'รอการอนุมัติ'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
