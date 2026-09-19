import { cookies } from 'next/headers';
import crypto from 'crypto';
import { db, UserRole, User } from '@/lib/db';

const AUTH_COOKIE_NAME = 'dharvika_session';
const AUTH_SECRET = process.env.AUTH_SECRET || 'dharvika_luxury_grains_super_secret_key_2026';
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const OTP_RATE_LIMIT_MS = 60 * 1000; // 60 seconds cooldown

export interface SessionPayload {
  userId: string;
  email: string;
  mobile: string;
  fullName: string;
  role: UserRole;
  exp: number; // Unix timestamp ms
}

interface StoredOtp {
  code: string;
  identifier: string; // phone or email
  expiresAt: number;
  attempts: number;
  lastRequestedAt: number;
}

// In-memory OTP storage with rate limiting
const globalForOtp = global as unknown as { otpCache?: Map<string, StoredOtp> };
const otpCache = globalForOtp.otpCache || new Map<string, StoredOtp>();
if (process.env.NODE_ENV !== 'production') globalForOtp.otpCache = otpCache;

/**
 * Sign session payload using HMAC-SHA256
 */
export function signSession(payload: Omit<SessionPayload, 'exp'>, expiresInHours = 72): string {
  const exp = Date.now() + expiresInHours * 60 * 60 * 1000;
  const data: SessionPayload = { ...payload, exp };
  const json = JSON.stringify(data);
  const base64Data = Buffer.from(json).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(base64Data)
    .digest('base64url');

  return `${base64Data}.${signature}`;
}

/**
 * Verify and decode session token
 */
export function verifySession(token: string): SessionPayload | null {
  try {
    const [base64Data, signature] = token.split('.');
    if (!base64Data || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(base64Data)
      .digest('base64url');

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature, 'utf8'),
        Buffer.from(expectedSignature, 'utf8')
      )
    ) {
      return null;
    }

    const json = Buffer.from(base64Data, 'base64url').toString('utf8');
    const payload: SessionPayload = JSON.parse(json);

    // Check expiration
    if (payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Get current authenticated user from Next.js cookies
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifySession(token);
    if (!payload) return null;

    const user = db.getUserById(payload.userId) || db.getUserByEmail(payload.email);
    return user || null;
  } catch {
    return null;
  }
}

/**
 * Require authenticated user with given roles, or return 401/403 response
 */
export async function requireAuth(allowedRoles?: UserRole[]): Promise<{ user: User } | { error: string; status: number }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Authentication required. Please sign in.', status: 401 };
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return { error: 'Forbidden: Insufficient privileges.', status: 403 };
    }
  }

  return { user };
}

/**
 * Generate and cache a secure OTP for mobile or email
 */
export function requestOtp(identifier: string): { success: boolean; message: string; cooldownRemaining?: number } {
  const cleanId = identifier.trim().toLowerCase();
  const existing = otpCache.get(cleanId);
  const now = Date.now();

  // Enforce 60-second rate-limit cooldown
  if (existing && now - existing.lastRequestedAt < OTP_RATE_LIMIT_MS) {
    const remainingSec = Math.ceil((OTP_RATE_LIMIT_MS - (now - existing.lastRequestedAt)) / 1000);
    return {
      success: false,
      message: `Please wait ${remainingSec}s before requesting a new verification code.`,
      cooldownRemaining: remainingSec,
    };
  }

  // Generate 6-digit cryptographic OTP
  // For test customer 'pavangeesala81@gmail.com' or test mobile '9876543210' in dev mode, provide predictable sandbox OTP
  const isTestAccount =
    cleanId.includes('pavangeesala81@gmail.com') ||
    cleanId.includes('9876543210') ||
    cleanId.includes('pavan@example.com');

  let code = '';
  if (process.env.NODE_ENV !== 'production' && isTestAccount) {
    code = '123456';
  } else {
    code = crypto.randomInt(100000, 999999).toString();
  }

  otpCache.set(cleanId, {
    code,
    identifier: cleanId,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0,
    lastRequestedAt: now,
  });

  // Never expose OTP in production logs. In non-production, log to server console for testing convenience.
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DHARVIKA AUTH OTP] Code for ${cleanId}: ${code}`);
  }

  return { success: true, message: 'Verification code dispatched successfully.' };
}

/**
 * Verify OTP with attempt limits and expiration
 */
export function verifyOtp(identifier: string, code: string): { success: boolean; message: string } {
  const cleanId = identifier.trim().toLowerCase();
  const entry = otpCache.get(cleanId);

  if (!entry) {
    return { success: false, message: 'No active OTP request found. Please request a new code.' };
  }

  if (Date.now() > entry.expiresAt) {
    otpCache.delete(cleanId);
    return { success: false, message: 'Verification code has expired. Please request a new code.' };
  }

  if (entry.attempts >= 3) {
    otpCache.delete(cleanId);
    return {
      success: false,
      message: 'Too many incorrect attempts. For security, please request a fresh code.',
    };
  }

  if (entry.code !== code.trim()) {
    entry.attempts += 1;
    return {
      success: false,
      message: `Incorrect verification code. ${3 - entry.attempts} attempt(s) remaining.`,
    };
  }

  // OTP verified! Invalidate immediately
  otpCache.delete(cleanId);
  return { success: true, message: 'Verification successful.' };
}

export { AUTH_COOKIE_NAME };
