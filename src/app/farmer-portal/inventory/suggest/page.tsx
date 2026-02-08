"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SuggestProductPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ nameTh: '', nameEn: '', slug: '', description: '', unit: 'kg', basePrice: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert('กรุณาเข้าสู่ระบบ');
        setSubmitting(true);
        try {
            const res = await fetch('/api/pending-products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, farmId: user.id, basePrice: Number(form.basePrice || 0) })
            });
            if (res.ok) {
                alert('ส่งคำขอเรียบร้อยแล้ว ทีมงานจะตรวจสอบและแจ้งผลภายหลัง');
                router.push('/farmer-portal/inventory');
            } else {
                const err = await res.json();
                alert(err.error || 'ส่งไม่สำเร็จ');
            }
        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาด');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-3">เสนอสินค้าใหม่สำหรับร้านของคุณ</h1>
            <p className="text-sm text-slate-500 mb-6">กรอกข้อมูลสินค้า ทีมงานแอดมินจะตรวจสอบก่อนอนุมัติ</p>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">ชื่อ (ไทย)</label>
                    <input required value={form.nameTh} onChange={e => setForm({ ...form, nameTh: e.target.value })} className="w-full p-3 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Name (EN)</label>
                    <input required value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} className="w-full p-3 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full p-3 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">คำอธิบาย</label>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-3 border rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="p-3 border rounded-lg" />
                    <input type="number" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })} className="p-3 border rounded-lg" placeholder="Base price" />
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded-lg">ยกเลิก</button>
                    <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 text-white rounded-lg">{submitting ? 'กำลังส่ง...' : 'ส่งคำขอ'}</button>
                </div>
            </form>
        </div>
    );
}
