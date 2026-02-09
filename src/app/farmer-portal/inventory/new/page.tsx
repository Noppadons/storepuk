
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
                alert('ล็อตสินค้าถูกสร้างสำเร็จ!');
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

    if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin text-2xl">⏳</div></div>;

    const selectedProduct = products.find(p => p.id === formData.productId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/farmer-portal/inventory" className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                        ←
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">สร้างล็อตใหม่</h1>
                        <p className="text-sm text-gray-500 mt-1">เพิ่มผักเก็บเกี่ยวล่าสุดของคุณลงระบบ</p>
                    </div>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Product Selection Section */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
                        <label className="block text-white font-semibold mb-3">เลือกประเภทสินค้า</label>
                        <select
                            required
                            className="w-full px-4 py-3 rounded-lg border-0 outline-none text-gray-800"
                            value={formData.productId}
                            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                        >
                            <option value="">-- เลือกผักของคุณ --</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>🥬 {p.nameTh} ({p.nameEn})</option>
                            ))}
                        </select>
                    </div>

                    {/* Form Content */}
                    <div className="p-8 space-y-6">
                        {/* Product Preview */}
                        {selectedProduct && (
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-4 flex items-center gap-4">
                                <span className="text-4xl">🥬</span>
                                <div>
                                    <p className="text-sm text-gray-500">สินค้าที่เลือก</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedProduct.nameTh}</p>
                                </div>
                            </div>
                        )}

                        {/* Quantity & Price Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">ปริมาณทั้งหมด</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        step="0.1"
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-lg"
                                        placeholder="0.0"
                                        value={formData.quantityKg}
                                        onChange={(e) => setFormData({ ...formData, quantityKg: e.target.value })}
                                    />
                                    <span className="absolute right-4 top-3 text-gray-500 font-medium">กก.</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">ราคาตั้งขาย</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-gray-500 font-medium">฿</span>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        step="0.01"
                                        className="w-full pl-8 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-lg"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                    <span className="absolute right-4 top-3 text-gray-500 font-medium">/กก.</span>
                                </div>
                            </div>
                        </div>

                        {/* Date Section */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">วันที่เก็บเกี่ยว</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                value={formData.harvestDate}
                                onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                            />
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                            <p className="text-sm text-blue-900">
                                <span className="font-semibold">💡 เคล็ดลับ:</span> ระบุปริมาณและราคาให้ถูกต้องเพื่อให้ลูกค้าได้ข้อมูลที่สประดับ
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <span>✓</span> {submitting ? 'กำลังสร้าง...' : 'สร้างล็อต'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
