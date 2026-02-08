import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (!session) {
        return redirect('/login');
    }

    if (session.role !== 'admin') {
        return redirect('/');
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
