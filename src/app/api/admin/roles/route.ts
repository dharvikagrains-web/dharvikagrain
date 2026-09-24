import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedProfile } from '@/lib/auth/session';
import { db } from '@/lib/db';

/**
 * GET /api/admin/roles
 * Administrative operation: List user profiles and their assigned roles.
 * Allowed: ADMIN, OWNER.
 * Denied: CUSTOMER.
 */
export async function GET() {
  try {
    const caller = await getAuthenticatedProfile();
    if (!caller) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    if (caller.role !== 'ADMIN' && caller.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient privileges. Admin or Owner role required.' },
        { status: 403 }
      );
    }

    const profiles = db.getAllProfiles();
    return NextResponse.json({
      success: true,
      profiles: profiles.map((p) => ({
        id: p.id,
        fullName: p.fullName,
        email: p.email,
        phone: p.phone,
        role: p.role,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/roles
 * Administrative role management: Assign or modify roles (CUSTOMER, ADMIN, OWNER).
 * Allowed: OWNER ONLY.
 * Denied: ADMIN, CUSTOMER.
 */
export async function PUT(req: NextRequest) {
  try {
    const caller = await getAuthenticatedProfile();
    if (!caller) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    // Role-based authorization: Only OWNER can manage roles and configurations
    if (caller.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Forbidden: Only an OWNER can manage administrative roles and configuration.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { targetUserId, newRole } = body;

    if (!targetUserId || !newRole) {
      return NextResponse.json(
        { error: 'Bad request: targetUserId and newRole are required.' },
        { status: 400 }
      );
    }

    if (!['CUSTOMER', 'ADMIN', 'OWNER'].includes(newRole)) {
      return NextResponse.json(
        { error: 'Invalid role. Valid roles are: CUSTOMER, ADMIN, OWNER.' },
        { status: 400 }
      );
    }

    const result = db.updateProfile(
      targetUserId,
      { role: newRole as 'CUSTOMER' | 'ADMIN' | 'OWNER' },
      { id: caller.id, role: caller.role }
    );

    if (!result.success || !result.profile) {
      return NextResponse.json(
        { error: result.error || 'Failed to update user role.' },
        { status: 400 }
      );
    }

    db.addAuditLog(
      caller.email,
      caller.role,
      'ROLE_MANAGED',
      'USER_PROFILE',
      targetUserId,
      `Owner ${caller.email} changed role of user ${targetUserId} to ${newRole}`
    );

    return NextResponse.json({
      success: true,
      message: `User role successfully updated to ${newRole}.`,
      profile: result.profile,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update user role.' }, { status: 500 });
  }
}
