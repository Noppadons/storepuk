
'use client';

import { Header, Footer } from '@/components';
import { calculateFreshness, formatThaiDate, formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
    const { items, updateQuantity, removeItem, clearCart, total } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');

    // Set default address on load
    useState(() => {
        if (user?.addresses?.length) {
            const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
            setSelectedAddressId(defaultAddr.id);
        }
    });

    const deliveryFee = total >= 500 ? 0 : 50;
    const finalTotal = total + deliveryFee;

    const handleCheckout = async () => {
        if (!user) {
            router.push('/login?redirect=/cart');
            return;
        }

        if (!selectedAddressId) {
            alert('กรุณาเลือกที่อยู่จัดส่ง');
            return;
        }

        setIsCheckingOut(true);
        try {
            const orderItems = items.map(item => ({
                batchId: item.batch.id,
                quantityKg: item.quantityKg,
                unitPrice: item.batch.pricePerKg,
                totalPrice: item.batch.pricePerKg * item.quantityKg
            }));

            const payload = {
                userId: user.id,
                items: orderItems,
                addressId: selectedAddressId,
                total: finalTotal,
                deliveryFee,
                discount: 0,
                paymentMethod: 'cod' // MVP default
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Checkout failed');
            }

            const order = await res.json();
            clearCart();
            alert('สั่งซื้อสำเร็จ! รหัสคำสั่งซื้อ: ' + order.orderNumber);
            router.push('/account');
        } catch (error) {
            console.error('Checkout error:', error);
            alert('เกิดข้อผิดพลาดในการสั่งซื้อ: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container-app py-8">
                {/* Breadcrumb */}
                <nav className="text-sm text-foreground-muted mb-6">
                    <Link href="/" className="hover:text-primary">หน้าแรก</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">ตะกร้าสินค้า</span>
                </nav>

                <h1 className="text-2xl font-bold mb-8">🛒 ตะกร้าสินค้า</h1>

                {items.length === 0 ? (
                    <div className="text-center py-16">
                        <span className="text-6xl mb-4 block">🥬</span>
                        <h2 className="text-xl font-semibold mb-2">ตะกร้าว่างเปล่า</h2>
                        <p className="text-foreground-muted mb-6">เพิ่มผักสดเข้าตะกร้าได้เลย!</p>
                        <Link href="/products" className="btn btn-primary">
                            เลือกซื้อสินค้า
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => {
                                const freshness = calculateFreshness(item.batch.harvestDate);

                                return (
                                    <div key={item.id} className="card p-4 flex gap-4">
                                        {/* Product Image */}
                                        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-4xl flex-shrink-0">
                                            {item.product.category.icon}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <Link href={`/product/${item.product.slug}`} className="font-semibold hover:text-primary">
                                                    {item.product.nameTh}
                                                </Link>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-foreground-muted hover:text-error p-1"
                                                    aria-label="ลบสินค้า"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <p className="text-sm text-foreground-muted mb-2">
                                                {item.batch.farmer?.farm?.name || item.batch.farm?.name}, {item.batch.farmer?.farm?.province || item.batch.farm?.province}
                                            </p>

                                            <div className="flex items-center gap-2 mb-3">
                                                <span
                                                    className="badge text-xs"
                                                    style={{ backgroundColor: freshness.bgColor, color: freshness.color }}
                                                >
                                                    {freshness.labelTh}
                                                </span>
                                                <span className="text-xs text-foreground-muted">
                                                    📅 {formatThaiDate(item.batch.harvestDate)}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                {/* Quantity */}
                                                <div className="flex items-center border border-secondary-light rounded-lg">
                                                    <button
                                                        onClick={() => {
                                                            if (item.quantityKg > 0.5) {
                                                                updateQuantity(item.id, item.quantityKg - 0.5);
                                                            } else {
                                                                removeItem(item.id);
                                                            }
                                                        }}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-hover rounded-l-lg"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <span className="w-14 text-center text-sm font-medium">
                                                        {item.quantityKg} {item.product.unit}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantityKg + 0.5)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-hover rounded-r-lg"
                                                        disabled={item.quantityKg >= item.batch.remainingKg}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className="font-bold text-primary">
                                                        {formatPrice(item.batch.pricePerKg * item.quantityKg)}
                                                    </p>
                                                    <p className="text-xs text-foreground-muted">
                                                        {formatPrice(item.batch.pricePerKg)}/{item.product.unit}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="card p-6 sticky top-24">
                                <h2 className="font-semibold text-lg mb-4">สรุปคำสั่งซื้อ</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-foreground-muted">ยอดรวมสินค้า</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-foreground-muted">ค่าจัดส่ง</span>
                                        {deliveryFee === 0 ? (
                                            <span className="text-success font-medium">ฟรี!</span>
                                        ) : (
                                            <span>{formatPrice(deliveryFee)}</span>
                                        )}
                                    </div>
                                    {deliveryFee > 0 && (
                                        <p className="text-xs text-foreground-muted bg-surface-hover p-2 rounded-lg">
                                            💡 สั่งเพิ่มอีก {formatPrice(500 - total)} เพื่อส่งฟรี!
                                        </p>
                                    )}
                                </div>

                                <hr className="border-secondary-light mb-4" />

                                {/* Address Selection */}
                                <div className="mb-6">
                                    <h3 className="font-medium mb-2">ที่อยู่จัดส่ง</h3>
                                    {user?.addresses && user.addresses.length > 0 ? (
                                        <select
                                            value={selectedAddressId}
                                            onChange={(e) => setSelectedAddressId(e.target.value)}
                                            className="input text-sm"
                                        >
                                            {user.addresses.map(addr => (
                                                <option key={addr.id} value={addr.id}>
                                                    {addr.label} - {addr.address} {addr.subdistrict}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="text-sm text-error bg-error/10 p-2 rounded">
                                            กรุณาเพิ่มที่อยู่จัดส่งในหน้า <Link href="/account" className="underline font-bold">บัญชีของฉัน</Link>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-semibold">ยอดรวมทั้งหมด</span>
                                    <span className="text-2xl font-bold text-primary">{formatPrice(finalTotal)}</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className="btn btn-primary w-full py-4 text-lg"
                                >
                                    {isCheckingOut ? 'กำลังดำเนินการ...' : 'ดำเนินการสั่งซื้อ'}
                                    {!isCheckingOut && (
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </button>

                                <Link href="/products" className="btn btn-secondary w-full mt-3">
                                    เลือกซื้อสินค้าเพิ่ม
                                </Link>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-6 border-t border-secondary-light">
                                    <div className="flex items-center gap-2 text-sm text-foreground-muted mb-2">
                                        <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        ชำระเงินปลอดภัย 100%
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-foreground-muted mb-2">
                                        <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        ส่งตรงจากฟาร์ม
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-foreground-muted">
                                        <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        รับประกันความสด
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
