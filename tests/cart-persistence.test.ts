import { test, describe } from 'node:test';
import assert from 'node:assert';
import { NextRequest } from 'next/server';
import { GET, POST, PATCH, DELETE } from '@/app/api/cart/route';
import { signSession, AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { prisma } from '@/lib/db/client';
import {
  addCartItemAtomic,
  updateCartItemQuantityAtomic,
  changeCartItemQuantityDelta,
  getAuthoritativeCart,
} from '@/lib/db/cart';

const CUSTOMER_A_UUID = '11111111-1111-4111-a111-111111111111';
const CUSTOMER_B_UUID = '22222222-2222-4222-b222-222222222222';
const CART_A_UUID = '55555555-5555-4555-a555-555555555555';
const CART_ITEM_A_UUID = '66666666-6666-4666-a666-666666666666';

function createCustomerAuthCookie(userId: string, email: string): string {
  db.upsertUser({
    fullName: 'Test Customer',
    email,
    mobile: '9888888888',
    role: 'CUSTOMER',
  });

  db.upsertProfile({
    id: userId,
    fullName: 'Test Customer',
    email,
    phone: '9888888888',
    role: 'CUSTOMER',
  });

  const token = signSession({
    userId,
    email,
    mobile: '9888888888',
    fullName: 'Test Customer',
    role: 'CUSTOMER',
  });

  return `${AUTH_COOKIE_NAME}=${token}`;
}

describe('DHARVIKA GRAINS — Persistent Customer Cart Suite', () => {

  describe('1. Unauthenticated Request Rejection', () => {
    test('Unauthenticated GET /api/cart is rejected with 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/cart', { method: 'GET' });
      const res = await GET(req);
      assert.strictEqual(res.status, 401);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.match(json.error, /authentication required/i);
    });

    test('Unauthenticated POST /api/cart is rejected with 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: 'millet-korralu', quantity: 1 }),
      });
      const res = await POST(req);
      assert.strictEqual(res.status, 401);
    });

    test('Unauthenticated PATCH /api/cart is rejected with 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: 'item_1', action: 'SET', quantity: 2 }),
      });
      const res = await PATCH(req);
      assert.strictEqual(res.status, 401);
    });

    test('Unauthenticated DELETE /api/cart is rejected with 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/cart?clearAll=true', { method: 'DELETE' });
      const res = await DELETE(req);
      assert.strictEqual(res.status, 401);
    });
  });

  describe('2. Customer Isolation & Cross-Account Defense', () => {
    test('Customer A cannot access Customer B cart via query parameter (403 Forbidden)', async () => {
      const cookie = createCustomerAuthCookie(CUSTOMER_A_UUID, 'cust.a@example.com');
      const req = new NextRequest(`http://localhost:3000/api/cart?userId=${CUSTOMER_B_UUID}`, {
        method: 'GET',
        headers: { cookie },
      });

      const res = await GET(req);
      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.match(json.error, /Forbidden: You cannot access another customer's cart/i);
    });

    test('Customer A cannot modify Customer B cart via targetUserId in POST (403 Forbidden)', async () => {
      const cookie = createCustomerAuthCookie(CUSTOMER_A_UUID, 'cust.a@example.com');
      const req = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', cookie },
        body: JSON.stringify({
          productId: 'millet-korralu',
          targetUserId: CUSTOMER_B_UUID,
          quantity: 2,
        }),
      });

      const res = await POST(req);
      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.match(json.error, /Forbidden: You cannot modify another customer's cart/i);
    });

    test('Customer A cannot modify Customer B cart via targetUserId in PATCH (403 Forbidden)', async () => {
      const cookie = createCustomerAuthCookie(CUSTOMER_A_UUID, 'cust.a@example.com');
      const req = new NextRequest('http://localhost:3000/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', cookie },
        body: JSON.stringify({
          itemId: 'item_target',
          action: 'SET',
          quantity: 3,
          targetUserId: CUSTOMER_B_UUID,
        }),
      });

      const res = await PATCH(req);
      assert.strictEqual(res.status, 403);
    });

    test('Customer A cannot clear Customer B cart via targetUserId in DELETE (403 Forbidden)', async () => {
      const cookie = createCustomerAuthCookie(CUSTOMER_A_UUID, 'cust.a@example.com');
      const req = new NextRequest('http://localhost:3000/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', cookie },
        body: JSON.stringify({
          clearAll: true,
          targetUserId: CUSTOMER_B_UUID,
        }),
      });

      const res = await DELETE(req);
      assert.strictEqual(res.status, 403);
    });
  });

  describe('3. Quantity Validation & Input Sanitization', () => {
    test('POST rejects non-integer, zero, and negative quantities', async () => {
      const cookie = createCustomerAuthCookie(CUSTOMER_A_UUID, 'cust.a@example.com');
      const invalidQuantities = [0, -1, -5, 1.5, NaN, 'two', null];

      for (const qty of invalidQuantities) {
        const req = new NextRequest('http://localhost:3000/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', cookie },
          body: JSON.stringify({
            productId: 'millet-korralu',
            quantity: qty,
          }),
        });

        const res = await POST(req);
        assert.strictEqual(res.status, 400);
        const json = await res.json();
        assert.strictEqual(json.success, false);
      }
    });

    test('POST rejects missing productId', async () => {
      const cookie = createCustomerAuthCookie(CUSTOMER_A_UUID, 'cust.a@example.com');
      const req = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', cookie },
        body: JSON.stringify({ quantity: 1 }),
      });

      const res = await POST(req);
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.match(json.error, /productId is required/i);
    });

    test('PATCH rejects invalid delta in INCREASE / DECREASE', async () => {
      const cookie = createCustomerAuthCookie(CUSTOMER_A_UUID, 'cust.a@example.com');
      const req = new NextRequest('http://localhost:3000/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', cookie },
        body: JSON.stringify({
          itemId: 'item_1',
          action: 'INCREASE',
          delta: -2,
        }),
      });

      const res = await PATCH(req);
      assert.strictEqual(res.status, 400);
    });

    test('PATCH rejects unsupported action strings', async () => {
      const cookie = createCustomerAuthCookie(CUSTOMER_A_UUID, 'cust.a@example.com');
      const req = new NextRequest('http://localhost:3000/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', cookie },
        body: JSON.stringify({
          itemId: 'item_1',
          action: 'MULTIPLY',
          quantity: 2,
        }),
      });

      const res = await PATCH(req);
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.match(json.error, /Invalid action/i);
    });
  });

  describe('4. Atomic Upsert & Concurrency Handling', () => {
    test('Adding product uses atomic upsert and increments existing quantity', async () => {
      if (prisma) {
        let upsertArgs: any = null;
        let cartRecord = { id: CART_A_UUID, userId: CUSTOMER_A_UUID };

        const originalCartUpsert = prisma.cart.upsert;
        const originalCartItemUpsert = prisma.cartItem.upsert;
        const originalProductFindFirst = prisma.product.findFirst;
        const originalCartItemFindMany = prisma.cartItem.findMany;
        const originalProductFindMany = prisma.product.findMany;
        const originalCartUpdate = prisma.cart.update;

        prisma.cart.upsert = (async () => cartRecord) as any;
        prisma.cart.update = (async () => cartRecord) as any;
        prisma.product.findFirst = (async () => ({
          id: 'millet-korralu',
          slug: 'korralu-foxtail-millet',
          name: 'Korralu (Foxtail Millet)',
          status: 'PUBLISHED',
          price: 95,
          weights: [{ size: '500g', price: 95, mrp: 120, inStock: true }],
        })) as any;

        prisma.cartItem.upsert = (async (args: any) => {
          upsertArgs = args;
          return {
            id: CART_ITEM_A_UUID,
            cartId: CART_A_UUID,
            productId: 'millet-korralu',
            selectedWeight: '500g',
            quantity: 3,
          };
        }) as any;

        prisma.cartItem.findMany = (async () => [
          {
            id: CART_ITEM_A_UUID,
            cartId: CART_A_UUID,
            productId: 'millet-korralu',
            selectedWeight: '500g',
            quantity: 3,
          },
        ]) as any;

        prisma.product.findMany = (async () => [
          {
            id: 'millet-korralu',
            slug: 'korralu-foxtail-millet',
            name: 'Korralu (Foxtail Millet)',
            price: 95,
            weights: [{ size: '500g', price: 95, mrp: 120, inStock: true }],
            isAvailable: true,
          },
        ]) as any;

        try {
          const cart = await addCartItemAtomic(CUSTOMER_A_UUID, 'millet-korralu', '500g', 2);

          // Verify atomic upsert arguments
          assert.ok(upsertArgs);
          assert.strictEqual(upsertArgs.where.cartId_productId_selectedWeight.cartId, CART_A_UUID);
          assert.strictEqual(upsertArgs.where.cartId_productId_selectedWeight.productId, 'millet-korralu');
          assert.strictEqual(upsertArgs.where.cartId_productId_selectedWeight.selectedWeight, '500g');
          assert.deepStrictEqual(upsertArgs.update, { quantity: { increment: 2 } });

          // Verify authoritative price calculation (3 units * 95 = 285)
          assert.strictEqual(cart.subtotal, 285);
          assert.strictEqual(cart.itemCount, 3);
          assert.strictEqual(cart.items[0].unitPrice, 95);
        } finally {
          prisma.cart.upsert = originalCartUpsert;
          prisma.cart.update = originalCartUpdate;
          prisma.cartItem.upsert = originalCartItemUpsert;
          prisma.product.findFirst = originalProductFindFirst;
          prisma.cartItem.findMany = originalCartItemFindMany;
          prisma.product.findMany = originalProductFindMany;
        }
      }
    });

    test('Adding unsupported weight option throws 400 error', async () => {
      if (prisma) {
        const originalProductFindFirst = prisma.product.findFirst;

        prisma.product.findFirst = (async () => ({
          id: 'millet-korralu',
          name: 'Korralu',
          status: 'PUBLISHED',
          weights: [{ size: '500g', price: 95 }],
        })) as any;

        try {
          await assert.rejects(
            async () => {
              await addCartItemAtomic(CUSTOMER_A_UUID, 'millet-korralu', '25kg', 1);
            },
            (err: any) => {
              assert.strictEqual(err.status, 400);
              assert.match(err.message, /Unsupported weight/i);
              return true;
            }
          );
        } finally {
          prisma.product.findFirst = originalProductFindFirst;
        }
      }
    });

    test('Adding draft product throws 400 error', async () => {
      if (prisma) {
        const originalProductFindFirst = prisma.product.findFirst;

        prisma.product.findFirst = (async () => ({
          id: 'grain-draft',
          name: 'Draft Grain',
          status: 'DRAFT',
        })) as any;

        try {
          await assert.rejects(
            async () => {
              await addCartItemAtomic(CUSTOMER_A_UUID, 'grain-draft', '500g', 1);
            },
            (err: any) => {
              assert.strictEqual(err.status, 400);
              assert.match(err.message, /not currently available/i);
              return true;
            }
          );
        } finally {
          prisma.product.findFirst = originalProductFindFirst;
        }
      }
    });
  });

  describe('5. Database Error Handling (No Silent Memory Fallback)', () => {
    test('Database failure on GET returns 500 and does NOT silently fall back to in-memory', async () => {
      const cookie = createCustomerAuthCookie(CUSTOMER_A_UUID, 'cust.a@example.com');

      if (prisma) {
        const originalCartUpsert = prisma.cart.upsert;
        prisma.cart.upsert = (async () => {
          throw new Error('Database pool exhaustion');
        }) as any;

        try {
          const req = new NextRequest('http://localhost:3000/api/cart', {
            method: 'GET',
            headers: { cookie },
          });

          const res = await GET(req);
          assert.strictEqual(res.status, 500);
          const json = await res.json();
          assert.strictEqual(json.success, false);
          assert.strictEqual(json.error, 'Failed to fetch cart.');
        } finally {
          prisma.cart.upsert = originalCartUpsert;
        }
      }
    });

    test('Database failure on POST returns 500 and does NOT silently fall back to in-memory', async () => {
      const cookie = createCustomerAuthCookie(CUSTOMER_A_UUID, 'cust.a@example.com');

      if (prisma) {
        const originalProductFindFirst = prisma.product.findFirst;
        prisma.product.findFirst = (async () => {
          throw new Error('PostgreSQL connection drop');
        }) as any;

        try {
          const req = new NextRequest('http://localhost:3000/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', cookie },
            body: JSON.stringify({
              productId: 'millet-korralu',
              quantity: 1,
            }),
          });

          const res = await POST(req);
          assert.strictEqual(res.status, 500);
          const json = await res.json();
          assert.strictEqual(json.success, false);
          assert.strictEqual(json.error, 'Failed to add item to cart.');
        } finally {
          prisma.product.findFirst = originalProductFindFirst;
        }
      }
    });
  });
});
