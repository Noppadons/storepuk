
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId as string },
            include: {
                addresses: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userWithoutPassword = { ...user } as Record<string, unknown>;
        delete (userWithoutPassword as { password?: unknown }).password;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ message: 'Logged out' });

    // Clear cookie
    response.cookies.delete('sodsai_token');

    return response;
}
