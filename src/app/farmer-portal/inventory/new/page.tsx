
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Product } from '@/types';

export default function NewBatchPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        productId: '',
        quantityKg: '',
        price: '',
        harvestDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/batches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    ...formData
                })
            });

            if (res.ok) {
                router.push('/farmer-portal/inventory');
            } else {
                const error = await res.json();
                alert(error.error || 'เกิดข้อผิดพลาดในการสร้างล็อตใหม่');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">กำลังโหลดสินค้า...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">ลงทะเบียนล็อตสินค้าใหม่</h1>
                <p className="text-gray-500">กรอกรายละเอียดล็อตเก็บเกี่ยวล่าสุดของคุณเพื่อเริ่มลงขาย</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">เลือกประเภทสินค้า</label>
                    <select
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        value={formData.productId}
                        onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    >
                        <option value="">เลือกผักของคุณ...</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.nameTh} ({p.nameEn})</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ปริมาณทั้งหมด (กิโลกรัม)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            step="0.1"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="เช่น 50"
                            value={formData.quantityKg}
                            onChange={(e) => setFormData({ ...formData, quantityKg: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ราคาตั้งขาย (บาท / กก.)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="เช่น 35"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">วันที่เริ่มเก็บเกี่ยว</label>
                    <input
                        type="date"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                        value={formData.harvestDate}
                        onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                    />
                </div>

                <div className="pt-4 flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium transition-all"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-2 px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold shadow-lg shadow-green-100 transition-all disabled:opacity-50"
                    >
                        {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูลและลงขาย'}
                    </button>
                </div>
            </form>
        </div>
    );
}
