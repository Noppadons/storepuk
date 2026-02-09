"use client";

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditBatchPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const id = params?.id as string | undefined;

  const [batch, setBatch] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      const res = await fetch(`/api/batches?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setBatch({
          ...data,
          harvestDate: data?.harvestDate ? new Date(String(data.harvestDate)).toISOString().split('T')[0] : ''
        });
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (!id) return <div className="p-8 text-gray-500">ไม่พบล็อต</div>;
  if (loading) return <div className="p-8">กำลังโหลดข้อมูลล็อต...</div>;
  if (!batch) return <div className="p-8 text-gray-500">ไม่พบล็อตนี้</div>;

  const handleChange = (patch: Record<string, unknown>) => setBatch(prev => ({ ...prev, ...patch }));

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/batches', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, price: batch.pricePerKg, quantityKg: batch.quantityKg, remainingKg: batch.remainingKg, harvestDate: batch.harvestDate, status: batch.status }) });
      if (res.ok) {
        router.push('/farmer-portal/inventory');
      } else {
        const err = await res.json();
        alert(err.error || 'อัปเดตไม่สำเร็จ');
      }
    } catch (e) {
      console.error(e);
      alert('เกิดข้อผิดพลาด');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('ลบล็อตนี้จริงหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้')) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/batches?id=${id}`, { method: 'DELETE' });
      if (res.ok) router.push('/farmer-portal/inventory');
      else {
        const err = await res.json();
        alert(err.error || 'ลบไม่สำเร็จ');
      }
    } catch (e) {
      console.error(e);
      alert('เกิดข้อผิดพลาด');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">แก้ไขล็อต {String(batch.id).slice(-8)}</h1>
        <p className="text-gray-500">แก้ไขรายละเอียดล็อตและสถานะ</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div>
          <label className="block text-sm text-gray-700 mb-2">สินค้า</label>
          <div className="font-medium">{String((batch.product as Record<string, unknown>)?.nameTh ?? 'ไม่ระบุ')}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">ปริมาณทั้งหมด (กก.)</label>
            <input type="number" value={String(batch.quantityKg ?? '')} onChange={(e) => handleChange({ quantityKg: parseFloat(e.target.value) })} className="w-full px-4 py-2 rounded-lg border border-gray-200" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">คงเหลือ (กก.)</label>
            <input type="number" value={String(batch.remainingKg ?? '')} onChange={(e) => handleChange({ remainingKg: parseFloat(e.target.value) })} className="w-full px-4 py-2 rounded-lg border border-gray-200" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">ราคาตั้งขาย (บาท/กก.)</label>
            <input type="number" value={String(batch.pricePerKg ?? '')} onChange={(e) => handleChange({ pricePerKg: parseFloat(e.target.value) })} className="w-full px-4 py-2 rounded-lg border border-gray-200" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">วันที่เก็บเกี่ยว</label>
            <input type="date" value={String(batch.harvestDate ?? '')} onChange={(e) => handleChange({ harvestDate: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">สถานะ</label>
          <select value={String(batch.status ?? '')} onChange={(e) => handleChange({ status: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200">
            <option value="available">พร้อมขาย</option>
            <option value="low_stock">ใกล้หมด</option>
            <option value="sold_out">หมดแล้ว</option>
            <option value="expired">หมดอายุ</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button onClick={() => router.push('/farmer-portal/inventory')} className="px-4 py-2 border border-gray-200 rounded-lg">ยกเลิก</button>
          <button onClick={handleSave} disabled={submitting} className="px-6 py-2 bg-primary text-white rounded-lg">{submitting ? 'กำลังบันทึก...' : 'บันทึก'}</button>
          <button onClick={handleDelete} disabled={submitting} className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg">ลบล็อต</button>
        </div>

      </div>
    </div>
  );
}
