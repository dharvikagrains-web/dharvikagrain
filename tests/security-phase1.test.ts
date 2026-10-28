import { test, describe } from 'node:test';
import assert from 'node:assert';
import crypto from 'crypto';
import { NextRequest } from 'next/server';

// Handlers and services under test
import { POST as syncSessionHandler } from '@/app/api/auth/sync-session/route';
import { POST as adminLoginHandler } from '@/app/api/auth/admin-login/route';
import { GET as getOrderHandler, POST as postOrderHandler, PUT as putOrderHandler } from '@/app/api/orders/[orderNumber]/route';
import { GET as getAddressesHandler, POST as postAddressesHandler, DELETE as deleteAddressesHandler } from '@/app/api/account/addresses/route';
import { verifyRazorpaySignature, verifyWebhookSignature } from '@/lib/payments/razorpay';
import { signSession, AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { db } from '@/lib/db';

describe('DHARVIKA GRAINS — Phase 1 Security Regression Suite', () => {

  describe('1. OAuth Session Synchronization Security', () => {
    test('OAuth users cannot self-assign ADMIN or OWNER via destination path', async () => {
      const fakeUser = {
        id: 'usr_test_attacker_01',
        email: 'attacker@example.com',
        user_metadata: { full_name: 'Attacker User' },
      };

      const req = new NextRequest('http://localhost:3000/api/auth/sync-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: fakeUser,
          destination: '/admin/inventory',
        }),
      });

      const res = await syncSessionHandler(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();

      // Role must remain CUSTOMER, ignoring destination '/admin/inventory'
      assert.strictEqual(json.role, 'CUSTOMER');
      assert.notStrictEqual(json.role, 'ADMIN');
      assert.notStrictEqual(json.role, 'OWNER');
    });

    test('OAuth users cannot assume OWNER via substring in email', async () => {
      const fakeUser = {
        id: 'usr_test_attacker_02',
        email: 'pavan.notowner@gmail.com',
        user_metadata: { full_name: 'Imposter Pavan' },
      };

      const req = new NextRequest('http://localhost:3000/api/auth/sync-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: fakeUser,
        }),
      });

      const res = await syncSessionHandler(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();

      // Role must remain CUSTOMER
      assert.strictEqual(json.role, 'CUSTOMER');
      assert.notStrictEqual(json.role, 'OWNER');
    });

    test('Configured legitimate administrator email receives ADMIN role', async () => {
      const prevAdminEmail = process.env.ADMIN_EMAIL;
      process.env.ADMIN_EMAIL = 'verified.admin@dharvikagrains.in';

      try {
        const legitimateAdmin = {
          id: 'usr_legit_admin',
          email: 'verified.admin@dharvikagrains.in',
          user_metadata: { full_name: 'Verified Admin' },
        };

        const req = new NextRequest('http://localhost:3000/api/auth/sync-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: legitimateAdmin }),
        });

        const res = await syncSessionHandler(req);
        assert.strictEqual(res.status, 200);
        const json = await res.json();
        assert.strictEqual(json.role, 'ADMIN');
      } finally {
        process.env.ADMIN_EMAIL = prevAdminEmail;
      }
    });
  });

  describe('2. Administrator Authentication & Access Control', () => {
    test('Hardcoded password DharvikaAdmin2026! is rejected for arbitrary admin email', async () => {
      const req = new NextRequest('http://localhost:3000/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'attacker_admin@example.com',
          password: 'DharvikaAdmin2026!',
        }),
      });

      const res = await adminLoginHandler(req);
      assert.strictEqual(res.status, 401);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.match(json.error, /invalid administrator credentials/i);
    });

    test('Arbitrary email containing "admin" cannot authenticate without valid configured credentials', async () => {
      const req = new NextRequest('http://localhost:3000/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'randomadmin@gmail.com',
          password: 'Password123!',
        }),
      });

      const res = await adminLoginHandler(req);
      assert.strictEqual(res.status, 401);
    });

    test('Configured admin with valid environment passcode authenticates successfully', async () => {
      const prevEmail = process.env.ADMIN_EMAIL;
      const prevPass = process.env.ADMIN_PASSWORD;
      process.env.ADMIN_EMAIL = 'ops.admin@dharvikagrains.in';
      process.env.ADMIN_PASSWORD = 'SecureConfiguredSecret2026#';

      try {
        const req = new NextRequest('http://localhost:3000/api/auth/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'ops.admin@dharvikagrains.in',
            password: 'SecureConfiguredSecret2026#',
          }),
        });

        const res = await adminLoginHandler(req);
        assert.strictEqual(res.status, 200);
        const json = await res.json();
        assert.strictEqual(json.success, true);
        assert.strictEqual(json.user.role, 'ADMIN');
      } finally {
        process.env.ADMIN_EMAIL = prevEmail;
        process.env.ADMIN_PASSWORD = prevPass;
      }
    });
  });

  describe('3. Order API Authorization & PII Protection', () => {
    test('Unauthenticated order request is rejected with 401 Unauthorized for existing order', async () => {
      const req = new NextRequest('http://localhost:3000/api/orders/DG10248', {
        method: 'GET',
      });

      const res = await getOrderHandler(req, {
        params: Promise.resolve({ orderNumber: 'DG10248' }),
      });

      assert.strictEqual(res.status, 401);
      const json = await res.json();
      assert.match(json.error, /authentication required/i);
    });

    test('Unauthenticated order request is rejected with identical 401 for nonexistent order (anti-enumeration)', async () => {
      const req = new NextRequest('http://localhost:3000/api/orders/NONEXISTENT_ORDER_99999', {
        method: 'GET',
      });

      const res = await getOrderHandler(req, {
        params: Promise.resolve({ orderNumber: 'NONEXISTENT_ORDER_99999' }),
      });

      // Must return 401, NOT 404, preventing order enumeration
      assert.strictEqual(res.status, 401);
      const json = await res.json();
      assert.match(json.error, /authentication required/i);
    });

    test('Authenticated customer receives 404 when requesting nonexistent order', async () => {
      db.upsertUser({
        id: 'usr_valid_customer',
        email: 'validcustomer@example.com',
        mobile: '9123456789',
        fullName: 'Valid Customer',
        role: 'CUSTOMER',
      });

      const token = signSession({
        userId: 'usr_valid_customer',
        email: 'validcustomer@example.com',
        mobile: '9123456789',
        fullName: 'Valid Customer',
        role: 'CUSTOMER',
      });

      const req = new NextRequest('http://localhost:3000/api/orders/NONEXISTENT_ORDER_99999', {
        method: 'GET',
        headers: {
          cookie: `${AUTH_COOKIE_NAME}=${token}`,
        },
      });

      const res = await getOrderHandler(req, {
        params: Promise.resolve({ orderNumber: 'NONEXISTENT_ORDER_99999' }),
      });

      // After authentication, nonexistent order returns 404
      assert.strictEqual(res.status, 404);
      const json = await res.json();
      assert.match(json.error, /not found/i);
    });


    test('Customer A cannot access Customer B order (returns 403 Forbidden)', async () => {
      // Register Customer A in db
      db.upsertUser({
        id: 'usr_customer_A',
        email: 'customera@example.com',
        mobile: '9111111111',
        fullName: 'Customer Alice',
        role: 'CUSTOMER',
      });

      const tokenCustomerA = signSession({
        userId: 'usr_customer_A',
        email: 'customera@example.com',
        mobile: '9111111111',
        fullName: 'Customer Alice',
        role: 'CUSTOMER',
      });

      // Target order DG10248 belongs to pavan@example.com
      const req = new NextRequest('http://localhost:3000/api/orders/DG10248', {
        method: 'GET',
        headers: {
          cookie: `${AUTH_COOKIE_NAME}=${tokenCustomerA}`,
        },
      });

      const res = await getOrderHandler(req, {
        params: Promise.resolve({ orderNumber: 'DG10248' }),
      });

      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.match(json.error, /permission/i);
    });

    test('Order owner can successfully view their own order details', async () => {
      // Register Order Owner in db
      db.upsertUser({
        id: 'usr_cust_001',
        email: 'pavan@example.com',
        mobile: '9876543210',
        fullName: 'Pavan Geesala',
        role: 'CUSTOMER',
      });

      const tokenOwner = signSession({
        userId: 'usr_cust_001',
        email: 'pavan@example.com',
        mobile: '9876543210',
        fullName: 'Pavan Geesala',
        role: 'CUSTOMER',
      });

      const req = new NextRequest('http://localhost:3000/api/orders/DG10248', {
        method: 'GET',
        headers: {
          cookie: `${AUTH_COOKIE_NAME}=${tokenOwner}`,
        },
      });

      const res = await getOrderHandler(req, {
        params: Promise.resolve({ orderNumber: 'DG10248' }),
      });

      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.order.orderNumber, 'DG10248');
    });

    test('Admin role can view customer orders for operations', async () => {
      db.upsertUser({
        id: 'usr_admin_001',
        email: 'admin@dharvikagrains.in',
        mobile: '9000000000',
        fullName: 'Store Admin',
        role: 'ADMIN',
      });

      const tokenAdmin = signSession({
        userId: 'usr_admin_001',
        email: 'admin@dharvikagrains.in',
        mobile: '9000000000',
        fullName: 'Store Admin',
        role: 'ADMIN',
      });

      const req = new NextRequest('http://localhost:3000/api/orders/DG10248', {
        method: 'GET',
        headers: {
          cookie: `${AUTH_COOKIE_NAME}=${tokenAdmin}`,
        },
      });

      const res = await getOrderHandler(req, {
        params: Promise.resolve({ orderNumber: 'DG10248' }),
      });

      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
    });

    test('Disallowed HTTP methods on orders API return 405 Method Not Allowed', async () => {
      const postRes = await postOrderHandler();
      assert.strictEqual(postRes.status, 405);
      const putRes = await putOrderHandler();
      assert.strictEqual(putRes.status, 405);
    });
  });

  describe('4. Saved Addresses API Authorization & Isolation', () => {
    test('Unauthenticated GET /api/account/addresses returns 401 and does not leak default address', async () => {
      const req = new NextRequest('http://localhost:3000/api/account/addresses', {
        method: 'GET',
      });

      const res = await getAddressesHandler(req);
      assert.strictEqual(res.status, 401);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.match(json.error, /authentication required/i);
    });

    test('Unauthenticated POST /api/account/addresses returns 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Anonymous Attacker',
          mobile: '9999999999',
          pincode: '500081',
          houseFlat: 'Flat 1',
          streetArea: 'Street 1',
        }),
      });

      const res = await postAddressesHandler(req);
      assert.strictEqual(res.status, 401);
    });

    test('Authenticated customer accesses only their own isolated addresses', async () => {
      const testEmail = `cust_${Date.now()}@example.com`;
      db.upsertUser({
        id: 'usr_isolated_01',
        email: testEmail,
        mobile: '9888888888',
        fullName: 'Isolated Customer',
        role: 'CUSTOMER',
      });

      const token = signSession({
        userId: 'usr_isolated_01',
        email: testEmail,
        mobile: '9888888888',
        fullName: 'Isolated Customer',
        role: 'CUSTOMER',
      });

      // Save an address for this isolated customer
      const postReq = new NextRequest('http://localhost:3000/api/account/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: `${AUTH_COOKIE_NAME}=${token}`,
        },
        body: JSON.stringify({
          fullName: 'Isolated Customer',
          mobile: '9888888888',
          pincode: '500081',
          houseFlat: 'Apt 101',
          streetArea: 'Hi-Tech City Road',
          city: 'Hyderabad',
          state: 'Telangana',
        }),
      });

      const postRes = await postAddressesHandler(postReq);
      assert.strictEqual(postRes.status, 200);

      // Fetch addresses for this customer
      const getReq = new NextRequest('http://localhost:3000/api/account/addresses', {
        method: 'GET',
        headers: {
          cookie: `${AUTH_COOKIE_NAME}=${token}`,
        },
      });

      const getRes = await getAddressesHandler(getReq);
      assert.strictEqual(getRes.status, 200);
      const json = await getRes.json();
      assert.strictEqual(json.success, true);
      assert.ok(Array.isArray(json.addresses));
      assert.strictEqual(json.addresses.length, 1);
      assert.strictEqual(json.addresses[0].houseFlat, 'Apt 101');
    });

    test('Unauthenticated DELETE /api/account/addresses returns 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/account/addresses?id=addr-1', {
        method: 'DELETE',
      });
      const res = await deleteAddressesHandler(req);
      assert.strictEqual(res.status, 401);
    });
  });

  describe('5. Payment Signature Cryptographic Verification', () => {
    test('In production mode, simulation signature sim_sig_* is rejected', () => {
      const prevEnv = process.env.NODE_ENV;
      const prevSecret = process.env.RAZORPAY_KEY_SECRET;

      try {
        process.env.NODE_ENV = 'production';
        process.env.RAZORPAY_KEY_SECRET = 'rzp_test_placeholder_secret';

        const result = verifyRazorpaySignature({
          razorpayOrderId: 'order_123456',
          razorpayPaymentId: 'pay_123456',
          razorpaySignature: 'sim_sig_1234567890',
        });

        assert.strictEqual(result, false, 'Simulation signature must be rejected in production');
      } finally {
        process.env.NODE_ENV = prevEnv;
        process.env.RAZORPAY_KEY_SECRET = prevSecret;
      }
    });

    test('In production mode, missing or placeholder key secret fails closed', () => {
      const prevEnv = process.env.NODE_ENV;
      const prevSecret = process.env.RAZORPAY_KEY_SECRET;

      try {
        process.env.NODE_ENV = 'production';
        delete process.env.RAZORPAY_KEY_SECRET;

        const result = verifyRazorpaySignature({
          razorpayOrderId: 'order_123456',
          razorpayPaymentId: 'pay_123456',
          razorpaySignature: 'some_arbitrary_signature_value',
        });

        assert.strictEqual(result, false, 'Must fail closed when key secret is missing');
      } finally {
        process.env.NODE_ENV = prevEnv;
        process.env.RAZORPAY_KEY_SECRET = prevSecret;
      }
    });

    test('Tampered or forged signature with real secret is rejected', () => {
      const realSecret = 'super_secret_key_from_env_12345';
      const prevSecret = process.env.RAZORPAY_KEY_SECRET;
      const prevEnv = process.env.NODE_ENV;

      try {
        process.env.NODE_ENV = 'production';
        process.env.RAZORPAY_KEY_SECRET = realSecret;

        const result = verifyRazorpaySignature({
          razorpayOrderId: 'order_valid_001',
          razorpayPaymentId: 'pay_valid_001',
          razorpaySignature: 'tampered_signature_hex_value_ffffffff',
        });

        assert.strictEqual(result, false);
      } finally {
        process.env.RAZORPAY_KEY_SECRET = prevSecret;
        process.env.NODE_ENV = prevEnv;
      }
    });

    test('Cryptographically valid HMAC-SHA256 signature is verified successfully', () => {
      const realSecret = 'actual_configured_razorpay_secret_key';
      const prevSecret = process.env.RAZORPAY_KEY_SECRET;
      const prevEnv = process.env.NODE_ENV;

      try {
        process.env.NODE_ENV = 'production';
        process.env.RAZORPAY_KEY_SECRET = realSecret;

        const orderId = 'order_test_999';
        const paymentId = 'pay_test_999';

        const validSignature = crypto
          .createHmac('sha256', realSecret)
          .update(`${orderId}|${paymentId}`)
          .digest('hex');

        const result = verifyRazorpaySignature({
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: validSignature,
        });

        assert.strictEqual(result, true, 'Valid HMAC signature must verify successfully');
      } finally {
        process.env.RAZORPAY_KEY_SECRET = prevSecret;
        process.env.NODE_ENV = prevEnv;
      }
    });

    test('Webhook verification fails closed in production when webhook secret is missing', () => {
      const prevEnv = process.env.NODE_ENV;
      const prevSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

      try {
        process.env.NODE_ENV = 'production';
        delete process.env.RAZORPAY_WEBHOOK_SECRET;

        const result = verifyWebhookSignature('{"event":"payment.captured"}', 'dummy_signature');
        assert.strictEqual(result, false, 'Webhook must fail closed when secret is missing');
      } finally {
        process.env.NODE_ENV = prevEnv;
        process.env.RAZORPAY_WEBHOOK_SECRET = prevSecret;
      }
    });

    test('Webhook verification validates legitimate HMAC-SHA256 signature', () => {
      const prevEnv = process.env.NODE_ENV;
      const prevSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      const testSecret = 'rzp_wh_sec_abc123456789';

      try {
        process.env.NODE_ENV = 'production';
        process.env.RAZORPAY_WEBHOOK_SECRET = testSecret;

        const body = JSON.stringify({ event: 'order.paid', id: 'evt_123' });
        const validSig = crypto.createHmac('sha256', testSecret).update(body).digest('hex');

        assert.strictEqual(verifyWebhookSignature(body, validSig), true);
        assert.strictEqual(verifyWebhookSignature(body, 'tampered_signature_hex_value'), false);
      } finally {
        process.env.NODE_ENV = prevEnv;
        process.env.RAZORPAY_WEBHOOK_SECRET = prevSecret;
      }
    });
  });
});

