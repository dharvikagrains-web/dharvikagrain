import { NextResponse, type NextRequest } from 'next/server';
import { signSession, AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { db, UserRole } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = body.user;
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: 'User payload required' },
        { status: 400 }
      );
    }

    const meta = user.user_metadata || {};
    const email = (user.email || '').trim().toLowerCase();
    const fullName =
      meta.full_name ||
      meta.name ||
      (email ? email.split('@')[0] : 'Dharvika Customer');
    const phone = meta.phone || user.phone || '';
    const avatarUrl = meta.avatar_url || meta.picture || '';

    const destination = (body.destination || '').toString();
    const isAdminTarget = destination.startsWith('/admin');
    const isInvestorTarget = destination.startsWith('/investor');

    // Assign appropriate role based on email, destination, or existing record
    let assignedRole: UserRole = 'CUSTOMER';
    const existingUser = db.getUserById(user.id) || (email ? db.getUserByEmail(email) : null);
    if (existingUser?.role) {
      assignedRole = existingUser.role;
    }

    const isOwnerEmail =
      email === 'dharvikagrains@gmail.com' ||
      email === 'pavangeesala81@gmail.com' ||
      email.includes('pavan') ||
      email.endsWith('@dharvikagrains.com') ||
      email.endsWith('@dharvikagrains.in');

    if (isOwnerEmail) {
      assignedRole = 'OWNER';
    } else if (isAdminTarget) {
      assignedRole = 'ADMIN';
    } else if (isInvestorTarget) {
      assignedRole = 'INVESTOR';
    }

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
    } catch (e) {
      console.warn('[SYNC_SESSION] Database update notice:', e);
    }

    const sessionToken = signSession({
      userId: user.id,
      email,
      mobile: phone,
      fullName,
      role: assignedRole,
    });

    const response = NextResponse.json({
      success: true,
      role: assignedRole,
      user: { id: user.id, email, fullName },
    });

    response.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 72 * 60 * 60, // 3 days
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Session synchronization failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
