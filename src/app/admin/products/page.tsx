'use client';

import { useEffect, useState, useCallback } from 'react';
import { Product, Category } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({
        nameTh: '',
        nameEn: '',
        slug: '',
        description: '',
        unit: 'กก.',
        basePrice: 0,
        categoryId: '',
        shelfLifeDays: 7,
        storageTemp: '2-8°C'
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/categories')
            ]);

            if (prodRes.ok && catRes.ok) {
                const prods = await prodRes.json();
                const cats = await catRes.json();
                setProducts(prods);
                setCategories(cats);

                if (cats.length > 0 && !formData.categoryId) {
                    setFormData(prev => ({ ...prev, categoryId: cats[0].id }));
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [formData.categoryId]);

    // Search and selection state
    const [query, setQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

    const filteredProducts = products.filter(p => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (p.nameTh || '').toLowerCase().includes(q) || (p.nameEn || '').toLowerCase().includes(q) || (p.slug || '').toLowerCase().includes(q);
    });

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const bulkDelete = async () => {
        const ids = Object.keys(selectedIds).filter(id => selectedIds[id]);
        if (ids.length === 0) return alert('กรุณาเลือกสินค้าที่ต้องการลบ');
        if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${ids.length} ชิ้น?`)) return;

        try {
            const res = await fetch('/api/products/bulk-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids })
            });

            if (res.ok) {
                setProducts(products.filter(p => !ids.includes(p.id)));
                setSelectedIds({});
            } else {
                alert('ลบไม่สำเร็จ');
            }
        } catch (error) {
            console.error('Bulk delete error:', error);
        }
    };

    const exportCSV = () => {
        const rows = filteredProducts.map(p => ({ id: p.id, nameTh: p.nameTh, nameEn: p.nameEn, price: p.basePrice, unit: p.unit }));
        const csv = [Object.keys(rows[0] || {}).join(','), ...rows.map(r => Object.values(r).map(v => `"${String(v || '')}"`).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (product: Product | null = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                ...product,
                categoryId: product.categoryId || (categories[0]?.id || '')
            });
        } else {
            setEditingProduct(null);
            setFormData({
                nameTh: '',
                nameEn: '',
                slug: '',
                description: '',
                unit: 'กก.',
                basePrice: 0,
                categoryId: categories[0]?.id || '',
                shelfLifeDays: 7,
                storageTemp: '2-8°C'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const res = await fetch('/api/products', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingProduct ? { ...formData, id: editingProduct.id } : formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                alert('บันทึกข้อมูลไม่สำเร็จ');
            }
        } catch (error) {
            console.error('Save error:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) return;

        try {
            const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const generateSlug = () => {
        const slug = formData.nameEn?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    if (loading) return <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">กำลังโหลดข้อมูลสินค้า...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">จัดการสินค้า (Products)</h1>
                    <p className="text-slate-500">เพิ่ม แก้ไข และจัดการรายการผักในระบบ</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        placeholder="ค้นหาสินค้าโดยชื่อหรือ slug"
                        className="p-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-primary outline-none"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button onClick={exportCSV} className="px-4 py-3 bg-white border border-slate-200 rounded-xl hover:shadow">Export CSV</button>
                    <button onClick={bulkDelete} className="px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100">Bulk Delete</button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <span>➕</span> เพิ่มสินค้าใหม่
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-slate-600">สินค้า</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">หมวดหมู่</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 text-right">ราคาฐาน</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <input type="checkbox" checked={!!selectedIds[product.id]} onChange={() => toggleSelect(product.id)} className="mr-3" />
                                        <div className="inline-flex align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                                                <span>🥒</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{product.nameTh}</p>
                                                <p className="text-xs text-slate-400">{product.nameEn}</p>
                                            </div>
                                        </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded font-bold uppercase">
                                            {product.category?.nameTh}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-slate-800">{formatPrice(product.basePrice || 0)} / {product.unit}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleOpenModal(product)}
                                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                                                title="แก้ไข"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                                                title="ลบ"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">{editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">ชื่อสินค้า (ไทย)</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        value={formData.nameTh}
                                        onChange={e => setFormData(prev => ({ ...prev, nameTh: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">ชื่อสินค้า (English)</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        value={formData.nameEn}
                                        onChange={e => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                                        onBlur={generateSlug}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Slug</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    value={formData.slug}
                                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">หมวดหมู่</label>
                                    <select
                                        required
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white"
                                        value={formData.categoryId}
                                        onChange={e => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.nameTh}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">ราคาฐาน (Base Price)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        value={formData.basePrice}
                                        onChange={e => setFormData(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">หน่วย</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        value={formData.unit}
                                        onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">อายุการเก็บรักษา (วัน)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        value={formData.shelfLifeDays}
                                        onChange={e => setFormData(prev => ({ ...prev, shelfLifeDays: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">คำอธิบาย</label>
                                <textarea
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[100px]"
                                    value={formData.description || ''}
                                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                                >
                                    {editingProduct ? 'บันทึกการแก้ไข' : 'ยืนยันการเพิ่มสินค้า'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
