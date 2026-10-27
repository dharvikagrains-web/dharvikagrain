import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'dharvika_session';
const AUTH_SECRET = process.env.AUTH_SECRET || 'dharvika_luxury_grains_super_secret_key_2026';

const ADMIN_ROLES = [
  'OWNER',
  'SUPER_ADMIN',
  'ADMIN',
  'OPERATIONS',
  'INVENTORY_MANAGER',
  'CUSTOMER_SUPPORT',
];

interface MiddlewareSessionPayload {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  exp: number;
}

/**
 * Verify HMAC-SHA256 signature using Edge-compatible Web Crypto API
 */
async function verifySessionToken(token: string): Promise<MiddlewareSessionPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [base64Data, signature] = parts;

    // Decode base64url data
    const jsonStr = atob(base64Data.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(jsonStr);

    // Check expiration
    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }

    // Verify HMAC-SHA256 signature using Web Crypto
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(AUTH_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Convert signature from base64url to binary Uint8Array
    const binarySignature = atob(signature.replace(/-/g, '+').replace(/_/g, '/'));
    const sigBytes = new Uint8Array(binarySignature.length);
    for (let i = 0; i < binarySignature.length; i++) {
      sigBytes[i] = binarySignature.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      encoder.encode(base64Data)
    );

    return isValid ? payload : null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login pages through without interception
  if (pathname === '/admin/login' || pathname === '/investor/login') {
    return NextResponse.next();
  }

  // 1. Protect /admin and /api/admin paths
  const isAdminPath = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (isAdminPath || isAdminApi) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    let payload = null;
    if (token) {
      payload = await verifySessionToken(token);
    }

    const hasAdminAccess = payload && ADMIN_ROLES.includes(payload.role);

    if (!hasAdminAccess) {
      // Return 401/403 for API routes
      if (isAdminApi) {
        return NextResponse.json(
          { error: 'Unauthorized: Admin authentication required.' },
          { status: 401 }
        );
      }

      // Redirect UI requests to /admin/login
      const adminLoginUrl = new URL('/admin/login', request.url);
      adminLoginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  // 2. /investor paths
  if (pathname === '/investor' || pathname.startsWith('/investor/')) {
    // Allow through; page component and /investor/login authenticate data room passcodes
  }

  // 3. /checkout paths: Support seamless guest checkout and customer session auto-fill
  // Guest customers are permitted to input address and place orders directly without forced login
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
