import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp, signSession, AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, code, fullName, email: providedEmail, mobile: providedMobile } = body;

    if (!identifier || !code) {
      return NextResponse.json(
        { success: false, error: 'Identifier and 6-digit OTP code are required.' },
        { status: 400 }
      );
    }

    // Verify OTP against cryptographic store
    const verifyResult = await verifyOtp(identifier, code);
    if (!verifyResult.success) {
      return NextResponse.json(
        { success: false, error: verifyResult.message },
        { status: 401 }
      );
    }

    // Determine user fields
    const isEmail = identifier.includes('@');
    const email = isEmail ? identifier.toLowerCase() : providedEmail?.toLowerCase() || `${identifier}@customer.dharvika.in`;
    const mobile = isEmail ? providedMobile || '' : identifier.replace(/\D/g, '').slice(-10);
    const name = fullName?.trim() || (isEmail ? email.split('@')[0] : `Customer ${mobile.slice(-4)}`);

    // Look up or register user
    const user = db.upsertUser({
      fullName: name,
      email,
      mobile,
    });

    // Create signed session token
    const token = signSession({
      userId: user.id,
      email: user.email,
      mobile: user.mobile,
      fullName: user.fullName,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });

    // Set HTTP-only secure cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 72 * 60 * 60, // 3 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Internal error verifying OTP.' },
      { status: 500 }
    );
  }
}
