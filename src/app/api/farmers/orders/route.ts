import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'farmer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, action } = body;
    if (!id || !action) return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });

    // Ensure the order contains items for this farmer
    const farm = await prisma.farm.findUnique({ where: { userId: session.userId as string } });
    if (!farm) return NextResponse.json({ error: 'Farm not found' }, { status: 404 });

    const order = await prisma.order.findUnique({ where: { id }, include: { items: { include: { batch: true } } } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const hasFarmItem = order.items.some(i => i.batch && i.batch.farmId === farm.id);
    if (!hasFarmItem) return NextResponse.json({ error: 'Unauthorized for this order' }, { status: 403 });

    let newStatus: string | null = null;
    if (action === 'confirm') newStatus = 'confirmed';
    if (action === 'cancel') newStatus = 'cancelled';
    if (action === 'ship') newStatus = 'shipping';

    if (!newStatus) return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

    const updated = await prisma.order.update({ where: { id }, data: { status: newStatus } });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('Farmer order action error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message || 'Failed to update order' }, { status: 500 });
  }
}
