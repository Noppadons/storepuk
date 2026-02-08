'use client';

import { useEffect, useState } from 'react';
import { User } from '@/types';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/user?all=true');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateRole = async (userId: string, newRole: string) => {
        setUpdatingUserId(userId);
        try {
            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, role: newRole })
            });

            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as User['role'] } : u));
            } else {
                alert('อัปเดตบทบาทไม่สำเร็จ');
            }
        } catch (error) {
            console.error('Update role error:', error);
        } finally {
            setUpdatingUserId(null);
        }
    };

    if (loading) return <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">กำลังโหลดข้อมูลผู้ใช้งาน...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">จัดการผู้ใช้งาน (Users)</h1>
                <p className="text-slate-500">ตรวจสอบและกำหนดสิทธิ์การเข้าใช้งานในระบบ</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-slate-600">ผู้ใช้งาน</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">อีเมล</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">เบอร์โทร</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">บทบาท</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">แต้มบุญ</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{user.name || 'Anonymous'}</p>
                                                <p className="text-xs text-slate-400">ID: {user.id.slice(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600 text-sm">{user.email}</td>
                                    <td className="p-4 text-slate-600 text-sm">{user.phone || '-'}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'farmer' ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role === 'admin' ? 'Admin' : user.role === 'farmer' ? 'Farmer' : 'Customer'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-600 text-sm">{user.loyaltyPoints.toLocaleString()}</td>
                                    <td className="p-4 text-center">
                                        <select
                                            disabled={updatingUserId === user.id}
                                            value={user.role}
                                            onChange={(e) => updateRole(user.id, e.target.value)}
                                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 mx-auto disabled:opacity-50"
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="farmer">Farmer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
