
'use client';

import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatThaiDate } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HarvestBatch, Product } from '@/types';

export default function InventoryPage() {
    const { user } = useAuth();
    const [batches, setBatches] = useState<HarvestBatch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchBatches();
        }
    }, [user]);

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/batches?userId=${user?.id}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setBatches(data);
            }
        } catch (error) {
            console.error('Failed to fetch batches:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="p-8 text-center text-gray-500">กรุณาเข้าสู่ระบบเพื่อจัดการสต็อก</div>;
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-400">กำลังโหลดรายการสต็อก...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">จัดการสต็อก (Inventory)</h1>
                <Link href="/farmer-portal/inventory/new" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                    + เพิ่มล็อตเก็บเกี่ยวใหม่
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">สินค้า</th>
                                <th className="p-4 font-semibold text-gray-600">ล็อต ID</th>
                                <th className="p-4 font-semibold text-gray-600">วันที่เก็บเกี่ยว</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">ราคา/กก.</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">คงเหลือ / ทั้งหมด</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">สถานะ</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {batches.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400 italic">ยังไม่มีล็อตการผลิต กรุณาสร้างล็อตใหม่</td>
                                </tr>
                            ) : (
                                batches.map((batch) => (
                                    <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-green-50 flex items-center justify-center text-xl">
                                                    🥬
                                                </div>
                                                <div className="font-medium text-gray-800">
                                                    {(batch as any).product?.nameTh || 'ไม่ระบุชื่อสินค้า'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-mono text-gray-400 uppercase">
                                            {batch.id.slice(-8)}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {formatThaiDate(new Date(batch.harvestDate))}
                                        </td>
                                        <td className="p-4 text-right font-medium text-gray-800">
                                            {formatPrice(batch.pricePerKg)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className={`font-bold ${batch.remainingKg < 10 ? 'text-red-600' : 'text-gray-700'}`}>
                                                {batch.remainingKg} กก.
                                            </span>
                                            <span className="text-gray-400 text-xs ml-1">/ {batch.quantityKg}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`badge text-xs px-2 py-1 rounded-full ${batch.status === 'available' ? 'bg-green-100 text-green-700' :
                                                batch.status === 'low_stock' ? 'bg-amber-100 text-amber-700' :
                                                    batch.status === 'sold_out' ? 'bg-gray-100 text-gray-500' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {batch.status === 'available' ? 'พร้อมขาย' :
                                                    batch.status === 'low_stock' ? 'ใกล้หมด' :
                                                        batch.status === 'sold_out' ? 'หมดแล้ว' : 'หมดอายุ'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                แก้ไข
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

