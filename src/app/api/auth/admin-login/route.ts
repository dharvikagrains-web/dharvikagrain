import { NextRequest, NextResponse } from 'next/server';
import { signSession, AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';

import crypto from 'crypto';

// Server-side in-memory rate limiting for admin login attempts: max 5 failed attempts per 15 minutes
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry) return true;
  if (now > entry.resetAt) {
    loginAttempts.delete(key);
    return true;
  }
  return entry.count < 5;
}

function recordFailedAttempt(key: string) {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
  } else {
    entry.count += 1;
  }
}

function clearRateLimit(key: string) {
  loginAttempts.delete(key);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and administrator master passcode are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const rateLimitKey = `${cleanEmail}:${clientIp}`;

    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { success: false, error: 'Too many failed login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    let isAuthorized = false;
    let fullName = 'Dharvika Administrator';
    let assignedRole: 'ADMIN' | 'SUPER_ADMIN' | 'OWNER' = 'ADMIN';

    // 1. Check server-configured environment admin passcodes (strictly against configured admin/owner emails)
    const configuredAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const configuredOwnerEmail = (process.env.OWNER_EMAIL || '').trim().toLowerCase();
    const configuredAdminPass = process.env.ADMIN_PASSWORD?.trim();
    const configuredMasterKey = process.env.ADMIN_MASTER_KEY?.trim();

    const isConfiguredEmail =
      Boolean(configuredAdminEmail && cleanEmail === configuredAdminEmail) ||
      Boolean(configuredOwnerEmail && cleanEmail === configuredOwnerEmail);

    if (isConfiguredEmail) {
      const validPasscodes = [configuredAdminPass, configuredMasterKey].filter(
        (p): p is string => Boolean(p && p.length >= 8 && !p.includes('placeholder'))
      );

      for (const pass of validPasscodes) {
        try {
          const passBuf = Buffer.from(password, 'utf8');
          const expectedBuf = Buffer.from(pass, 'utf8');
          if (passBuf.length === expectedBuf.length && crypto.timingSafeEqual(passBuf, expectedBuf)) {
            isAuthorized = true;
            assignedRole = (configuredOwnerEmail && cleanEmail === configuredOwnerEmail) ? 'OWNER' : 'ADMIN';
            fullName = assignedRole === 'OWNER' ? 'Executive Operations Admin' : 'Store Administrator';
            break;
          }
        } catch {}
      }
    }

    // 2. Check Supabase Auth if not already matched
    if (!isAuthorized) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey =
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

        if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
          const cleanUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
          const supabase = createClient(cleanUrl, supabaseKey);

          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

          if (!authError && authData.user) {
            const userRole = (authData.user.user_metadata?.role as string) || '';
            if (['ADMIN', 'SUPER_ADMIN', 'OWNER', 'OPERATIONS'].includes(userRole) || isConfiguredEmail) {
              isAuthorized = true;
              fullName = authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'Administrator';
              assignedRole = (['ADMIN', 'SUPER_ADMIN', 'OWNER'].includes(userRole) ? userRole : 'ADMIN') as 'ADMIN' | 'SUPER_ADMIN' | 'OWNER';
            }
          }
        }
      } catch {}
    }

    if (!isAuthorized) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, error: 'Invalid administrator credentials. Access restricted.' },
        { status: 401 }
      );
    }

    clearRateLimit(rateLimitKey);

    // Upsert admin in local store
    const user = db.upsertUser({
      fullName,
      email: cleanEmail,
      mobile: '9876543210',
    });
    user.role = assignedRole;

    // Issue signed session token
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

    // Set secure HTTP cookie
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
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error during administrator authentication.' },
      { status: 500 }
    );
  }
}
