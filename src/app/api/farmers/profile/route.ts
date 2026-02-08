import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'farmer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, province, description } = body;

    if (!id) return NextResponse.json({ error: 'Missing farm id' }, { status: 400 });

    // Ensure farmer owns the farm
    const farm = await prisma.farm.findUnique({ where: { id } });
    if (!farm || farm.userId !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updated = await prisma.farm.update({ where: { id }, data: { name, province, description } });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('Update farm profile error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message || 'Failed to update farm' }, { status: 500 });
  }
}
