
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { items, addressId, total, deliveryFee, discount } = body;
        const userId = session.userId as string;

        if (!items || !items.length || !addressId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const count = await prisma.order.count();
        const orderNumber = `VEG-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;

        type OrderItemInput = { batchId: string; quantityKg: number; unitPrice: number; totalPrice: number };
        const itemsInput = items as OrderItemInput[];

        for (const item of itemsInput) {
            const batch = await prisma.harvestBatch.findUnique({ where: { id: item.batchId } });
            if (!batch) throw new Error(`Batch ${item.batchId} not found`);
            if (batch.remainingKg < item.quantityKg) {
                throw new Error(`Insufficient stock for batch ${item.batchId}`);
            }
        }

        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    orderNumber,
                    userId,
                    addressId,
                    status: 'pending',
                    total,
                    deliveryFee: deliveryFee || 0,
                    discount: discount || 0,
                    subtotal: total - (deliveryFee || 0) + (discount || 0),
                    items: {
                        create: itemsInput.map((item) => ({
                            batchId: item.batchId,
                            quantityKg: item.quantityKg,
                            unitPrice: item.unitPrice,
                            totalPrice: item.totalPrice
                        }))
                    }
                }
            });

            for (const item of itemsInput) {
                await tx.harvestBatch.update({
                    where: { id: item.batchId },
                    data: {
                        remainingKg: { decrement: item.quantityKg }
                    }
                });
            }

            return order;
        });

        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error('Order creation error:', error);
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message || 'Failed to create order' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const farmerId = searchParams.get('farmerId');

        const where: Record<string, unknown> = {};

        if (session.role === 'customer') {
            where.userId = session.userId;
        }
        else if (session.role === 'admin') {
            if (userId) where.userId = userId;
            else if (farmerId) {
                where.items = { some: { batch: { farm: { userId: farmerId } } } };
            }
        }
        else if (session.role === 'farmer') {
            where.items = { some: { batch: { farm: { userId: session.userId } } } };
        }

        const orders = await prisma.order.findMany({
            where,
            include: {
                user: { select: { name: true, email: true, phone: true } },
                items: {
                    include: {
                        batch: {
                            include: {
                                product: true
                            }
                        }
                    }
                },
                address: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing order ID or status' }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
