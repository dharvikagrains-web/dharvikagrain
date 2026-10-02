import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { signSession, AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { db, UserRole } from '@/lib/db';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const rawRedirect =
    requestUrl.searchParams.get('redirect') ||
    requestUrl.searchParams.get('next') ||
    '/account';

  // Sanitize redirect URL to prevent open redirect vulnerabilities
  let redirectTarget = '/account';
  if (rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')) {
    redirectTarget = rawRedirect;
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data?.session && data?.user) {
        const user = data.user;
        const meta = user.user_metadata || {};
        const email = (user.email || '').trim().toLowerCase();
        const fullName =
          meta.full_name ||
          meta.name ||
          (email ? email.split('@')[0] : 'Dharvika Customer');
        const phone = meta.phone || user.phone || '';
        const avatarUrl = meta.avatar_url || meta.picture || '';

        // Check if existing user has special role or if email is owner
        let assignedRole: UserRole = 'CUSTOMER';
        const existingUser = db.getUserById(user.id) || (email ? db.getUserByEmail(email) : null);
        if (existingUser?.role) {
          assignedRole = existingUser.role;
        } else if (
          email === 'dharvikagrains@gmail.com' ||
          email.endsWith('@dharvikagrains.com') ||
          email.endsWith('@dharvikagrains.in')
        ) {
          assignedRole = 'OWNER';
        } else if (redirectTarget.startsWith('/admin')) {
          assignedRole = 'ADMIN';
        } else if (redirectTarget.startsWith('/investor')) {
          assignedRole = 'INVESTOR';
        }

        // Upsert user in db
        try {
          db.upsertUser({
            email,
            mobile: phone,
            fullName,
            role: assignedRole,
          });

          db.upsertProfile({
            id: user.id,
            fullName,
            email,
            phone,
            avatarUrl,
            role:
              assignedRole === 'OWNER' || assignedRole === 'SUPER_ADMIN'
                ? 'OWNER'
                : assignedRole === 'ADMIN' || assignedRole === 'OPERATIONS'
                ? 'ADMIN'
                : 'CUSTOMER',
          });
        } catch (dbErr) {
          console.warn('[AUTH_CALLBACK] Database sync warning:', dbErr);
        }

        // Generate HMAC-SHA256 session token for middleware & API access
        const sessionToken = signSession({
          userId: user.id,
          email,
          mobile: phone,
          fullName,
          role: assignedRole,
        });

        const targetUrl = new URL(redirectTarget, requestUrl.origin);
        const response = NextResponse.redirect(targetUrl);

        // Set authoritative cookie
        response.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 72 * 60 * 60, // 3 days
        });

        return response;
      }
    } catch (err) {
      console.error('[AUTH_CALLBACK] Error exchanging code for session:', err);
    }
  }

  // Fallback if code exchange fails
  const errorUrl = new URL('/login', requestUrl.origin);
  errorUrl.searchParams.set('error', 'Google authentication could not be completed.');
  if (redirectTarget) {
    errorUrl.searchParams.set('redirect', redirectTarget);
  }
  return NextResponse.redirect(errorUrl);
}
