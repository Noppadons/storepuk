import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession(req);
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await req.json();
        const { id } = body;
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pending = await (prisma as any).pendingProduct.findUnique({ where: { id } });
        if (!pending) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Ensure category exists or pick first
        let categoryId = pending.categoryId;
        if (!categoryId) {
            const firstCat = await prisma.category.findFirst();
            categoryId = firstCat?.id;
        }

        // Create Product
        const product = await prisma.product.create({
            data: {
                nameTh: pending.nameTh,
                nameEn: pending.nameEn,
                slug: pending.slug,
                description: pending.description,
                unit: pending.unit,
                basePrice: pending.basePrice,
                image: pending.image,
                storageTemp: pending.storageTemp,
                shelfLifeDays: pending.shelfLifeDays,
                categoryId: categoryId || '',
                farms: { connect: { id: pending.farmId } }
            }
        });

        // Delete pending
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma as any).pendingProduct.delete({ where: { id } });

        return NextResponse.json(product);
    } catch (error: unknown) {
        console.error('Approve error:', error);
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message || 'Approve failed' }, { status: 500 });
    }
}
