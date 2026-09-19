import { NextRequest, NextResponse } from 'next/server';
import { requestOtp } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier } = body;

    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Mobile number or email address is required.' },
        { status: 400 }
      );
    }

    const trimmed = identifier.trim();
    const isPhone = /^[6-9]\d{9}$/.test(trimmed.replace(/\D/g, '').slice(-10));
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    if (!isPhone && !isEmail) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid 10-digit Indian mobile number or email.' },
        { status: 400 }
      );
    }

    const result = requestOtp(trimmed);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message, cooldownRemaining: result.cooldownRemaining },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Internal error sending verification code.' },
      { status: 500 }
    );
  }
}
