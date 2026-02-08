import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            nameTh,
            nameEn,
            slug,
            description,
            unit,
            basePrice,
            categoryId,
            farmId,
        } = body;

        if (!nameTh || !nameEn || !slug || !farmId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pending = await (prisma as any).pendingProduct.create({
            data: {
                nameTh,
                nameEn,
                slug,
                description,
                unit: unit || 'kg',
                basePrice: Number(basePrice) || 0,
                categoryId: categoryId || undefined,
                farmId,
            }
        });

        return NextResponse.json(pending);
    } catch (error: unknown) {
        console.error('Create pending product error:', error);
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message || 'Failed' }, { status: 500 });
    }
}

export async function GET() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items = await (prisma as any).pendingProduct.findMany({ include: { farm: true } });
        return NextResponse.json(items);
    } catch (error: unknown) {
        console.error('List pending products error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
