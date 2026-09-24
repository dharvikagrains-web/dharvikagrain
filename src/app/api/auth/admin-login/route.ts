import { NextRequest, NextResponse } from 'next/server';
import { signSession, AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';

const ADMIN_PASSCODES = [
  'DharvikaAdmin2026!',
  process.env.ADMIN_PASSWORD,
  process.env.ADMIN_MASTER_KEY,
].filter(Boolean);

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
    let isAuthorized = false;
    let fullName = 'Dharvika Administrator';
    let assignedRole: 'ADMIN' | 'SUPER_ADMIN' | 'OWNER' = 'ADMIN';

    // 1. Check known master admin passcodes
    const isMasterPassword = ADMIN_PASSCODES.includes(password);
    const isAdminEmail =
      cleanEmail === 'dharvikagrains@gmail.com' ||
      cleanEmail.includes('admin') ||
      cleanEmail.endsWith('@dharvikagrains.in') ||
      cleanEmail.endsWith('@dharvika.in');

    if (isMasterPassword && isAdminEmail) {
      isAuthorized = true;
      if (cleanEmail === 'dharvikagrains@gmail.com') {
        fullName = 'Executive Operations Admin';
        assignedRole = 'OWNER';
      }
    }

    // 2. Check Supabase Auth if not already matched
    if (!isAuthorized) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zwcrqycvxyzmhizvbqpp.supabase.co';
        const supabaseKey =
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
          'sb_publishable_2O_ae3k1rQ6FSlnTG4RA7g_5nnFnG5c';
        
        const cleanUrl = (supabaseUrl || '').replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
        const supabase = createClient(cleanUrl, supabaseKey);

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!authError && authData.user) {
          const userRole = authData.user.user_metadata?.role || 'ADMIN';
          if (['ADMIN', 'SUPER_ADMIN', 'OWNER', 'OPERATIONS'].includes(userRole)) {
            isAuthorized = true;
            fullName = authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'Administrator';
            assignedRole = userRole as 'ADMIN' | 'SUPER_ADMIN' | 'OWNER';
          }
        }
      } catch {
        // Continue to check authorization state
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Invalid administrator credentials. Access restricted.' },
        { status: 401 }
      );
    }

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
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Internal server error during administrator authentication.' },
      { status: 500 }
    );
  }
}
