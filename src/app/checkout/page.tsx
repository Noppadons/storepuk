'use client';

import { Header, Footer } from '@/components';
import { products, formatThaiDate, formatPrice } from '@/data/mock-data';
import Link from 'next/link';
import { useState } from 'react';

// Mock cart data (same as cart page)
const cartItems = [
    { productId: 'p1', batchId: 'b1', quantity: 2 },
    { productId: 'p2', batchId: 'b2', quantity: 1 },
    { productId: 'p5', batchId: 'b5', quantity: 0.5 },
];

type Step = 'address' | 'delivery' | 'payment' | 'confirm';

export default function CheckoutPage() {
    const [currentStep, setCurrentStep] = useState<Step>('address');
    const [orderComplete, setOrderComplete] = useState(false);

    // Form states
    const [addressForm, setAddressForm] = useState({
        fullName: '',
        phone: '',
        address: '',
        subdistrict: '',
        district: '',
        province: 'กรุงเทพมหานคร',
        postalCode: '',
    });

    const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');

    const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'card' | 'cod'>('promptpay');

    // Get cart data
    const cartData = cartItems.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const batch = product?.activeBatches?.find((b) => b.id === item.batchId);
        return { ...item, product, batch };
    }).filter((item) => item.product && item.batch);

    const subtotal = cartData.reduce(
        (sum, item) => sum + (item.batch?.pricePerKg || 0) * item.quantity,
        0
    );
    const deliveryFee = deliveryOption === 'express' ? 80 : subtotal >= 500 ? 0 : 50;
    const total = subtotal + deliveryFee;

    // Generate dates for delivery
    const getDeliveryDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 1; i <= 5; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const timeSlots = [
        { value: 'morning', label: '09:00 - 12:00' },
        { value: 'afternoon', label: '12:00 - 15:00' },
        { value: 'evening', label: '15:00 - 18:00' },
    ];

    const steps = [
        { key: 'address' as Step, label: 'ที่อยู่จัดส่ง', icon: '📍' },
        { key: 'delivery' as Step, label: 'วันเวลาจัดส่ง', icon: '🚚' },
        { key: 'payment' as Step, label: 'ชำระเงิน', icon: '💳' },
        { key: 'confirm' as Step, label: 'ยืนยัน', icon: '✅' },
    ];

    const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

    const goToNextStep = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
            setCurrentStep(steps[nextIndex].key);
        }
    };

    const goToPrevStep = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(steps[prevIndex].key);
        }
    };

    const handleSubmitOrder = () => {
        setOrderComplete(true);
    };

    if (orderComplete) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container-app py-16 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center text-5xl animate-pulse-soft">
                            ✅
                        </div>
                        <h1 className="text-3xl font-bold mb-4 text-primary">สั่งซื้อสำเร็จ!</h1>
                        <p className="text-foreground-muted mb-2">
                            ขอบคุณที่สั่งซื้อกับ มาซื้อผักกันเถอะ
                        </p>
                        <p className="text-lg font-semibold mb-6">
                            หมายเลขคำสั่งซื้อ: <span className="text-primary">#VEG-2569020847</span>
                        </p>

                        <div className="card p-6 text-left mb-6">
                            <h3 className="font-semibold mb-4">รายละเอียดการจัดส่ง</h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-foreground-muted">ผู้รับ:</span> {addressForm.fullName || 'คุณทดสอบ'}</p>
                                <p><span className="text-foreground-muted">โทร:</span> {addressForm.phone || '08x-xxx-xxxx'}</p>
                                <p><span className="text-foreground-muted">ที่อยู่:</span> {addressForm.address || '123 ถ.สุขุมวิท'}, {addressForm.district || 'วัฒนา'}, {addressForm.province}</p>
                                <p><span className="text-foreground-muted">วันที่จัดส่ง:</span> {deliveryDate || 'พรุ่งนี้'} {timeSlot || '09:00 - 12:00'}</p>
                            </div>
                        </div>

                        <div className="card p-6 text-left mb-6">
                            <h3 className="font-semibold mb-4">สรุปคำสั่งซื้อ</h3>
                            <div className="space-y-2 text-sm">
                                {cartData.map((item) => (
                                    <div key={item.productId} className="flex justify-between">
                                        <span>{item.product?.nameTh} x {item.quantity} {item.product?.unit}</span>
                                        <span>{formatPrice((item.batch?.pricePerKg || 0) * item.quantity)}</span>
                                    </div>
                                ))}
                                <hr className="my-2" />
                                <div className="flex justify-between">
                                    <span>ค่าจัดส่ง</span>
                                    <span>{deliveryFee === 0 ? 'ฟรี' : formatPrice(deliveryFee)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>รวมทั้งหมด</span>
                                    <span className="text-primary">{formatPrice(total)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Link href="/products" className="btn btn-secondary flex-1">
                                ซื้อสินค้าเพิ่ม
                            </Link>
                            <Link href="/account/orders" className="btn btn-primary flex-1">
                                ดูคำสั่งซื้อ
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container-app py-8">
                {/* Breadcrumb */}
                <nav className="text-sm text-foreground-muted mb-6">
                    <Link href="/" className="hover:text-primary">หน้าแรก</Link>
                    <span className="mx-2">/</span>
                    <Link href="/cart" className="hover:text-primary">ตะกร้าสินค้า</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">ชำระเงิน</span>
                </nav>

                <h1 className="text-2xl font-bold mb-8">🛍️ ดำเนินการสั่งซื้อ</h1>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex justify-between items-center relative">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-0 right-0 h-1 bg-secondary-light -z-10" />
                        <div
                            className="absolute top-5 left-0 h-1 bg-primary transition-all -z-10"
                            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        />

                        {steps.map((step, index) => (
                            <div key={step.key} className="flex flex-col items-center">
                                <button
                                    onClick={() => index <= currentStepIndex && setCurrentStep(step.key)}
                                    disabled={index > currentStepIndex}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${index <= currentStepIndex
                                        ? 'bg-primary text-white'
                                        : 'bg-secondary-light text-foreground-muted'
                                        } ${index < currentStepIndex ? 'cursor-pointer' : ''}`}
                                >
                                    {step.icon}
                                </button>
                                <span className={`mt-2 text-xs font-medium ${index <= currentStepIndex ? 'text-primary' : 'text-foreground-muted'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="card p-6">
                            {/* Step 1: Address */}
                            {currentStep === 'address' && (
                                <div className="animate-fadeIn">
                                    <h2 className="text-xl font-semibold mb-6">📍 ที่อยู่จัดส่ง</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-2">ชื่อ-นามสกุล</label>
                                            <input
                                                type="text"
                                                className="input"
                                                value={addressForm.fullName}
                                                onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                                placeholder="ชื่อผู้รับสินค้า"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-2">เบอร์โทรศัพท์</label>
                                            <input
                                                type="tel"
                                                className="input"
                                                value={addressForm.phone}
                                                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                                placeholder="08x-xxx-xxxx"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-2">ที่อยู่</label>
                                            <input
                                                type="text"
                                                className="input"
                                                value={addressForm.address}
                                                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                                placeholder="บ้านเลขที่, ถนน, ซอย"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">แขวง/ตำบล</label>
                                            <input
                                                type="text"
                                                className="input"
                                                value={addressForm.subdistrict}
                                                onChange={(e) => setAddressForm({ ...addressForm, subdistrict: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">เขต/อำเภอ</label>
                                            <input
                                                type="text"
                                                className="input"
                                                value={addressForm.district}
                                                onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">จังหวัด</label>
                                            <select
                                                className="input"
                                                value={addressForm.province}
                                                onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                                            >
                                                <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                                                <option value="นนทบุรี">นนทบุรี</option>
                                                <option value="ปทุมธานี">ปทุมธานี</option>
                                                <option value="สมุทรปราการ">สมุทรปราการ</option>
                                                <option value="เชียงใหม่">เชียงใหม่</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">รหัสไปรษณีย์</label>
                                            <input
                                                type="text"
                                                className="input"
                                                value={addressForm.postalCode}
                                                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                                placeholder="10xxx"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Delivery */}
                            {currentStep === 'delivery' && (
                                <div className="animate-fadeIn">
                                    <h2 className="text-xl font-semibold mb-6">🚚 เลือกวันและเวลาจัดส่ง</h2>

                                    {/* Delivery Option */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-3">ประเภทการจัดส่ง</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button
                                                onClick={() => setDeliveryOption('standard')}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${deliveryOption === 'standard'
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-secondary-light hover:border-secondary'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-semibold">จัดส่งปกติ</span>
                                                    <span className={`text-sm ${subtotal >= 500 ? 'text-success font-medium' : ''}`}>
                                                        {subtotal >= 500 ? 'ฟรี!' : '฿50'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground-muted">จัดส่งภายใน 1-2 วัน</p>
                                            </button>
                                            <button
                                                onClick={() => setDeliveryOption('express')}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${deliveryOption === 'express'
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-secondary-light hover:border-secondary'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-semibold">ด่วน Express</span>
                                                    <span>฿80</span>
                                                </div>
                                                <p className="text-sm text-foreground-muted">จัดส่งภายในวันนี้ (สั่งก่อน 12:00)</p>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Date Selection */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-3">เลือกวันจัดส่ง</label>
                                        <div className="flex gap-3 overflow-x-auto pb-2">
                                            {getDeliveryDates().map((date, index) => {
                                                const dateStr = formatThaiDate(date);
                                                const dayNames = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
                                                const dayName = dayNames[date.getDay()];

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => setDeliveryDate(dateStr)}
                                                        className={`flex-shrink-0 p-3 rounded-xl border-2 text-center min-w-[80px] transition-all ${deliveryDate === dateStr
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-secondary-light hover:border-secondary'
                                                            }`}
                                                    >
                                                        <div className="text-xs text-foreground-muted">{dayName}</div>
                                                        <div className="font-semibold">{date.getDate()}</div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Time Slot */}
                                    <div>
                                        <label className="block text-sm font-medium mb-3">เลือกช่วงเวลา</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {timeSlots.map((slot) => (
                                                <button
                                                    key={slot.value}
                                                    onClick={() => setTimeSlot(slot.label)}
                                                    className={`p-3 rounded-xl border-2 transition-all ${timeSlot === slot.label
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-secondary-light hover:border-secondary'
                                                        }`}
                                                >
                                                    {slot.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Payment */}
                            {currentStep === 'payment' && (
                                <div className="animate-fadeIn">
                                    <h2 className="text-xl font-semibold mb-6">💳 เลือกวิธีชำระเงิน</h2>

                                    <div className="space-y-4">
                                        {/* PromptPay */}
                                        <button
                                            onClick={() => setPaymentMethod('promptpay')}
                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === 'promptpay'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-secondary-light hover:border-secondary'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl">
                                                    📱
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold">พร้อมเพย์ PromptPay</div>
                                                    <div className="text-sm text-foreground-muted">สแกน QR Code เพื่อชำระเงิน</div>
                                                </div>
                                                {paymentMethod === 'promptpay' && (
                                                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                                    </svg>
                                                )}
                                            </div>
                                        </button>

                                        {/* Credit Card */}
                                        <button
                                            onClick={() => setPaymentMethod('card')}
                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === 'card'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-secondary-light hover:border-secondary'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-2xl">
                                                    💳
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold">บัตรเครดิต/เดบิต</div>
                                                    <div className="text-sm text-foreground-muted">Visa, Mastercard, JCB</div>
                                                </div>
                                                {paymentMethod === 'card' && (
                                                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                                    </svg>
                                                )}
                                            </div>
                                        </button>

                                        {/* COD */}
                                        <button
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === 'cod'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-secondary-light hover:border-secondary'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-2xl">
                                                    💵
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold">เก็บเงินปลายทาง (COD)</div>
                                                    <div className="text-sm text-foreground-muted">ชำระเงินเมื่อได้รับสินค้า</div>
                                                </div>
                                                {paymentMethod === 'cod' && (
                                                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                                    </svg>
                                                )}
                                            </div>
                                        </button>
                                    </div>

                                    {paymentMethod === 'promptpay' && (
                                        <div className="mt-6 p-6 bg-blue-50 rounded-xl text-center">
                                            <p className="text-sm text-foreground-muted mb-4">สแกน QR Code เพื่อชำระเงิน</p>
                                            <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
                                                <span className="text-6xl">📱</span>
                                            </div>
                                            <p className="mt-4 text-lg font-bold text-primary">{formatPrice(total)}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 4: Confirm */}
                            {currentStep === 'confirm' && (
                                <div className="animate-fadeIn">
                                    <h2 className="text-xl font-semibold mb-6">✅ ยืนยันคำสั่งซื้อ</h2>

                                    <div className="space-y-6">
                                        {/* Address Summary */}
                                        <div className="p-4 bg-surface-hover rounded-xl">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium">📍 ที่อยู่จัดส่ง</h4>
                                                <button
                                                    onClick={() => setCurrentStep('address')}
                                                    className="text-primary text-sm"
                                                >
                                                    แก้ไข
                                                </button>
                                            </div>
                                            <p className="text-sm text-foreground-muted">
                                                {addressForm.fullName || 'คุณทดสอบ'}<br />
                                                {addressForm.phone || '08x-xxx-xxxx'}<br />
                                                {addressForm.address || '123 ถ.สุขุมวิท'}, {addressForm.subdistrict || 'คลองเตยเหนือ'}, {addressForm.district || 'วัฒนา'}, {addressForm.province} {addressForm.postalCode || '10110'}
                                            </p>
                                        </div>

                                        {/* Delivery Summary */}
                                        <div className="p-4 bg-surface-hover rounded-xl">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium">🚚 การจัดส่ง</h4>
                                                <button
                                                    onClick={() => setCurrentStep('delivery')}
                                                    className="text-primary text-sm"
                                                >
                                                    แก้ไข
                                                </button>
                                            </div>
                                            <p className="text-sm text-foreground-muted">
                                                {deliveryOption === 'express' ? 'ด่วน Express' : 'จัดส่งปกติ'}<br />
                                                {deliveryDate || 'พรุ่งนี้'} | {timeSlot || '09:00 - 12:00'}
                                            </p>
                                        </div>

                                        {/* Payment Summary */}
                                        <div className="p-4 bg-surface-hover rounded-xl">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium">💳 ชำระเงิน</h4>
                                                <button
                                                    onClick={() => setCurrentStep('payment')}
                                                    className="text-primary text-sm"
                                                >
                                                    แก้ไข
                                                </button>
                                            </div>
                                            <p className="text-sm text-foreground-muted">
                                                {paymentMethod === 'promptpay' && 'พร้อมเพย์ PromptPay'}
                                                {paymentMethod === 'card' && 'บัตรเครดิต/เดบิต'}
                                                {paymentMethod === 'cod' && 'เก็บเงินปลายทาง (COD)'}
                                            </p>
                                        </div>

                                        {/* Products Summary */}
                                        <div className="p-4 bg-surface-hover rounded-xl">
                                            <h4 className="font-medium mb-3">🛒 สินค้า ({cartData.length} รายการ)</h4>
                                            <div className="space-y-2">
                                                {cartData.map((item) => (
                                                    <div key={item.productId} className="flex justify-between text-sm">
                                                        <span>
                                                            {item.product?.nameTh} x {item.quantity} {item.product?.unit}
                                                        </span>
                                                        <span className="font-medium">
                                                            {formatPrice((item.batch?.pricePerKg || 0) * item.quantity)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex gap-4 mt-8">
                                {currentStepIndex > 0 && (
                                    <button onClick={goToPrevStep} className="btn btn-secondary flex-1">
                                        ← ย้อนกลับ
                                    </button>
                                )}
                                {currentStep === 'confirm' ? (
                                    <button onClick={handleSubmitOrder} className="btn btn-primary flex-1 py-4">
                                        ยืนยันสั่งซื้อ {formatPrice(total)}
                                    </button>
                                ) : (
                                    <button onClick={goToNextStep} className="btn btn-primary flex-1">
                                        ถัดไป →
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            <h2 className="font-semibold text-lg mb-4">สรุปคำสั่งซื้อ</h2>

                            {/* Items */}
                            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                                {cartData.map((item) => (
                                    <div key={item.productId} className="flex gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-xl flex-shrink-0">
                                            {item.product?.category.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.product?.nameTh}</p>
                                            <p className="text-xs text-foreground-muted">
                                                {item.quantity} {item.product?.unit} x {formatPrice(item.batch?.pricePerKg || 0)}
                                            </p>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {formatPrice((item.batch?.pricePerKg || 0) * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-secondary-light mb-4" />

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-foreground-muted">ยอดรวมสินค้า</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-foreground-muted">ค่าจัดส่ง</span>
                                    {deliveryFee === 0 ? (
                                        <span className="text-success font-medium">ฟรี!</span>
                                    ) : (
                                        <span>{formatPrice(deliveryFee)}</span>
                                    )}
                                </div>
                            </div>

                            <hr className="border-secondary-light mb-4" />

                            <div className="flex justify-between items-center">
                                <span className="font-semibold">รวมทั้งหมด</span>
                                <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
