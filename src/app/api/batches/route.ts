
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!userId && !id) {
        return NextResponse.json({ error: 'User ID or id required' }, { status: 400 });
    }

    try {
        if (id) {
            const batch = await prisma.harvestBatch.findUnique({ where: { id }, include: { product: true } });
            return NextResponse.json(batch);
        }

        // Find farm for user
        const farm = await prisma.farm.findUnique({ where: { userId: userId as string } });
        if (!farm) return NextResponse.json([]);

        const batches = await prisma.harvestBatch.findMany({
            where: { farmId: farm.id },
            include: { product: true },
            orderBy: { harvestDate: 'desc' }
        });

        return NextResponse.json(batches);
    } catch (error) {
        console.error('Fetch batches error:', error);
        return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, productId, quantityKg, price, harvestDate } = body;

        if (!userId || !productId || !quantityKg || !price) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Get or Create Farm for User (MVP convenience)
        let farm = await prisma.farm.findUnique({ where: { userId } });
        if (!farm) {
            // Create a default farm profile if none exists
            // Need user name for farm name
            const user = await prisma.user.findUnique({ where: { id: userId } });
            farm = await prisma.farm.create({
                data: {
                    userId,
                    name: `ไร่ของ ${user?.name || 'เกษตรกร'}`, // Default name
                    province: 'Unknown', // Placeholder
                    description: 'ฟาร์มผักปลอดสารพิษ'
                }
            });
            // Update user role to farmer if not already?
            if (user?.role !== 'farmer') {
                await prisma.user.update({ where: { id: userId }, data: { role: 'farmer' } });
            }
        }

        // 2. Create Batch
        const batch = await prisma.harvestBatch.create({
            data: {
                farmId: farm.id,
                productId,
                quantityKg: parseFloat(quantityKg),
                remainingKg: parseFloat(quantityKg),
                pricePerKg: parseFloat(price),
                harvestDate: new Date(harvestDate || Date.now()),
                status: 'available'
            }
        });

        return NextResponse.json(batch);

    } catch (error: unknown) {
        console.error('Create batch error:', error);
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message || 'Failed to create batch' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'farmer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id: rawId, price, quantityKg, remainingKg, harvestDate, status } = body as Record<string, unknown>;
        const id = rawId ? String(rawId) : undefined;
        const newPrice = price !== undefined ? parseFloat(String(price)) : undefined;
        const newQuantity = quantityKg !== undefined ? parseFloat(String(quantityKg)) : undefined;
        const newRemaining = remainingKg !== undefined ? parseFloat(String(remainingKg)) : undefined;
        if (!id) return NextResponse.json({ error: 'Batch id required' }, { status: 400 });

        const batch = await prisma.harvestBatch.findUnique({ where: { id: id as string }, include: { farm: true } });
        if (!batch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
        if (batch.farm.userId !== (session.userId as string)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const data: Record<string, unknown> = {};
        if (newPrice !== undefined) data.pricePerKg = newPrice;
        if (newQuantity !== undefined) data.quantityKg = newQuantity;
        if (newRemaining !== undefined) data.remainingKg = newRemaining;
        if (harvestDate !== undefined) data.harvestDate = new Date(String(harvestDate));
        if (status !== undefined) data.status = String(status);

        // If new quantity is set and remaining not provided, clamp remaining to new quantity
        if (newQuantity !== undefined && newRemaining === undefined) {
            data.remainingKg = Math.min(batch.remainingKg, newQuantity);
        }

        const updated = await prisma.harvestBatch.update({ where: { id: id as string }, data });
        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update batch error:', error);
        return NextResponse.json({ error: 'Failed to update batch' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'farmer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Batch id required' }, { status: 400 });

        const batch = await prisma.harvestBatch.findUnique({ where: { id }, include: { farm: true } });
        if (!batch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
        if (batch.farm.userId !== (session.userId as string)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const orderCount = await prisma.orderItem.count({ where: { batchId: id } });
        if (orderCount > 0) return NextResponse.json({ error: 'Cannot delete batch with order items' }, { status: 400 });

        await prisma.harvestBatch.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete batch error:', error);
        return NextResponse.json({ error: 'Failed to delete batch' }, { status: 500 });
    }
}
