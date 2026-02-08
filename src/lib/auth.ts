
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'sodsai-super-secret-key-change-me-in-production'
);

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function signToken(payload: Record<string, unknown>) {
    return new SignJWT(payload as Record<string, unknown>)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as Record<string, unknown>;
    } catch (err) {
        return null;
    }
}

export async function getSession(req?: NextRequest): Promise<Record<string, unknown> | null> {
    const token = req
        ? req.cookies.get('sodsai_token')?.value
        : (await cookies()).get('sodsai_token')?.value;

    if (!token) return null;
    return verifyToken(token);
}
