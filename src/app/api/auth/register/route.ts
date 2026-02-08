
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, fullName, phone, role: requestedRole, adminInviteCode } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
        }

        // Validate role
        const allowedRoles = ['customer', 'farmer'];
        let roleToSet = 'customer';
        if (typeof requestedRole === 'string' && allowedRoles.includes(requestedRole)) {
            roleToSet = requestedRole;
        }

        // Support creating admin only with a secret invite code
        if (requestedRole === 'admin') {
            const secret = process.env.ADMIN_INVITE_CODE;
            if (!secret || adminInviteCode !== secret) {
                return NextResponse.json({ error: 'Invalid invite code' }, { status: 403 });
            }
            roleToSet = 'admin';
        }

        // Create user with hashed password
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: fullName || email.split('@')[0],
                phone,
                role: roleToSet
            }
        });

        // Sign token and set cookie so user is logged in immediately after register
        const token = await signToken({ userId: user.id, email: user.email, role: user.role });
        const response = NextResponse.json((() => {
            const u = { ...user } as Record<string, unknown>;
            delete (u as { password?: unknown }).password;
            return u;
        })());

        response.cookies.set({
            name: 'sodsai_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24
        });

        return response;
    } catch (error: unknown) {
        console.error('Registration error:', error);
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message || 'Registration failed' }, { status: 500 });
    }
}
