
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'sodsai-super-secret-key-change-me-in-production'
);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('sodsai_token')?.value;
    const { pathname } = request.nextUrl;

    // Routes that require specific roles
    const isAdminRoute = pathname.startsWith('/admin');
    const isFarmerRoute = pathname.startsWith('/farmer-portal');
    const isAccountRoute = pathname.startsWith('/account');

    if (isAdminRoute || isFarmerRoute || isAccountRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            const role = payload.role as string;

            if (isAdminRoute && role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }

            if (isFarmerRoute && role !== 'farmer' && role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }

            // Allow access
            return NextResponse.next();
        } catch (err) {
            // Invalid token
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('sodsai_token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/farmer-portal/:path*',
        '/account/:path*',
    ],
};
