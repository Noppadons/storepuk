'use client';

import { useEffect, useState } from 'react';

interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
}

interface Farm {
    id: string;
    name: string;
    province: string;
    isVerified: boolean;
    certifications: string; // JSON string from API
    description: string | null;
    image: string | null;
    user: User;
}

export default function AdminFarmersPage() {
    const [farms, setFarms] = useState<Farm[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingFarmId, setUpdatingFarmId] = useState<string | null>(null);

    useEffect(() => {
        fetchFarms();
    }, []);

    const fetchFarms = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/farmers');
            if (res.ok) {
                const data = await res.json();
                setFarms(data);
            }
        } catch (error) {
            console.error('Failed to fetch farmers:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleVerify = async (farmId: string, currentStatus: boolean) => {
        setUpdatingFarmId(farmId);
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
        } finally {
            setUpdatingFarmId(null);
        }
    };

    if (loading) return <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">กำลังโหลดข้อมูลเกษตรกร...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">จัดการข้อมูลเกษตรกร (Farmers)</h1>
                <p className="text-slate-500">ตรวจสอบและอนุมัติฟาร์มที่ต้องการวางขายสินค้า</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farms.map((farm) => {
                    const certifications = farm.certifications ? JSON.parse(farm.certifications) : [];
                    return (
                        <div key={farm.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl">
                                        {farm.image || '🚜'}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${farm.isVerified ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {farm.isVerified ? '✓ อนุมัติแล้ว' : 'รอการอนุมัติ'}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-800 mb-1">{farm.name}</h3>
                                <p className="text-primary text-sm font-medium mb-3">{farm.province}</p>

                                <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                    {farm.description || 'ไม่มีคำอธิบายฟาร์ม'}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {certifications.map((cert: string, idx: number) => (
                                        <span key={idx} className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                                            {cert}
                                        </span>
                                    ))}
                                    {certifications.length === 0 && (
                                        <span className="text-slate-400 text-[10px] italic">ไม่มีใบรับรอง</span>
                                    )}
                                </div>

                                <div className="border-t border-slate-100 pt-4 mt-4">
                                    <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">ข้อมูลเจ้าของฟาร์ม</p>
                                    <p className="text-sm font-semibold text-slate-700">{farm.user?.name || 'ไม่ระบุชื่อ'}</p>
                                    <p className="text-xs text-slate-500">{farm.user?.email}</p>
                                    <p className="text-xs text-slate-500">{farm.user?.phone || 'ไม่มีเบอร์โทร'}</p>
                                </div>

                                <button
                                    disabled={updatingFarmId === farm.id}
                                    onClick={() => toggleVerify(farm.id, farm.isVerified)}
                                    className={`w-full mt-6 py-3 rounded-xl font-bold text-sm transition-all border ${farm.isVerified
                                            ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                            : 'bg-primary text-white border-primary hover:bg-primary-dark shadow-lg shadow-primary/20'
                                        }`}
                                >
                                    {updatingFarmId === farm.id ? 'กำลังดำเนินการ...' :
                                        farm.isVerified ? 'ยกเลิกการอนุมัติ' : 'อนุมัติฟาร์มนี้'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {farms.length === 0 && (
                <div className="bg-white p-12 rounded-2xl text-center border border-dashed border-slate-300">
                    <span className="text-4xl block mb-4">🏜️</span>
                    <p className="text-slate-500">ยังไม่มีข้อมูลเกษตรกรในระบบ</p>
                </div>
            )}
        </div>
    );
}
