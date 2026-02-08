
'use client';

import { Header, Footer, ProductCard } from '@/components';
import { useState } from 'react';
import { Product, Category } from '@/types'; // or Prisma types
import Link from 'next/link';

interface ProductsClientProps {
    initialProducts: Product[];
    categories: Category[];
}

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'fresh' | 'price-low' | 'price-high' | 'popular'>('fresh');

    // Use initialProducts (which contains all for now, or filtered subset)
    const products = initialProducts;

    const filteredProducts = selectedCategory
        ? products.filter((p) => p.category.slug === selectedCategory)
        : products;

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'fresh':
                // Check if activeBatches exists
                const dateB = b.batches?.[0]?.harvestDate ? new Date(b.batches[0].harvestDate).getTime() : 0;
                const dateA = a.batches?.[0]?.harvestDate ? new Date(a.batches[0].harvestDate).getTime() : 0;
                return dateB - dateA;
            case 'price-low':
                const priceA = a.batches?.[0]?.pricePerKg || 0;
                const priceB = b.batches?.[0]?.pricePerKg || 0;
                return priceA - priceB;
            case 'price-high':
                const priceHighA = a.batches?.[0]?.pricePerKg || 0;
                const priceHighB = b.batches?.[0]?.pricePerKg || 0;
                return priceHighB - priceHighA;
            default:
                return 0;
        }
    });

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container-app py-8">
                {/* Breadcrumb */}
                <nav className="text-sm text-foreground-muted mb-6">
                    <Link href="/" className="hover:text-primary">หน้าแรก</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">สินค้าทั้งหมด</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="card p-6 sticky top-24">
                            <h3 className="font-semibold mb-4">หมวดหมู่</h3>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === null
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'hover:bg-surface-hover'
                                            }`}
                                    >
                                        ทั้งหมด
                                    </button>
                                </li>
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <button
                                            onClick={() => setSelectedCategory(category.slug)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${selectedCategory === category.slug
                                                ? 'bg-primary/10 text-primary font-medium'
                                                : 'hover:bg-surface-hover'
                                                }`}
                                        >
                                            {/* Note: icon is string in DB? or emoji? Schema says String? */}
                                            <span>{category.icon || '🥬'}</span>
                                            {category.nameTh}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <hr className="my-6 border-secondary-light" />

                            {/* Freshness Filter - Mock UI for now as logic is complex */}
                            <h3 className="font-semibold mb-4">ความสด</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-primary rounded" defaultChecked />
                                    <span className="badge-fresh-very badge">🟢 สดมาก (0-2 วัน)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-primary rounded" defaultChecked />
                                    <span className="badge-fresh-good badge">🟢 สด (3-5 วัน)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                                    <span className="badge-fresh-normal badge">🟡 ปกติ (5+ วัน)</span>
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {selectedCategory
                                        ? categories.find((c) => c.slug === selectedCategory)?.nameTh
                                        : 'สินค้าทั้งหมด'}
                                </h1>
                                <p className="text-foreground-muted">
                                    {sortedProducts.length} สินค้า
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-foreground-muted">เรียงตาม:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                    className="input py-2 px-3 w-auto"
                                >
                                    <option value="fresh">สดที่สุด</option>
                                    <option value="price-low">ราคาต่ำ-สูง</option>
                                    <option value="price-high">ราคาสูง-ต่ำ</option>
                                    <option value="popular">ยอดนิยม</option>
                                </select>
                            </div>
                        </div>

                        {/* Mobile Category Pills */}
                        <div className="flex gap-2 overflow-x-auto pb-4 lg:hidden -mx-4 px-4">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === null
                                    ? 'bg-primary text-white'
                                    : 'bg-surface-hover text-foreground'
                                    }`}
                            >
                                ทั้งหมด
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.slug)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.slug
                                        ? 'bg-primary text-white'
                                        : 'bg-surface-hover text-foreground'
                                        }`}
                                >
                                    {category.icon} {category.nameTh}
                                </button>
                            ))}
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {sortedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {sortedProducts.length === 0 && (
                            <div className="text-center py-12">
                                <span className="text-6xl mb-4 block">🥬</span>
                                <h3 className="text-xl font-semibold mb-2">ไม่พบสินค้า</h3>
                                <p className="text-foreground-muted">ลองเลือกหมวดหมู่อื่น หรือกลับมาใหม่ในภายหลัง</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
