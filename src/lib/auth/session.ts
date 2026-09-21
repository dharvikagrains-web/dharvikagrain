import { cookies } from 'next/headers';
import crypto from 'crypto';
import { db, UserRole, User, prisma, hasDatabaseUrl } from '@/lib/db';
import { sendOtpViaMsg91 } from '@/lib/sms/msg91';
import { sendOtpViaResend } from '@/lib/email/resend';

const AUTH_COOKIE_NAME = 'dharvika_session';
const AUTH_SECRET = process.env.AUTH_SECRET || 'dharvika_luxury_grains_super_secret_key_2026';

// Security policies
export const OTP_EXPIRY_MS = 5 * 60 * 1000;       // 5 minutes
export const OTP_COOLDOWN_MS = 60 * 1000;         // 60 seconds resend cooldown
export const MAX_VERIFY_ATTEMPTS = 5;             // Maximum 5 verification attempts
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes rolling window
export const MAX_REQUESTS_PER_WINDOW = 5;         // Max 5 OTP requests per 10 minutes

export interface SessionPayload {
  userId: string;
  email: string;
  mobile: string;
  fullName: string;
  role: UserRole;
  exp: number; // Unix timestamp ms
}

/**
 * Hashed OTP stored record — Plaintext OTP is NEVER stored
 */
export interface StoredOtpHashed {
  hashedCode: string;
  identifier: string; // phone or email
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
  lastRequestedAt: number;
}

// In-memory OTP storage for zero-latency lookups
const globalForOtp = global as unknown as {
  otpCache?: Map<string, StoredOtpHashed>;
  rateLimitCache?: Map<string, number[]>;
};

const otpCache = globalForOtp.otpCache || new Map<string, StoredOtpHashed>();
const rateLimitCache = globalForOtp.rateLimitCache || new Map<string, number[]>();

if (process.env.NODE_ENV !== 'production') {
  globalForOtp.otpCache = otpCache;
  globalForOtp.rateLimitCache = rateLimitCache;
}

/**
 * Creates an HMAC-SHA256 hash of the OTP salted by server AUTH_SECRET
 */
export function hashOtp(identifier: string, code: string): string {
  return crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(`${identifier.trim().toLowerCase()}:${code.trim()}`)
    .digest('hex');
}

/**
 * Constant-time comparison between entered OTP and stored cryptographic hash
 */
export function verifyOtpHash(identifier: string, code: string, storedHash: string): boolean {
  try {
    const calculatedHash = hashOtp(identifier, code);
    const bufCalculated = Buffer.from(calculatedHash, 'utf8');
    const bufStored = Buffer.from(storedHash, 'utf8');

    if (bufCalculated.length !== bufStored.length) {
      return false;
    }

    return crypto.timingSafeEqual(bufCalculated, bufStored);
  } catch {
    return false;
  }
}

/**
 * Server-side rate limiter for OTP requests
 */
function checkServerRateLimit(identifier: string): { allowed: boolean; remainingRequests: number; retryAfterSec?: number } {
  const now = Date.now();
  const timestamps = rateLimitCache.get(identifier) || [];
  
  // Filter timestamps within the rolling window
  const activeTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = activeTimestamps[0];
    const retryAfterSec = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldest)) / 1000);
    return {
      allowed: false,
      remainingRequests: 0,
      retryAfterSec,
    };
  }

  activeTimestamps.push(now);
  rateLimitCache.set(identifier, activeTimestamps);

  return {
    allowed: true,
    remainingRequests: MAX_REQUESTS_PER_WINDOW - activeTimestamps.length,
  };
}

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
export async function requireAuth(
  allowedRoles?: UserRole[]
): Promise<{ user: User } | { error: string; status: number }> {
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
 * Generate, cryptographically hash, and dispatch a secure OTP via MSG91 (phone) or Resend (email)
 */
export async function requestOtp(
  identifier: string
): Promise<{ success: boolean; message: string; cooldownRemaining?: number }> {
  const cleanId = identifier.trim().toLowerCase();
  const now = Date.now();

  // 1. Enforce 60-second resend cooldown
  const existing = otpCache.get(cleanId);
  if (existing && now - existing.lastRequestedAt < OTP_COOLDOWN_MS) {
    const remainingSec = Math.ceil((OTP_COOLDOWN_MS - (now - existing.lastRequestedAt)) / 1000);
    return {
      success: false,
      message: `Please wait ${remainingSec}s before requesting a new verification code.`,
      cooldownRemaining: remainingSec,
    };
  }

  // 2. Enforce rolling window rate limit (Max 5 requests per 10 mins)
  const rateLimit = checkServerRateLimit(cleanId);
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Rate limit reached. Please wait ${rateLimit.retryAfterSec}s before requesting again.`,
      cooldownRemaining: rateLimit.retryAfterSec,
    };
  }

  // 3. Generate 6-digit cryptographic OTP
  // For sandbox test identities in dev mode, provide predictable sandbox OTP
  const isTestAccount =
    cleanId.includes('pavangeesala81@gmail.com') ||
    cleanId.includes('9876543210') ||
    cleanId.includes('pavan@example.com');

  let rawCode = '';
  if (process.env.NODE_ENV !== 'production' && isTestAccount) {
    rawCode = '123456';
  } else {
    rawCode = crypto.randomInt(100000, 999999).toString();
  }

  // 4. Store ONLY the HMAC-SHA256 hash — plaintext is never persisted
  const hashedCode = hashOtp(cleanId, rawCode);

  otpCache.set(cleanId, {
    hashedCode,
    identifier: cleanId,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0,
    maxAttempts: MAX_VERIFY_ATTEMPTS,
    lastRequestedAt: now,
  });

  // Also persist to PostgreSQL if connected
  if (hasDatabaseUrl && prisma) {
    try {
      await prisma.otpVerification.upsert({
        where: { identifier: cleanId },
        update: {
          hashedCode,
          expiresAt: new Date(now + OTP_EXPIRY_MS),
          attempts: 0,
          maxAttempts: MAX_VERIFY_ATTEMPTS,
          lastRequestedAt: new Date(now),
        },
        create: {
          identifier: cleanId,
          hashedCode,
          expiresAt: new Date(now + OTP_EXPIRY_MS),
          attempts: 0,
          maxAttempts: MAX_VERIFY_ATTEMPTS,
          lastRequestedAt: new Date(now),
        },
      });
    } catch (e) {
      console.warn('[DHARVIKA OTP] Database persistence warning:', e);
    }
  }

  // 5. Dispatch code via provider based on identifier type
  const isEmail = cleanId.includes('@');
  let dispatchResult: { success: boolean; message: string; error?: string };

  if (isEmail) {
    // Deliver via Resend
    dispatchResult = await sendOtpViaResend({
      email: cleanId,
      otp: rawCode,
    });
  } else {
    // Deliver via MSG91
    dispatchResult = await sendOtpViaMsg91({
      mobile: cleanId,
      otp: rawCode,
    });
  }

  if (!dispatchResult.success) {
    // Invalidate cached OTP if dispatch failed completely
    otpCache.delete(cleanId);
    return {
      success: false,
      message: dispatchResult.message || 'Failed to dispatch verification code. Please check your credentials.',
    };
  }

  return {
    success: true,
    message: isEmail
      ? 'Verification code dispatched to your email address.'
      : 'Verification code dispatched via SMS.',
  };
}

/**
 * Verify OTP against cryptographic hash with 5-attempt limit and 5-minute expiration
 */
export async function verifyOtp(
  identifier: string,
  code: string
): Promise<{ success: boolean; message: string }> {
  const cleanId = identifier.trim().toLowerCase();
  let entry = otpCache.get(cleanId);

  // If not found in memory but database is configured, load from PostgreSQL
  if (!entry && hasDatabaseUrl && prisma) {
    try {
      const dbEntry = await prisma.otpVerification.findUnique({
        where: { identifier: cleanId },
      });
      if (dbEntry) {
        entry = {
          hashedCode: dbEntry.hashedCode,
          identifier: dbEntry.identifier,
          expiresAt: dbEntry.expiresAt.getTime(),
          attempts: dbEntry.attempts,
          maxAttempts: dbEntry.maxAttempts,
          lastRequestedAt: dbEntry.lastRequestedAt.getTime(),
        };
        otpCache.set(cleanId, entry);
      }
    } catch {}
  }

  if (!entry) {
    return {
      success: false,
      message: 'No active verification code found. Please request a new code.',
    };
  }

  // Check 5-minute expiration
  if (Date.now() > entry.expiresAt) {
    otpCache.delete(cleanId);
    if (hasDatabaseUrl && prisma) {
      prisma.otpVerification.delete({ where: { identifier: cleanId } }).catch(() => {});
    }
    return {
      success: false,
      message: 'Verification code has expired. Please request a new code.',
    };
  }

  // Check maximum verification attempts (5)
  if (entry.attempts >= entry.maxAttempts) {
    otpCache.delete(cleanId);
    if (hasDatabaseUrl && prisma) {
      prisma.otpVerification.delete({ where: { identifier: cleanId } }).catch(() => {});
    }
    return {
      success: false,
      message: 'Maximum verification attempts (5) exceeded. For security, please request a fresh code.',
    };
  }

  // Constant-time HMAC hash verification
  const isValid = verifyOtpHash(cleanId, code, entry.hashedCode);

  if (!isValid) {
    entry.attempts += 1;
    const remaining = entry.maxAttempts - entry.attempts;

    if (hasDatabaseUrl && prisma) {
      prisma.otpVerification
        .update({
          where: { identifier: cleanId },
          data: { attempts: entry.attempts },
        })
        .catch(() => {});
    }

    if (remaining <= 0) {
      otpCache.delete(cleanId);
      if (hasDatabaseUrl && prisma) {
        prisma.otpVerification.delete({ where: { identifier: cleanId } }).catch(() => {});
      }
      return {
        success: false,
        message: 'Maximum verification attempts (5) exceeded. Please request a fresh code.',
      };
    }

    return {
      success: false,
      message: `Incorrect verification code. ${remaining} attempt(s) remaining.`,
    };
  }

  // OTP verified! Invalidate immediately to prevent replay attacks
  otpCache.delete(cleanId);
  if (hasDatabaseUrl && prisma) {
    prisma.otpVerification.delete({ where: { identifier: cleanId } }).catch(() => {});
  }

  return {
    success: true,
    message: 'Verification successful.',
  };
}

export { AUTH_COOKIE_NAME };
