import FarmerLayoutClient from './FarmerLayoutClient';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function FarmerLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (!session) return redirect('/login');

    const role = typeof session.role === 'string' ? (session.role as string) : String(session.role ?? '');
    if (role !== 'farmer') return redirect('/');

    const userId = session.userId ?? session.user_id ?? session.sub;
    const id = typeof userId === 'string' ? userId : String(userId ?? '');

    const user = await prisma.user.findUnique({
        where: { id },
        include: { farm: true }
    });

    if (!user) return redirect('/login');

    // Pass a trimmed server-side user object to the client component
    const serverUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        farm: user.farm ? { id: user.farm.id, name: user.farm.name } : null
    };

    return <FarmerLayoutClient serverUser={serverUser}>{children}</FarmerLayoutClient>;
}
