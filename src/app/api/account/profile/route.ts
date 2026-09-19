import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, email, mobile } = body;

    const emailChanged = email && email.toLowerCase() !== user.email.toLowerCase();
    const mobileChanged = mobile && mobile.replace(/\D/g, '') !== user.mobile.replace(/\D/g, '');

    const updatedUser = db.upsertUser({
      fullName: fullName || user.fullName,
      email: emailChanged ? email.toLowerCase() : user.email,
      mobile: mobileChanged ? mobile : user.mobile,
    });

    db.addAuditLog(
      user.email,
      user.role,
      'PROFILE_UPDATED',
      'USER',
      user.id,
      `User updated profile details. Email changed: ${emailChanged}, Mobile changed: ${mobileChanged}`
    );

    return NextResponse.json({
      success: true,
      requiresReverification: emailChanged || mobileChanged,
      message:
        emailChanged || mobileChanged
          ? 'Contact information updated. Please verify your new credentials on next sign in.'
          : 'Profile updated successfully.',
      profile: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
