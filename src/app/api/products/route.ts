
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const query = searchParams.get('q');

    try {
        const where: any = {};

        if (categoryId && categoryId !== 'all') {
            where.categoryId = categoryId; // or category.slug if frontend sends slug
        }

        if (query) {
            where.OR = [
                { nameTh: { contains: query } }, // SQLite doesn't support case-insensitive mode easily efficiently, but contains works
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
