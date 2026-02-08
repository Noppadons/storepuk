
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const query = searchParams.get('q');

    try {
        const where: Record<string, unknown> = {};

        if (categoryId && categoryId !== 'all') {
            where.categoryId = categoryId;
        }

        if (query) {
            where.OR = [
                { nameTh: { contains: query } },
                { nameEn: { contains: query } },
            ];
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                category: true,
                batches: {
                    where: {
                        status: 'available',
                        remainingKg: { gt: 0 }
                    },
                    orderBy: {
                        harvestDate: 'desc'
                    }
                },
                farms: true
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { nameTh, nameEn, slug, description, unit, shelfLifeDays, storageTemp, basePrice, categoryId, images } = body;

        const product = await prisma.product.create({
            data: {
                nameTh,
                nameEn,
                slug,
                description,
                unit,
                shelfLifeDays: shelfLifeDays || 7,
                storageTemp: storageTemp || '2-8°C',
                basePrice: basePrice || 0,
                categoryId,
                image: Array.isArray(images) && images.length ? images[0] : undefined
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, nameTh, nameEn, slug, description, unit, shelfLifeDays, storageTemp, basePrice, categoryId, images } = body;

        const product = await prisma.product.update({
            where: { id },
            data: {
                nameTh,
                nameEn,
                slug,
                description,
                unit,
                shelfLifeDays,
                storageTemp,
                basePrice,
                categoryId,
                image: Array.isArray(images) && images.length ? images[0] : undefined
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        await prisma.product.delete({
            where: { id }
        });
        return NextResponse.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
