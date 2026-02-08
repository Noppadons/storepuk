
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const farms = await prisma.farm.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        role: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
        return NextResponse.json(farms);
    } catch (error) {
        console.error('Fetch farmers error:', error);
        return NextResponse.json({ error: 'Failed to fetch farmers' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { farmId, isVerified } = body;

        if (!farmId) {
            return NextResponse.json({ error: 'Farm ID is required' }, { status: 400 });
        }

        const farm = await prisma.farm.update({
            where: { id: farmId },
            data: { isVerified },
            include: { user: true }
        });

        return NextResponse.json(farm);
    } catch (error) {
        console.error('Update farmer error:', error);
        return NextResponse.json({ error: 'Failed to update farmer' }, { status: 500 });
    }
}
