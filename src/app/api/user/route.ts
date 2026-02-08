
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
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                addresses: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name: fullName, phone, email, addresses, ...otherFields } = body; // Destructure `addresses` and rename `name` to `fullName`

        if (!id) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id }, // Keep `id` for where clause as per original logic, assuming `id` is the primary key for update
            data: {
                name: fullName || undefined, // Handle optional updates
                phone: phone || undefined,
                email: email || undefined, // Make email optional for update if not provided
                // If addresses are provided, create new ones. This assumes a "replace all" or "add new" strategy.
                // For a more robust solution, consider `upsert` or `deleteMany` followed by `createMany`.
                addresses: addresses && addresses.length > 0 ? {
                    // For MVP, simplistic "create new ones" or "delete all and create".
                    // Better approach: upsert. But here let's just create new ones if provided.
                    // Or more robustly:
                    create: addresses.map((addr: any) => ({
                        label: addr.label,
                        fullName: addr.fullName,
                        phone: addr.phone,
                        address: addr.address,
                        subdistrict: addr.subdistrict,
                        district: addr.district,
                        province: addr.province,
                        postalCode: addr.postalCode,
                        isDefault: addr.isDefault
                    }))
                } : undefined,
                ...otherFields // be careful with what fields allowed
            },
            include: { // Include addresses in the returned user object
                addresses: true
            }
        });

        const { password: _, ...userWithoutPassword } = updatedUser;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
