
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { formatPrice, formatThaiDate } from '@/lib/utils';

export default async function FarmerDashboard() {
    const session = await getSession();
    if (!session) return null; // layout already redirects if unauthorized

    const userId = session.userId as string;

    // Fetch farm and related data
    const farm = await prisma.farm.findUnique({ where: { userId } });
    if (!farm) {
        return (
            <div className="p-8">
                <h2 className="text-xl font-semibold">ยังไม่มีฟาร์ม</h2>
                <p className="text-gray-600 mt-2">สร้างโปรไฟล์ฟาร์มของคุณเพื่อเริ่มขายสินค้า</p>
                <Link href="/farmer-portal/settings" className="inline-block mt-4 btn btn-primary">สร้างฟาร์ม</Link>
            </div>
        );
    }

    const batches = await prisma.harvestBatch.findMany({
        where: { farmId: farm.id },
        include: { product: true },
        orderBy: { harvestDate: 'desc' }
    });

    const orders = await prisma.order.findMany({
        where: { items: { some: { batch: { farmId: farm.id } } } },
        include: {
            items: { include: { batch: { include: { product: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20
    });

    const totalSales = orders.reduce((total, order) => {
        // sum only items that belong to this farm
        const farmItems = order.items.filter((i: any) => i.batch && i.batch.farmId === farm.id);
        return total + farmItems.reduce((s: number, it: any) => s + (it.totalPrice || 0), 0);
    }, 0);

    const activeBatches = batches.filter(b => b.status === 'available' || b.status === 'low_stock');
    const lowStockBatches = batches.filter(b => b.status === 'low_stock' || (b.status === 'available' && b.remainingKg < 10 && b.remainingKg > 0));
    const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">สวัสดี, {farm.name} 👋</h1>
                    <p className="text-gray-500">แดชบอร์ดจัดการฟาร์มของคุณ</p>
                </div>
                <Link href="/farmer-portal/inventory/new" className="hidden md:flex btn btn-primary items-center gap-2">
                    <span>+</span> เพิ่มล็อตผักใหม่
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="card p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-green-100 text-green-600 text-xl">💰</div>
                        <span className="badge bg-green-50 text-green-600">Total</span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">ยอดขายรวม</p>
                        <h3 className="text-2xl font-bold">{formatPrice(totalSales)}</h3>
                    </div>
                </div>

                <div className="card p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-blue-100 text-blue-600 text-xl">📦</div>
                        <span className="text-gray-400 text-sm">ทั้งหมด {batches.length}</span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">สต็อกผักที่ลงขาย</p>
                        <h3 className="text-2xl font-bold">{activeBatches.length} รายการ</h3>
                    </div>
                </div>

                <div className="card p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-amber-100 text-amber-600 text-xl">⚠️</div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">ผักใกล้หมด</p>
                        <h3 className="text-2xl font-bold">{lowStockBatches.length} รายการ</h3>
                    </div>
                </div>

                <div className="card p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-purple-100 text-purple-600 text-xl">📝</div>
                        <span className="badge bg-purple-50 text-purple-600">Pending</span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">คำสั่งซื้อรอส่ง</p>
                        <h3 className="text-2xl font-bold">{pendingOrdersCount}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg">คำสั่งซื้อล่าสุด</h3>
                        <Link href="/farmer-portal/orders" className="text-primary text-sm hover:underline">ดูทั้งหมด</Link>
                    </div>
                    <div className="space-y-4">
                        {orders.length > 0 ? (
                            orders.slice(0, 5).map(order => (
                                <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-500">
                                            {String(order.orderNumber).slice(-4)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">#{order.orderNumber}</p>
                                            <p className="text-xs text-gray-500">{formatThaiDate(String(order.createdAt))}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`badge text-xs px-2 py-1 rounded-full ${order.status === 'shipping' ? 'bg-purple-100 text-purple-700' :
                                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                ยังไม่มีคำสั่งซื้อ
                            </div>
                        )}
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg text-amber-600 flex items-center gap-2">
                            <span>⚠️</span> เตือนสต็อกต่ำ
                        </h3>
                        <Link href="/farmer-portal/inventory" className="text-primary text-sm hover:underline">จัดการสต็อก</Link>
                    </div>
                    <div className="space-y-4">
                        {lowStockBatches.length > 0 ? (
                            lowStockBatches.map(batch => (
                                <div key={batch.id} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden">
                                            <div className="w-full h-full flex items-center justify-center text-xs">🥬</div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{batch.product?.nameTh || 'Batch #' + batch.id}</p>
                                            <p className="text-xs text-gray-500">{formatThaiDate(String(batch.harvestDate))}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-amber-600">{batch.remainingKg} กก.</p>
                                        <p className="text-xs text-gray-400">จาก {batch.quantityKg} กก.</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                                <span className="text-4xl mb-2">✅</span>
                                <p>สต็อกผักของคุณเพียงพอทุกรายการ</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
