'use client';

import { Header, Footer, ProductCard } from '@/components';
import { products, calculateFreshness, formatThaiDate, formatPrice } from '@/data/mock-data';
import Link from 'next/link';
import { useState, use } from 'react';

interface ProductDetailPageProps {
    params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const resolvedParams = use(params);
    const product = products.find((p) => p.slug === resolvedParams.slug);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container-app py-12 text-center">
                    <span className="text-6xl mb-4 block">🥬</span>
                    <h1 className="text-2xl font-bold mb-2">ไม่พบสินค้า</h1>
                    <p className="text-foreground-muted mb-6">สินค้าที่คุณค้นหาไม่มีอยู่ในระบบ</p>
                    <Link href="/products" className="btn btn-primary">
                        กลับไปหน้าสินค้า
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const activeBatch = product.activeBatches?.[0];
    const freshness = activeBatch ? calculateFreshness(activeBatch.harvestDate) : null;

    // Related products (same category)
    const relatedProducts = products
        .filter((p) => p.category.id === product.category.id && p.id !== product.id)
        .slice(0, 4);

    const handleAddToCart = () => {
        setIsAdding(true);
        setTimeout(() => setIsAdding(false), 500);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const increaseQuantity = () => {
        if (activeBatch && quantity < activeBatch.remainingKg) {
            setQuantity(quantity + 1);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                <div className="container-app py-8">
                    {/* Breadcrumb */}
                    <nav className="text-sm text-foreground-muted mb-6">
                        <Link href="/" className="hover:text-primary">หน้าแรก</Link>
                        <span className="mx-2">/</span>
                        <Link href="/products" className="hover:text-primary">สินค้าทั้งหมด</Link>
                        <span className="mx-2">/</span>
                        <Link href={`/category/${product.category.slug}`} className="hover:text-primary">
                            {product.category.nameTh}
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-foreground">{product.nameTh}</span>
                    </nav>

                    {/* Product Detail */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Product Image */}
                        <div className="space-y-4">
                            <div className="product-image aspect-square rounded-2xl relative">
                                <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-80">
                                    {product.category.icon}
                                </div>
                                {freshness && (
                                    <div
                                        className="absolute top-4 left-4 badge text-sm"
                                        style={{ backgroundColor: freshness.bgColor, color: freshness.color }}
                                    >
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: freshness.color }}></span>
                                        {freshness.labelTh}
                                    </div>
                                )}
                                {activeBatch?.farmer?.farm?.isVerified && (
                                    <div className="absolute top-4 right-4 badge bg-white/90 text-foreground-muted">
                                        ✓ {activeBatch.farmer?.farm?.certification || 'Verified'}
                                    </div>
                                )}
                            </div>

                            {/* Farm Info Card */}
                            {activeBatch && (
                                <div className="card p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl">
                                            👨‍🌾
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{activeBatch.farmer?.farm?.name}</h4>
                                            <p className="text-sm text-foreground-muted">{activeBatch.farmer?.farm?.province}</p>
                                        </div>
                                        <Link href={`/farm/${activeBatch.farmer?.farm?.id}`} className="btn btn-secondary text-sm py-2 px-4">
                                            ดูฟาร์ม
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{product.nameTh}</h1>
                            <p className="text-foreground-muted mb-4">{product.nameEn}</p>

                            {/* Freshness Bar */}
                            {freshness && activeBatch && (
                                <div className="card p-4 mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">ความสด</span>
                                        <span
                                            className="font-semibold"
                                            style={{ color: freshness.color }}
                                        >
                                            {freshness.labelTh}
                                        </span>
                                    </div>
                                    <div className="freshness-bar h-3">
                                        <div
                                            className="freshness-bar-fill"
                                            style={{
                                                width: freshness.level === 'very_fresh' ? '100%' :
                                                    freshness.level === 'fresh' ? '75%' :
                                                        freshness.level === 'normal' ? '50%' : '25%',
                                                backgroundColor: freshness.color,
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-sm text-foreground-muted">
                                        <span>📅 เก็บเกี่ยว: {formatThaiDate(new Date(activeBatch.harvestDate))}</span>
                                        <span>⏱️ {freshness.daysFromHarvest === 0 ? 'วันนี้' : `${freshness.daysFromHarvest} วันที่แล้ว`}</span>
                                    </div>
                                </div>
                            )}

                            {/* Price */}
                            {activeBatch && (
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-primary">
                                            {formatPrice(activeBatch.pricePerKg)}
                                        </span>
                                        <span className="text-lg text-foreground-muted">/ {product.unit}</span>
                                    </div>
                                    {activeBatch.remainingKg < 10 && (
                                        <p className="text-warning text-sm mt-1">
                                            ⚠️ เหลือเพียง {activeBatch.remainingKg} {product.unit}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Quantity Selector */}
                            {activeBatch && (
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="font-medium">จำนวน:</span>
                                    <div className="flex items-center border border-secondary-light rounded-lg">
                                        <button
                                            onClick={decreaseQuantity}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-surface-hover rounded-l-lg"
                                            disabled={quantity <= 1}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span className="w-16 text-center font-semibold">{quantity} {product.unit}</span>
                                        <button
                                            onClick={increaseQuantity}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-surface-hover rounded-r-lg"
                                            disabled={quantity >= activeBatch.remainingKg}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart */}
                            {activeBatch && (
                                <div className="flex gap-4 mb-8">
                                    <button
                                        onClick={handleAddToCart}
                                        className={`btn btn-primary flex-1 py-4 text-lg ${isAdding ? 'animate-pulse-soft' : ''}`}
                                        disabled={activeBatch.remainingKg <= 0}
                                    >
                                        {isAdding ? (
                                            'กำลังเพิ่ม...'
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                เพิ่มลงตะกร้า - {formatPrice(activeBatch.pricePerKg * quantity)}
                                            </>
                                        )}
                                    </button>
                                    <button className="btn btn-secondary p-4" aria-label="เพิ่มในรายการโปรด">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* Product Details */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">รายละเอียดสินค้า</h3>
                                <p className="text-foreground-muted leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="card p-4">
                                        <span className="text-foreground-muted text-sm">อายุการเก็บรักษา</span>
                                        <p className="font-semibold">{product.shelfLifeDays} วัน</p>
                                    </div>
                                    <div className="card p-4">
                                        <span className="text-foreground-muted text-sm">อุณหภูมิเก็บรักษา</span>
                                        <p className="font-semibold">{product.storageTemp}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <section className="mt-16">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">สินค้าที่คล้ายกัน</h2>
                                <Link href={`/category/${product.category.slug}`} className="text-primary text-sm font-medium hover:underline">
                                    ดูทั้งหมด
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {relatedProducts.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
