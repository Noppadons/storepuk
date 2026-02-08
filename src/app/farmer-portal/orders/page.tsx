import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { formatPrice, formatThaiDate } from '@/lib/utils';

export default async function OrderPage() {
    const session = await getSession();
    if (!session || session.role !== 'farmer') return null;

    const farm = await prisma.farm.findUnique({ where: { userId: session.userId as string } });
    if (!farm) {
        return <div className="p-8">ยังไม่มีฟาร์มของคุณ</div>;
    }

    const orders = await prisma.order.findMany({
        where: { items: { some: { batch: { farmId: farm.id } } } },
        include: { items: { include: { batch: { include: { product: true } } } }, address: true },
        orderBy: { createdAt: 'desc' },
    });

    const myOrders = orders.map(order => {
        const myItems = order.items.filter(i => i.batch && i.batch.farmId === farm.id);
        const myTotal = myItems.reduce((s, it) => s + (it.totalPrice || 0), 0);
        return { ...order, myItems, myTotal };
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">คำสั่งซื้อ (Orders)</h1>
                <div>
                    <Link href="/farmer-portal" className="text-sm text-gray-500">กลับ</Link>
                </div>
            </div>

            <div className="space-y-4">
                {myOrders.length > 0 ? (
                    myOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="font-bold">#{order.orderNumber}</p>
                                        <p className="text-xs text-gray-500">{formatThaiDate(String(order.createdAt))}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'shipping' ? 'bg-purple-100 text-purple-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">ยอดสุทธิ (เฉพาะของคุณ)</p>
                                    <p className="font-bold text-lg text-primary">{formatPrice(order.myTotal)}</p>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="space-y-3">
                                      {order.myItems.map(item => (
                                        <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0 border-dashed border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-lg">🥬</div>
                                                <div>
                                                    <p className="font-medium text-sm">{item.batch.product?.nameTh || 'ไม่ระบุ'}</p>
                                                    <p className="text-xs text-gray-500">Lot: {item.batch.id}</p>
                                                </div>
                                            </div>
                                            <div className="text-right text-sm">
                                                <p>{item.quantityKg} กก. x {formatPrice(item.unitPrice)}</p>
                                                <p className="font-semibold">{formatPrice(item.totalPrice)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between gap-4 text-sm bg-blue-50/50 p-3 rounded-lg">
                                    {order.address ? (
                                        <div>
                                            <p className="font-semibold mb-1 text-gray-700">ที่อยู่จัดส่ง:</p>
                                            <p className="text-gray-600">{order.address.fullName} ({order.address.phone})</p>
                                            <p className="text-gray-600">{order.address.address} {order.address.subdistrict} {order.address.district} {order.address.province} {order.address.postalCode}</p>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">ไม่มีที่อยู่จัดส่ง</div>
                                    )}
                                    {order.status === 'pending' && (
                                        <div className="flex items-end gap-2">
                                            <button onClick={async ()=>{
                                                if (!confirm('ปฏิเสธคำสั่งซื้อนี้?')) return;
                                                await fetch('/api/farmers/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: order.id, action: 'cancel' }) });
                                                window.location.reload();
                                            }} className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 text-sm">ปฏิเสธ</button>
                                            <button onClick={async ()=>{
                                                if (!confirm('ยืนยันคำสั่งซื้อนี้?')) return;
                                                await fetch('/api/farmers/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: order.id, action: 'confirm' }) });
                                                window.location.reload();
                                            }} className="btn btn-primary px-6 py-2 text-sm shadow-sm">ยืนยันออเดอร์</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <span className="text-4xl block mb-2">📭</span>
                        <p className="text-gray-500">ไม่พบคำสั่งซื้อในสถานะนี้</p>
                    </div>
                )}
            </div>
        </div>
    );
}
