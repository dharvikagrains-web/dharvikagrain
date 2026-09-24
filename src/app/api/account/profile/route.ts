import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedProfile } from '@/lib/auth/session';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const profile = await getAuthenticatedProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        avatarUrl: profile.avatarUrl,
        role: profile.role,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (err) {
    console.error('API profile GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const profile = await getAuthenticatedProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, email, mobile, phone, avatarUrl, role: targetRole } = body;

    // Defense-in-depth: Prevent role escalation by Customers or unauthorized roles
    if (targetRole && targetRole !== profile.role && profile.role === 'CUSTOMER') {
      return NextResponse.json(
        { error: 'Forbidden: Customers cannot change their own role or escalate privileges' },
        { status: 403 }
      );
    }

    const cleanPhone = phone || mobile;
    const updateResult = db.updateProfile(
      profile.id,
      {
        fullName,
        email,
        phone: cleanPhone,
        avatarUrl,
        ...(profile.role === 'OWNER' && targetRole ? { role: targetRole } : {}),
      },
      { id: profile.id, role: profile.role }
    );

    if (!updateResult.success || !updateResult.profile) {
      return NextResponse.json({ error: updateResult.error || 'Failed to update profile' }, { status: 400 });
    }

    db.addAuditLog(
      profile.email,
      profile.role,
      'PROFILE_UPDATED',
      'USER',
      profile.id,
      `User ${profile.fullName} updated profile details.`
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: updateResult.profile,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

