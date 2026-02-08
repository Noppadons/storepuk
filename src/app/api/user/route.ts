
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all');

    try {
        if (all === 'true') {
            const session = await getSession();
            if (!session || session.role !== 'admin') {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            const users = await prisma.user.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return NextResponse.json(users);
        }

        if (id) {
            const user = await prisma.user.findUnique({
                where: { id },
                include: {
                    addresses: true
                }
            });

            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const { password: _, ...userWithoutPassword } = user;
            return NextResponse.json(userWithoutPassword);
        }

        return NextResponse.json({ error: 'User ID or all=true required' }, { status: 400 });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, phone, email, addresses } = body;

        // Security check: only admin or the user themselves can update
        if (session.role !== 'admin' && session.userId !== id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updateData: Record<string, unknown> = {
            name,
            phone,
            email,
        };

        if (session.role === 'admin' && body.role) {
            updateData.role = body.role;
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData
        });

        // Update addresses if provided
        if (addresses && Array.isArray(addresses)) {
            for (const addr of addresses) {
                if (addr.id) {
                    await prisma.address.update({
                        where: { id: addr.id },
                        data: {
                            label: addr.label,
                            fullName: addr.fullName,
                            phone: addr.phone,
                            address: addr.address,
                            subdistrict: addr.subdistrict,
                            district: addr.district,
                            province: addr.province,
                            postalCode: addr.postalCode,
                            isDefault: addr.isDefault
                        }
                    });
                } else {
                    await prisma.address.create({
                        data: {
                            ...addr,
                            userId: id
                        }
                    });
                }
            }
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
