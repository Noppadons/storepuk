
'use client';

import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatThaiDate } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { HarvestBatch } from '@/types';

export default function InventoryPage() {
    const { user } = useAuth();
    const [batches, setBatches] = useState<HarvestBatch[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBatches = useCallback(async () => {
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
    }, [user?.id]);

    useEffect(() => {
        if (user) {
            fetchBatches();
        }
    }, [user, fetchBatches]);

    if (!user) {
        return <div className="p-8 text-center text-gray-500">กรุณาเข้าสู่ระบบเพื่อจัดการสต็อก</div>;
    }

    if (loading) {
        return <div className="flex items-center justify-center py-12"><div className="animate-spin text-2xl">⏳</div></div>;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return { bg: 'bg-green-100', text: 'text-green-700', label: 'พร้อมขาย' };
            case 'low_stock': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'ใกล้หมด' };
            case 'sold_out': return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'หมดแล้ว' };
            case 'expired': return { bg: 'bg-red-100', text: 'text-red-700', label: 'หมดอายุ' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
        }
    };

    const totalRemaining = batches.reduce((sum, b) => sum + b.remainingKg, 0);
    const lowStockCount = batches.filter(b => b.status === 'low_stock' || (b.remainingKg < 10 && b.remainingKg > 0)).length;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">จัดการสต็อก</h1>
                    <p className="text-gray-500 mt-1">ล็อตผักของคุณทั้งหมด</p>
                </div>
                <Link href="/farmer-portal/inventory/new" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                    <span>➕</span> เพิ่มล็อตใหม่
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-xl">📦</div>
                    <div>
                        <p className="text-sm text-gray-500">ล็อตทั้งหมด</p>
                        <p className="text-2xl font-bold text-gray-800">{batches.length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-xl">📊</div>
                    <div>
                        <p className="text-sm text-gray-500">ปริมาณคงเหลือ</p>
                        <p className="text-2xl font-bold text-gray-800">{totalRemaining.toFixed(1)} กก.</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-xl">⚠️</div>
                    <div>
                        <p className="text-sm text-gray-500">ใกล้หมด</p>
                        <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
                    </div>
                </div>
            </div>

            {/* Inventory Grid */}
            {batches.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 py-16 text-center">
                    <span className="text-6xl block mb-4">📭</span>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">ยังไม่มีล็อตการผลิต</h3>
                    <p className="text-gray-500 mb-6">เริ่มต้นโดยเพิ่มล็อตผักเก็บเกี่ยวแรกของคุณ</p>
                    <Link href="/farmer-portal/inventory/new" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
                        <span>➕</span> สร้างล็อตแรก
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {batches.map((batch) => {
                        const statusInfo = getStatusColor(batch.status);
                        const stockPercent = (batch.remainingKg / batch.quantityKg) * 100;
                        const isLowStock = batch.remainingKg < 10 && batch.remainingKg > 0;

                        return (
                            <div key={batch.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                                {/* Product Header */}
                                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">🥬</span>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{batch.product?.nameTh || 'ไม่ระบุ'}</h3>
                                            <p className="text-xs text-gray-500">{batch.id.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 space-y-4">
                                    {/* Date */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">เก็บเกี่ยว</span>
                                        <span className="text-sm font-medium text-gray-700">{formatThaiDate(new Date(batch.harvestDate))}</span>
                                    </div>

                                    {/* Stock Bar */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">สต็อก</span>
                                            <span className={`text-sm font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                                                {batch.remainingKg}/{batch.quantityKg} กก.
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${isLowStock ? 'bg-red-500' : 'bg-green-500'}`}
                                                style={{ width: `${Math.min(100, stockPercent)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <span className="text-sm text-gray-500">ราคา</span>
                                        <span className="text-lg font-bold text-primary">{formatPrice(batch.pricePerKg)}/กก.</span>
                                    </div>

                                    {/* Status */}
                                    <div className={`${statusInfo.bg} ${statusInfo.text} rounded-lg px-3 py-2 text-center font-semibold text-sm`}>
                                        {statusInfo.label}
                                    </div>

                                    {/* Action Button */}
                                    <Link href={`/farmer-portal/inventory/${batch.id}`} className="w-full block py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg text-center transition-colors">
                                        แก้ไข
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

