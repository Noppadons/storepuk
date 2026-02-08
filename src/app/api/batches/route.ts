
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    try {
        // Find farm for user
        const farm = await prisma.farm.findUnique({
            where: { userId }
        });

        if (!farm) {
            return NextResponse.json([]); // No farm yet, so no batches
        }

        const batches = await prisma.harvestBatch.findMany({
            where: { farmId: farm.id },
            include: {
                product: true
            },
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

    } catch (error: any) {
        console.error('Create batch error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create batch' }, { status: 500 });
    }
}
