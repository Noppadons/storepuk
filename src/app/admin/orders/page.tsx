'use client';

import { useEffect, useState } from 'react';
import { Order, OrderStatus, ORDER_STATUS_LABELS } from '@/types';
import { formatPrice, formatThaiDate } from '@/lib/utils';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
        setUpdatingOrderId(orderId);
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus })
            });

            if (res.ok) {
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            } else {
                alert('อัปเดตสถานะไม่สำเร็จ');
            }
        } catch (error) {
            console.error('Update status error:', error);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    if (loading) return <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">กำลังโหลดคำสั่งซื้อ...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">จัดการคำสั่งซื้อ (Orders)</h1>
                <p className="text-slate-500">รายการสั่งซื้อผักทั้งหมดจากลูกค้าทุกคน</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-slate-600">Order No.</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">ลูกค้า</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">วันที่สั่ง</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">ยอดรวม</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">สถานะ</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 text-center">อัปเดต</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-mono text-sm font-bold text-slate-700">#{order.orderNumber}</td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-slate-800">{order.user?.name || 'Unknown'}</div>
                                        <div className="text-xs text-slate-400">{order.user?.email || '-'}</div>
                                    </td>
                                    <td className="p-4 text-slate-600 text-sm">{formatThaiDate(new Date(order.createdAt))}</td>
                                    <td className="p-4 font-bold text-slate-800">{formatPrice(order.total)}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'
                                            }`}>
                                            {ORDER_STATUS_LABELS[order.status]?.th || order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <select
                                            disabled={updatingOrderId === order.id}
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                                            className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg p-2 mx-auto disabled:opacity-50"
                                        >
                                            {Object.keys(ORDER_STATUS_LABELS).map((status) => (
                                                <option key={status} value={status}>
                                                    {ORDER_STATUS_LABELS[status as OrderStatus].th}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {orders.length === 0 && (
                <div className="bg-white p-12 rounded-2xl text-center border border-dashed border-slate-300">
                    <span className="text-4xl block mb-4">📦</span>
                    <p className="text-slate-500">ยังไม่มีรายการสั่งซื้อในระบบ</p>
                </div>
            )}
        </div>
    );
}
