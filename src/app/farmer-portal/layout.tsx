import FarmerLayoutClient from './FarmerLayoutClient';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function FarmerLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (!session) return redirect('/login');

    const role = typeof session.role === 'string' ? (session.role as string) : String(session.role ?? '');
    if (role !== 'farmer') return redirect('/');

    return <FarmerLayoutClient>{children}</FarmerLayoutClient>;
}
