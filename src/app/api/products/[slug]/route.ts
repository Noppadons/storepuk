
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
                batches: {
                    where: {
                        status: 'available',
                        remainingKg: { gt: 0 }
                    },
                    orderBy: {
                        harvestDate: 'desc' // Newest first
                    },
                    include: {
                        farm: true
                    }
                }
            }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}
