
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types'; // Reuse existing types, might need adjustment if Prisma types differ slightly
// Actually, Prisma generated types are better, but let's stick to shared interface if possible or map them.
// Our User interface in types/index.ts matches fairly well.

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
    updateUser: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check session via API on mount
        const checkSession = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                }
            } catch (err) {
                console.error('Failed to check session', err);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const login = (userData: User) => {
        // Cookie is already set by the server during login API call
        setUser(userData);
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/me', { method: 'DELETE' });
            setUser(null);
            // Redirect to home
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            // Fallback
            setUser(null);
            window.location.href = '/';
        }
    };

    const updateUser = (userData: Partial<User>) => {
        if (!user) return;
        setUser({ ...user, ...userData } as User);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
