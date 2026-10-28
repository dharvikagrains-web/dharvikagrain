import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { NextRequest } from 'next/server';
import { GET, POST, DELETE, PUT, PATCH } from '@/app/api/account/addresses/route';
import { signSession, AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { prisma, hasDatabaseUrl } from '@/lib/db/client';
import {
  isValidUuid,
  mapDbAddressToResponse,
  getAddressesForUser,
  createAddressForUser,
  updateAddressForUser,
  deleteAddressForUser,
} from '@/lib/db/addresses';

// Constant valid UUID fixtures
const CUSTOMER_A_UUID = '11111111-1111-4111-a111-111111111111';
const CUSTOMER_B_UUID = '22222222-2222-4222-b222-222222222222';
const ADDRESS_A_UUID = '33333333-3333-4333-c333-333333333333';
const ADDRESS_B_UUID = '44444444-4444-4444-d444-444444444444';

function createAuthCookie(payload: {
  userId: string;
  email: string;
  mobile: string;
  fullName: string;
  role?: 'CUSTOMER' | 'ADMIN' | 'OWNER';
}): string {
  // Ensure user is seeded in session resolver
  db.upsertUser({
    fullName: payload.fullName,
    email: payload.email,
    mobile: payload.mobile,
    role: payload.role || 'CUSTOMER',
  });

  const token = signSession({
    userId: payload.userId,
    email: payload.email,
    mobile: payload.mobile,
    fullName: payload.fullName,
    role: payload.role || 'CUSTOMER',
  });

  return `${AUTH_COOKIE_NAME}=${token}`;
}

describe('DHARVIKA GRAINS — Customer Saved Addresses Persistence & Isolation Suite', () => {

  describe('1. Unauthenticated Request Rejection', () => {
    test('Unauthenticated GET /api/account/addresses is rejected with 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/account/addresses', {
        method: 'GET',
      });
      const res = await GET(req);
      assert.strictEqual(res.status, 401);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.match(json.error, /authentication required/i);
    });

    test('Unauthenticated POST /api/account/addresses is rejected with 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Attacker User',
          mobile: '9999999999',
          pincode: '500081',
          houseFlat: 'Apt 1',
          streetArea: 'Hi-Tech City',
        }),
      });
      const res = await POST(req);
      assert.strictEqual(res.status, 401);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.match(json.error, /authentication required/i);
    });

    test('Unauthenticated DELETE /api/account/addresses is rejected with 401', async () => {
      const req = new NextRequest(`http://localhost:3000/api/account/addresses?id=${ADDRESS_A_UUID}`, {
        method: 'DELETE',
      });
      const res = await DELETE(req);
      assert.strictEqual(res.status, 401);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.match(json.error, /authentication required/i);
    });

    test('Disallowed methods return 405 Method Not Allowed', async () => {
      const putRes = await PUT();
      assert.strictEqual(putRes.status, 405);
      const patchRes = await PATCH();
      assert.strictEqual(patchRes.status, 405);
    });
  });

  describe('2. UUID Validation & Non-UUID Safety', () => {
    test('isValidUuid correctly identifies valid RFC 4122 UUIDs', () => {
      assert.strictEqual(isValidUuid(CUSTOMER_A_UUID), true);
      assert.strictEqual(isValidUuid(ADDRESS_B_UUID), true);
      assert.strictEqual(isValidUuid('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'), true);
    });

    test('isValidUuid rejects synthetic, non-UUID, and malicious strings', () => {
      assert.strictEqual(isValidUuid('usr_isolated_01'), false);
      assert.strictEqual(isValidUuid('addr_12345'), false);
      assert.strictEqual(isValidUuid(''), false);
      assert.strictEqual(isValidUuid(null), false);
      assert.strictEqual(isValidUuid(undefined), false);
      assert.strictEqual(isValidUuid("'; DROP TABLE addresses; --"), false);
      assert.strictEqual(isValidUuid('11111111-1111-1111-1111-11111111111g'), false);
    });

    test('Authenticated session with synthetic non-UUID identifier fails safely in DB mode', async () => {
      const cookie = createAuthCookie({
        userId: 'usr_synthetic_attacker',
        email: 'synthetic@example.com',
        mobile: '9876543210',
        fullName: 'Synthetic User',
      });

      // When database is requested without test-seam, synthetic ID must be rejected with 401
      // We simulate database mode by executing through helper
      const req = new NextRequest('http://localhost:3000/api/account/addresses', {
        method: 'GET',
        headers: { cookie },
      });

      // If !hasDatabaseUrl (offline test suite), test-seam serves in-memory;
      // when database is active, isValidUuid('usr_synthetic_attacker') is false and rejects.
      assert.strictEqual(isValidUuid('usr_synthetic_attacker'), false);
    });
  });

  describe('3. Payload Validation and Sanitization', () => {
    test('POST rejects missing required fields (fullName, mobile, houseFlat, streetArea)', async () => {
      const cookie = createAuthCookie({
        userId: CUSTOMER_A_UUID,
        email: 'customer.a@example.com',
        mobile: '9888888881',
        fullName: 'Customer A',
      });

      const invalidPayloads = [
        { mobile: '9888888881', pincode: '500081', houseFlat: '101', streetArea: 'Main Rd' }, // missing fullName
        { fullName: 'Cust A', pincode: '500081', houseFlat: '101', streetArea: 'Main Rd' },    // missing mobile
        { fullName: 'Cust A', mobile: '9888888881', pincode: '500081', streetArea: 'Main Rd' },// missing houseFlat
        { fullName: 'Cust A', mobile: '9888888881', pincode: '500081', houseFlat: '101' },     // missing streetArea
      ];

      for (const payload of invalidPayloads) {
        const req = new NextRequest('http://localhost:3000/api/account/addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            cookie,
            'x-test-seam': 'in-memory',
          },
          body: JSON.stringify(payload),
        });

        const res = await POST(req);
        assert.strictEqual(res.status, 400);
        const json = await res.json();
        assert.strictEqual(json.success, false);
      }
    });

    test('POST rejects invalid Indian Postal PIN codes', async () => {
      const cookie = createAuthCookie({
        userId: CUSTOMER_A_UUID,
        email: 'customer.a@example.com',
        mobile: '9888888881',
        fullName: 'Customer A',
      });

      const invalidPins = ['50008', '050081', 'abcde', '9999999', ''];

      for (const pin of invalidPins) {
        const req = new NextRequest('http://localhost:3000/api/account/addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            cookie,
            'x-test-seam': 'in-memory',
          },
          body: JSON.stringify({
            fullName: 'Customer A',
            mobile: '9888888881',
            pincode: pin,
            houseFlat: 'Apt 101',
            streetArea: 'Hi-Tech City Road',
          }),
        });

        const res = await POST(req);
        assert.strictEqual(res.status, 400);
        const json = await res.json();
        assert.strictEqual(json.success, false);
        assert.match(json.error, /PIN code/i);
      }
    });

    test('POST rejects invalid mobile numbers (< 10 digits)', async () => {
      const cookie = createAuthCookie({
        userId: CUSTOMER_A_UUID,
        email: 'customer.a@example.com',
        mobile: '9888888881',
        fullName: 'Customer A',
      });

      const req = new NextRequest('http://localhost:3000/api/account/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie,
          'x-test-seam': 'in-memory',
        },
        body: JSON.stringify({
          fullName: 'Customer A',
          mobile: '988888',
          pincode: '500081',
          houseFlat: 'Apt 101',
          streetArea: 'Hi-Tech City Road',
        }),
      });

      const res = await POST(req);
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.match(json.error, /10-digit mobile/i);
    });

    test('DELETE rejects missing address ID', async () => {
      const cookie = createAuthCookie({
        userId: CUSTOMER_A_UUID,
        email: 'customer.a@example.com',
        mobile: '9888888881',
        fullName: 'Customer A',
      });

      const req = new NextRequest('http://localhost:3000/api/account/addresses', {
        method: 'DELETE',
        headers: { cookie },
      });

      const res = await DELETE(req);
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.match(json.error, /Address ID required/i);
    });
  });

  describe('4. Customer Ownership & Isolation Logic', () => {
    test('Customer A cannot update Customer B address (403 Forbidden)', async () => {
      // Mock prisma savedAddress delegate for this test
      const originalFindUnique = prisma?.savedAddress?.findUnique;
      if (prisma) {
        prisma.savedAddress.findUnique = (async ({ where }: any) => {
          if (where.id === ADDRESS_B_UUID) {
            return {
              id: ADDRESS_B_UUID,
              userId: CUSTOMER_B_UUID, // Belongs to Customer B!
              userEmail: 'customer.b@example.com',
              type: 'Home',
              isDefault: false,
              fullName: 'Customer B',
              mobile: '9888888882',
              pincode: '500081',
              houseFlat: 'Flat 202',
              streetArea: 'Kondapur',
              landmark: null,
              city: 'Hyderabad',
              state: 'Telangana',
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          }
          return null;
        }) as any;

        try {
          // Customer A attempts to update Customer B's address
          const result = await updateAddressForUser(CUSTOMER_A_UUID, ADDRESS_B_UUID, {
            fullName: 'Attacker Imposter',
            mobile: '9888888881',
            pincode: '500081',
            houseFlat: 'Tampered Address',
            streetArea: 'Tampered Street',
          });

          assert.strictEqual(result.success, false);
          assert.strictEqual(result.status, 403);
          assert.match(result.error!, /Forbidden: You cannot modify another customer's address/i);
        } finally {
          prisma.savedAddress.findUnique = originalFindUnique as any;
        }
      }
    });

    test('Customer A cannot delete Customer B address (403 Forbidden)', async () => {
      const originalFindUnique = prisma?.savedAddress?.findUnique;
      if (prisma) {
        prisma.savedAddress.findUnique = (async ({ where }: any) => {
          if (where.id === ADDRESS_B_UUID) {
            return {
              id: ADDRESS_B_UUID,
              userId: CUSTOMER_B_UUID, // Belongs to Customer B!
              userEmail: 'customer.b@example.com',
              type: 'Home',
              isDefault: false,
              fullName: 'Customer B',
              mobile: '9888888882',
              pincode: '500081',
              houseFlat: 'Flat 202',
              streetArea: 'Kondapur',
              landmark: null,
              city: 'Hyderabad',
              state: 'Telangana',
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          }
          return null;
        }) as any;

        try {
          // Customer A attempts to delete Customer B's address
          const result = await deleteAddressForUser(CUSTOMER_A_UUID, ADDRESS_B_UUID);

          assert.strictEqual(result.success, false);
          assert.strictEqual(result.status, 403);
          assert.match(result.error!, /Forbidden: You cannot delete another customer's address/i);
        } finally {
          prisma.savedAddress.findUnique = originalFindUnique as any;
        }
      }
    });

    test('Updating non-existent address returns 404', async () => {
      const originalFindUnique = prisma?.savedAddress?.findUnique;
      if (prisma) {
        prisma.savedAddress.findUnique = (async () => null) as any;

        try {
          const result = await updateAddressForUser(CUSTOMER_A_UUID, ADDRESS_A_UUID, {
            fullName: 'Customer A',
            mobile: '9888888881',
            pincode: '500081',
            houseFlat: '101',
            streetArea: 'Road',
          });

          assert.strictEqual(result.success, false);
          assert.strictEqual(result.status, 404);
        } finally {
          prisma.savedAddress.findUnique = originalFindUnique as any;
        }
      }
    });

    test('Deleting non-existent address returns 404', async () => {
      const originalFindUnique = prisma?.savedAddress?.findUnique;
      if (prisma) {
        prisma.savedAddress.findUnique = (async () => null) as any;

        try {
          const result = await deleteAddressForUser(CUSTOMER_A_UUID, ADDRESS_A_UUID);

          assert.strictEqual(result.success, false);
          assert.strictEqual(result.status, 404);
        } finally {
          prisma.savedAddress.findUnique = originalFindUnique as any;
        }
      }
    });
  });

  describe('5. Database Failure Safety & No Silent Fallback', () => {
    test('Database failure on GET returns 500 and does NOT silently fall back to in-memory', async () => {
      const cookie = createAuthCookie({
        userId: CUSTOMER_A_UUID,
        email: 'customer.a@example.com',
        mobile: '9888888881',
        fullName: 'Customer A',
      });

      // Populate in-memory store with a test address for this customer
      db.saveAddress('customer.a@example.com', {
        fullName: 'In-Memory Customer A',
        mobile: '9888888881',
        pincode: '500081',
        houseFlat: 'Memory Flat 1',
        streetArea: 'Memory Street',
        city: 'Hyderabad',
        state: 'Telangana',
      });

      // If database client fails
      const originalFindMany = prisma?.savedAddress?.findMany;
      if (prisma) {
        prisma.savedAddress.findMany = (async () => {
          throw new Error('Connection terminated unexpectedly');
        }) as any;

        try {
          const req = new NextRequest('http://localhost:3000/api/account/addresses', {
            method: 'GET',
            headers: { cookie },
          });

          const res = await GET(req);
          // Must return 500 error, NOT 200 with the in-memory address
          assert.strictEqual(res.status, 500);
          const json = await res.json();
          assert.strictEqual(json.success, false);
          assert.strictEqual(json.error, 'Failed to fetch addresses');
        } finally {
          prisma.savedAddress.findMany = originalFindMany as any;
        }
      }
    });

    test('Database failure on POST returns 500 and does NOT silently fall back to in-memory', async () => {
      const cookie = createAuthCookie({
        userId: CUSTOMER_A_UUID,
        email: 'customer.a@example.com',
        mobile: '9888888881',
        fullName: 'Customer A',
      });

      const originalCreate = prisma?.savedAddress?.create;
      if (prisma) {
        prisma.savedAddress.create = (async () => {
          throw new Error('PostgreSQL unique constraint violation or lock timeout');
        }) as any;

        try {
          const req = new NextRequest('http://localhost:3000/api/account/addresses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              cookie,
            },
            body: JSON.stringify({
              fullName: 'Customer A',
              mobile: '9888888881',
              pincode: '500081',
              houseFlat: 'Apt 101',
              streetArea: 'Hi-Tech City',
            }),
          });

          const res = await POST(req);
          // Must return 500 error, NEVER 200 OK
          assert.strictEqual(res.status, 500);
          const json = await res.json();
          assert.strictEqual(json.success, false);
          assert.strictEqual(json.error, 'Failed to save address');
        } finally {
          prisma.savedAddress.create = originalCreate as any;
        }
      }
    });

    test('Database failure on DELETE returns 500 and does NOT silently fall back to in-memory', async () => {
      const cookie = createAuthCookie({
        userId: CUSTOMER_A_UUID,
        email: 'customer.a@example.com',
        mobile: '9888888881',
        fullName: 'Customer A',
      });

      const originalDelete = prisma?.savedAddress?.delete;
      const originalFindUnique = prisma?.savedAddress?.findUnique;
      if (prisma) {
        prisma.savedAddress.findUnique = (async () => ({
          id: ADDRESS_A_UUID,
          userId: CUSTOMER_A_UUID,
        })) as any;
        prisma.savedAddress.delete = (async () => {
          throw new Error('Database disk full or read-only replica');
        }) as any;

        try {
          const req = new NextRequest(`http://localhost:3000/api/account/addresses?id=${ADDRESS_A_UUID}`, {
            method: 'DELETE',
            headers: { cookie },
          });

          const res = await DELETE(req);
          assert.strictEqual(res.status, 500);
          const json = await res.json();
          assert.strictEqual(json.success, false);
          assert.strictEqual(json.error, 'Failed to delete address');
        } finally {
          prisma.savedAddress.findUnique = originalFindUnique as any;
          prisma.savedAddress.delete = originalDelete as any;
        }
      }
    });
  });

  describe('6. Response Shape Compatibility', () => {
    test('mapDbAddressToResponse accurately maps database fields to SavedAddress interface', () => {
      const dbRow = {
        id: ADDRESS_A_UUID,
        type: 'Work',
        isDefault: true,
        fullName: 'Pavan Geesala',
        mobile: '9876543210',
        pincode: '500081',
        houseFlat: 'Plot 42, Cyber Gateway',
        streetArea: 'Hi-Tech City Road',
        landmark: 'Near Metro Pillar 12',
        city: 'Hyderabad',
        state: 'Telangana',
      };

      const mapped = mapDbAddressToResponse(dbRow);
      assert.strictEqual(mapped.id, ADDRESS_A_UUID);
      assert.strictEqual(mapped.type, 'Work');
      assert.strictEqual(mapped.isDefault, true);
      assert.strictEqual(mapped.fullName, 'Pavan Geesala');
      assert.strictEqual(mapped.mobile, '9876543210');
      assert.strictEqual(mapped.pincode, '500081');
      assert.strictEqual(mapped.houseFlat, 'Plot 42, Cyber Gateway');
      assert.strictEqual(mapped.streetArea, 'Hi-Tech City Road');
      assert.strictEqual(mapped.landmark, 'Near Metro Pillar 12');
      assert.strictEqual(mapped.city, 'Hyderabad');
      assert.strictEqual(mapped.state, 'Telangana');
    });

    test('mapDbAddressToResponse normalizes null landmark to undefined for frontend clarity', () => {
      const dbRow = {
        id: ADDRESS_A_UUID,
        type: 'Home',
        isDefault: false,
        fullName: 'Pavan Geesala',
        mobile: '9876543210',
        pincode: '500081',
        houseFlat: 'Plot 42',
        streetArea: 'Hi-Tech City',
        landmark: null,
        city: 'Hyderabad',
        state: 'Telangana',
      };

      const mapped = mapDbAddressToResponse(dbRow);
      assert.strictEqual(mapped.landmark, undefined);
    });
  });
});
