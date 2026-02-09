"use client";

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EditBatchPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const id = params?.id as string | undefined;

  const [batch, setBatch] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

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

  if (!id) return <div className="min-h-screen flex items-center justify-center text-gray-500">ไม่พบล็อต</div>;
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin">⏳</div></div>;
  if (!batch) return <div className="min-h-screen flex items-center justify-center text-gray-500">ไม่พบล็อตนี้</div>;

  const handleChange = (patch: Record<string, unknown>) => setBatch(prev => ({ ...prev, ...patch }));

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/batches', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, price: batch.pricePerKg, quantityKg: batch.quantityKg, remainingKg: batch.remainingKg, harvestDate: batch.harvestDate, status: batch.status }) });
      if (res.ok) {
        alert('บันทึกสำเร็จ');
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
    setSubmitting(true);
    try {
      const res = await fetch(`/api/batches?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('ลบล็อตเรียบร้อย');
        router.push('/farmer-portal/inventory');
      }
      else {
        const err = await res.json();
        alert(err.error || 'ลบไม่สำเร็จ');
      }
    } catch (e) {
      console.error(e);
      alert('เกิดข้อผิดพลาด');
    } finally {
      setSubmitting(false);
      setDeleteConfirm(false);
    }
  };

  const statusOptions = [
    { value: 'available', label: 'พร้อมขาย', color: 'bg-green-100 text-green-700' },
    { value: 'low_stock', label: 'ใกล้หมด', color: 'bg-amber-100 text-amber-700' },
    { value: 'sold_out', label: 'หมดแล้ว', color: 'bg-gray-100 text-gray-700' },
    { value: 'expired', label: 'หมดอายุ', color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/farmer-portal/inventory" className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
            ←
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">แก้ไขล็อต</h1>
            <p className="text-sm text-gray-500 mt-1">Lot ID: {String(batch.id).slice(-8).toUpperCase()}</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Product Section */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6 flex items-center gap-4">
            <span className="text-5xl">🥬</span>
            <div className="text-white">
              <p className="text-sm opacity-90">สินค้า</p>
              <h2 className="text-2xl font-bold">{String((batch.product as Record<string, unknown>)?.nameTh ?? 'ไม่ระบุ')}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Status Section */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">สถานะล็อต</label>
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleChange({ status: opt.value })}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${batch.status === opt.value ? `${opt.color} ring-2 ring-offset-2` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ปริมาณทั้งหมด</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={String(batch.quantityKg ?? '')}
                    onChange={(e) => handleChange({ quantityKg: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-lg"
                    placeholder="0.0"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium">กก.</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">คงเหลือ</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={String(batch.remainingKg ?? '')}
                    onChange={(e) => handleChange({ remainingKg: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-lg"
                    placeholder="0.0"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium">กก.</span>
                </div>
              </div>
            </div>

            {/* Price & Date Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ราคาตั้งขาย</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 font-medium">฿</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={String(batch.pricePerKg ?? '')}
                    onChange={(e) => handleChange({ pricePerKg: parseFloat(e.target.value) })}
                    className="w-full pl-8 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-lg"
                    placeholder="0.00"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium">/กก.</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">วันที่เก็บเกี่ยว</label>
                <input
                  type="date"
                  value={String(batch.harvestDate ?? '')}
                  onChange={(e) => handleChange({ harvestDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">💡 เคล็ดลับ:</span> อัพเดตปริมาณคงเหลือเมื่อมีการขายเพื่อให้ข้อมูลเป็นปัจจุบัน
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/farmer-portal/inventory')}
                className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>✓</span> {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </button>
            </div>
          </div>
        </div>

        {/* Delete Section */}
        <div className="mt-6 bg-red-50 rounded-lg border-2 border-red-200 p-6">
          <div className="flex items-start gap-4">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">บริเวณอันตราย</h3>
              <p className="text-sm text-red-800 mb-4">ถ้าลบล็อตนี้ จะไม่สามารถกู้คืนได้ โปรดระวัง</p>
              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  ลบล็อต
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={submitting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'กำลังลบ...' : 'ยืนยันการลบ'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
