
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { sortOrder: 'asc' }
        });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nameTh, nameEn, slug, icon, sortOrder } = body;

        const category = await prisma.category.create({
            data: {
                nameTh,
                nameEn,
                slug,
                icon,
                sortOrder: sortOrder || 0
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
