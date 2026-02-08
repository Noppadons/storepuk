
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Address } from '@/types'; // Reuse existing types, might need adjustment if Prisma types differ slightly
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
        // Check localStorage on mount
        const storedUser = localStorage.getItem('sodsai_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse user from storage');
                localStorage.removeItem('sodsai_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('sodsai_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sodsai_user');
        // Optional: redirect to login
        window.location.href = '/login';
    };

    const updateUser = (userData: Partial<User>) => {
        if (!user) return;
        const newUser = { ...user, ...userData };
        setUser(newUser as User);
        localStorage.setItem('sodsai_user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
