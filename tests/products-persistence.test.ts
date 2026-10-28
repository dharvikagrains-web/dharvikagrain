import { test, describe } from 'node:test';
import assert from 'node:assert';
import { NextRequest } from 'next/server';
import { GET as getProductsHandler } from '@/app/api/products/route';
import { GET as getProductDetailHandler } from '@/app/api/products/[slug]/route';
import { prisma } from '@/lib/db/client';
import {
  serializeProduct,
  getPublishedProducts,
  getPublishedProductBySlug,
} from '@/lib/db/products';

// Mock product fixtures with Decimal-like objects, JSON strings, arrays, and nullables
const MOCK_PUBLISHED_PRODUCT = {
  id: 'prod-published-001',
  name: 'Korralu (Foxtail Millet)',
  slug: 'korralu-foxtail-millet',
  category: 'Millets',
  description: 'Naturally unpolished Foxtail Millet.',
  images: ['/images/products/korralu-foxtail-millet.jpg'],
  price: { toString: () => '95.00' }, // Decimal representation
  comparePrice: { toString: () => '120.00' },
  weight: { toString: () => '500.00' },
  unit: 'g',
  isAvailable: true,
  status: 'PUBLISHED',
  createdAt: new Date('2026-09-01T10:00:00Z'),
  updatedAt: new Date('2026-09-01T10:00:00Z'),
  localName: 'కొర్రలు (Korralu)',
  tagline: 'Ancient wholesome grain',
  shortDescription: 'Golden spherical seeds',
  weights: JSON.stringify([
    { size: '500g', price: 95, mrp: 120, inStock: true },
    { size: '1kg', price: 180, mrp: 230, inStock: true },
  ]),
  ingredients: ['100% Whole Foxtail Millet'],
  originDetails: 'Ananthapuramu Dryland Collective',
  processingDetails: 'Low-heat de-husking',
  cookingInstructions: ['Rinse 2 times', 'Boil with 1:2 water'],
  culinaryUses: ['Rice substitute', 'Upma', 'Pongal'],
  storageInstructions: 'Store in airtight container',
  nutritionFacts: JSON.stringify({
    servingSize: '100g raw',
    energyKcal: '351 kcal',
    protein: '12.3 g',
  }),
  badges: ['Unpolished', 'Gluten-Free'],
  batchInfo: JSON.stringify({
    batchPrefix: 'KRL',
    shelfLifeMonths: 9,
  }),
  labTestDetails: 'FSSAI Certified',
  isBestseller: true,
  isFeatured: true,
  rating: { toString: () => '4.85' },
  reviewCount: 42,
};

const MOCK_DRAFT_PRODUCT = {
  id: 'prod-draft-002',
  name: 'Experimental Wild Rice',
  slug: 'experimental-wild-rice',
  category: 'Millets',
  description: 'Unpublished draft testing grain.',
  images: [],
  price: { toString: () => '250.00' },
  comparePrice: null,
  weight: { toString: () => '1000.00' },
  unit: 'g',
  isAvailable: false,
  status: 'DRAFT',
  createdAt: new Date('2026-10-01T10:00:00Z'),
  updatedAt: new Date('2026-10-01T10:00:00Z'),
};

const MOCK_ARCHIVED_PRODUCT = {
  id: 'prod-archived-003',
  name: 'Discontinued Spice Blend',
  slug: 'discontinued-spice-blend',
  category: 'Spices',
  description: 'Archived product no longer in stock.',
  images: [],
  price: { toString: () => '150.00' },
  comparePrice: null,
  weight: { toString: () => '250.00' },
  unit: 'g',
  isAvailable: false,
  status: 'ARCHIVED',
  createdAt: new Date('2026-08-01T10:00:00Z'),
  updatedAt: new Date('2026-08-01T10:00:00Z'),
};

describe('DHARVIKA GRAINS — Product Catalog Persistence Suite', () => {

  describe('1. Product Serialization & Decimal Handling', () => {
    test('Decimal prices, weights, and ratings serialize correctly to numeric types', () => {
      const serialized = serializeProduct(MOCK_PUBLISHED_PRODUCT);

      assert.strictEqual(typeof serialized.price, 'number');
      assert.strictEqual(serialized.price, 95);

      assert.strictEqual(typeof serialized.comparePrice, 'number');
      assert.strictEqual(serialized.comparePrice, 120);

      assert.strictEqual(typeof serialized.weight, 'number');
      assert.strictEqual(serialized.weight, 500);

      assert.strictEqual(typeof serialized.rating, 'number');
      assert.strictEqual(serialized.rating, 4.85);

      assert.strictEqual(typeof serialized.reviewCount, 'number');
      assert.strictEqual(serialized.reviewCount, 42);
    });

    test('Nullable comparePrice and rating serialize safely to undefined and null', () => {
      const serialized = serializeProduct(MOCK_DRAFT_PRODUCT);

      assert.strictEqual(serialized.comparePrice, undefined);
      assert.strictEqual(serialized.rating, null);
      assert.strictEqual(serialized.reviewCount, 0);
    });

    test('JSON string fields parse safely into objects and arrays', () => {
      const serialized = serializeProduct(MOCK_PUBLISHED_PRODUCT);

      assert.ok(Array.isArray(serialized.weights));
      assert.strictEqual(serialized.weights.length, 2);
      assert.strictEqual(serialized.weights[0].size, '500g');
      assert.strictEqual(serialized.weights[0].price, 95);

      assert.strictEqual(typeof serialized.nutrition, 'object');
      assert.strictEqual(serialized.nutrition.energyKcal, '351 kcal');

      assert.strictEqual(typeof serialized.batchInfo, 'object');
      assert.strictEqual(serialized.batchInfo.batchPrefix, 'KRL');
    });

    test('Arrays, nullables, and dates handle missing values without crashing', () => {
      const bareProduct = {
        id: 'prod-bare',
        name: 'Bare Product',
        slug: 'bare-product',
        category: 'Spices',
        description: 'Simple description',
        price: '100',
        status: 'PUBLISHED',
      };

      const serialized = serializeProduct(bareProduct);
      assert.strictEqual(serialized.id, 'prod-bare');
      assert.ok(Array.isArray(serialized.images));
      assert.strictEqual(serialized.images.length, 0);
      assert.ok(Array.isArray(serialized.ingredients));
      assert.ok(Array.isArray(serialized.cookingInstructions));
      assert.strictEqual(serialized.localName, '');
      assert.strictEqual(serialized.origin, '');
      assert.strictEqual(typeof serialized.createdAt, 'string');
    });
  });

  describe('2. Published Status Filtering in Database Mode', () => {
    test('Public listing query filters exclusively for status = PUBLISHED', async () => {
      if (prisma) {
        const originalFindMany = prisma.product.findMany;
        let capturedWhere: any = null;

        prisma.product.findMany = (async ({ where }: any) => {
          capturedWhere = where;
          return [MOCK_PUBLISHED_PRODUCT];
        }) as any;

        try {
          const results = await getPublishedProducts({}, false); // non-privileged
          assert.strictEqual(capturedWhere.status, 'PUBLISHED');
          assert.strictEqual(results.length, 1);
          assert.strictEqual(results[0].slug, 'korralu-foxtail-millet');
        } finally {
          prisma.product.findMany = originalFindMany;
        }
      }
    });

    test('Privileged caller can view draft or archived products when requested', async () => {
      if (prisma) {
        const originalFindMany = prisma.product.findMany;
        let capturedWhere: any = null;

        prisma.product.findMany = (async ({ where }: any) => {
          capturedWhere = where;
          return [MOCK_DRAFT_PRODUCT];
        }) as any;

        try {
          const results = await getPublishedProducts({ status: 'DRAFT' }, true); // privileged admin
          assert.strictEqual(capturedWhere.status, 'DRAFT');
          assert.strictEqual(results.length, 1);
          assert.strictEqual(results[0].slug, 'experimental-wild-rice');
        } finally {
          prisma.product.findMany = originalFindMany;
        }
      }
    });
  });

  describe('3. Product Detail Lookup by Slug & 404 Behavior', () => {
    test('Published product can be retrieved by slug', async () => {
      if (prisma) {
        const originalFindFirst = prisma.product.findFirst;

        prisma.product.findFirst = (async ({ where }: any) => {
          if (where.slug?.equals === 'korralu-foxtail-millet' && where.status === 'PUBLISHED') {
            return MOCK_PUBLISHED_PRODUCT;
          }
          return null;
        }) as any;

        try {
          const product = await getPublishedProductBySlug('korralu-foxtail-millet', false);
          assert.ok(product);
          assert.strictEqual(product.name, 'Korralu (Foxtail Millet)');
          assert.strictEqual(product.price, 95);
        } finally {
          prisma.product.findFirst = originalFindFirst;
        }
      }
    });

    test('Draft slug returns null for public requests', async () => {
      if (prisma) {
        const originalFindFirst = prisma.product.findFirst;

        prisma.product.findFirst = (async ({ where }: any) => {
          // If public request filters for status = 'PUBLISHED', draft won't match
          if (where.status === 'PUBLISHED') {
            return null;
          }
          return MOCK_DRAFT_PRODUCT;
        }) as any;

        try {
          const product = await getPublishedProductBySlug('experimental-wild-rice', false);
          assert.strictEqual(product, null);
        } finally {
          prisma.product.findFirst = originalFindFirst;
        }
      }
    });

    test('Non-existent slug returns null', async () => {
      if (prisma) {
        const originalFindFirst = prisma.product.findFirst;
        prisma.product.findFirst = (async () => null) as any;

        try {
          const product = await getPublishedProductBySlug('non-existent-grain-slug', false);
          assert.strictEqual(product, null);
        } finally {
          prisma.product.findFirst = originalFindFirst;
        }
      }
    });
  });

  describe('4. API Route Endpoints & Error Handling', () => {
    test('GET /api/products returns compatible JSON shape { success: true, count, products }', async () => {
      const req = new NextRequest('http://localhost:3000/api/products');
      const res = await getProductsHandler(req);

      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(typeof json.count, 'number');
      assert.ok(Array.isArray(json.products));
      assert.ok(json.count > 0);
    });

    test('GET /api/products/[slug] returns 404 for non-existent slug', async () => {
      const req = new NextRequest('http://localhost:3000/api/products/non-existent-slug-xyz');
      const res = await getProductDetailHandler(req, {
        params: Promise.resolve({ slug: 'non-existent-slug-xyz' }),
      });

      assert.strictEqual(res.status, 404);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.match(json.error, /not found/i);
    });

    test('GET /api/products/[slug] returns 200 for canonical product slug', async () => {
      const req = new NextRequest('http://localhost:3000/api/products/korralu-foxtail-millet');
      const res = await getProductDetailHandler(req, {
        params: Promise.resolve({ slug: 'korralu-foxtail-millet' }),
      });

      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(json.product);
      assert.strictEqual(json.product.slug, 'korralu-foxtail-millet');
      assert.strictEqual(typeof json.product.price, 'number');
    });

    test('Database failure on listing returns 500 and does NOT fall back to stale static data', async () => {
      if (prisma) {
        const originalFindMany = prisma.product.findMany;
        prisma.product.findMany = (async () => {
          throw new Error('Database connection reset by peer');
        }) as any;

        try {
          const req = new NextRequest('http://localhost:3000/api/products');
          const res = await getProductsHandler(req);

          assert.strictEqual(res.status, 500);
          const json = await res.json();
          assert.strictEqual(json.success, false);
          assert.strictEqual(json.error, 'Failed to fetch products');
        } finally {
          prisma.product.findMany = originalFindMany;
        }
      }
    });

    test('Database failure on detail returns 500 without leaking stack traces', async () => {
      if (prisma) {
        const originalFindFirst = prisma.product.findFirst;
        prisma.product.findFirst = (async () => {
          throw new Error('PostgreSQL syntax error or connection drop');
        }) as any;

        try {
          const req = new NextRequest('http://localhost:3000/api/products/korralu-foxtail-millet');
          const res = await getProductDetailHandler(req, {
            params: Promise.resolve({ slug: 'korralu-foxtail-millet' }),
          });

          assert.strictEqual(res.status, 500);
          const json = await res.json();
          assert.strictEqual(json.success, false);
          assert.strictEqual(json.error, 'Failed to fetch product');
        } finally {
          prisma.product.findFirst = originalFindFirst;
        }
      }
    });
  });
});
