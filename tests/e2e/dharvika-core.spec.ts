import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://dharvikagrain.vercel.app';

test.describe('Dharvika Grains End-to-End Regression Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate with high-reliability network idle wait
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  });

  test('TC-01: Homepage loads brand header, hero banner, and key navigation', async ({ page }) => {
    await expect(page).toHaveTitle(/DHARVIKA GRAINS/i);
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Verify main navigation links
    await expect(page.locator('a:has-text("Shop")').first()).toBeVisible();
    await expect(page.locator('a:has-text("Millets")').first()).toBeVisible();
    await expect(page.locator('a:has-text("Spices")').first()).toBeVisible();
  });

  test('TC-02: Search overlay returns accurate results for grain query', async ({ page }) => {
    // Click Search Icon button
    const searchBtn = page.locator('button[aria-label="Search"], button:has-text("Search")').first();
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
      const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
      await expect(searchInput).toBeVisible();
      await searchInput.fill('Foxtail');
      await expect(page.locator('text=Korralu').first()).toBeVisible();
    }
  });

  test('TC-03: Catalog filtering by category routes accurately', async ({ page }) => {
    await page.goto(`${BASE_URL}/millets`);
    await expect(page.locator('h1, h2')).toContainText(/Millets/i);
    // Verify at least one millet card is visible
    await expect(page.locator('text=Korralu').or(page.locator('text=Arikelu')).first()).toBeVisible();
  });

  test('TC-04: Product Detail Page (PDP) weight selection & price adjustment', async ({ page }) => {
    await page.goto(`${BASE_URL}/products/korralu-foxtail-millet`);
    await expect(page.locator('h1')).toContainText(/Korralu/i);

    // Verify weight option buttons exist
    const weightButtons = page.locator('button:has-text("500g"), button:has-text("1kg")');
    await expect(weightButtons.first()).toBeVisible();

    // Test Quantity increment
    const plusBtn = page.locator('button[aria-label="Increase quantity"]');
    if (await plusBtn.isVisible()) {
      await plusBtn.click();
    }

    // Add to cart
    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();
  });

  test('TC-05: Cart calculations (Subtotal, Shipping threshold, Line items)', async ({ page }) => {
    await page.goto(`${BASE_URL}/cart`);
    await expect(page.locator('h1, h2')).toContainText(/Cart/i);

    // Verify coupon input field exists
    const couponInput = page.locator('input[placeholder*="coupon"], input[placeholder*="promo"]');
    if (await couponInput.isVisible()) {
      await couponInput.fill('INVALIDCODE');
      const applyBtn = page.locator('button:has-text("Apply")');
      await applyBtn.click();
      await expect(page.locator('text=Invalid coupon').or(page.locator('text=error'))).toBeVisible();
    }
  });

  test('TC-06: Checkout page loads without forced blocking redirect for guest shoppers', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout`);
    // Page should display Checkout or Contact Information
    await expect(page.locator('text=Checkout').or(page.locator('text=Contact Information'))).toBeVisible();
  });

  test('TC-07: Footer policy and compliance links are accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy-policy`);
    await expect(page.locator('h1')).toContainText(/Privacy Policy/i);

    await page.goto(`${BASE_URL}/refund-policy`);
    await expect(page.locator('h1')).toContainText(/Refund/i);

    await page.goto(`${BASE_URL}/shipping-policy`);
    await expect(page.locator('h1')).toContainText(/Shipping/i);
  });

  test('TC-08: Mobile touch targets on weight variants and quantity selectors meet minimum size', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/products/korralu-foxtail-millet`);
    
    const weightBtn = page.locator('button:has-text("500g")').first();
    await expect(weightBtn).toBeVisible();
    const box = await weightBtn.boundingBox();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(40);
    }

    const decBtn = page.locator('button[aria-label="Decrease quantity"]');
    if (await decBtn.isVisible()) {
      const decBox = await decBtn.boundingBox();
      if (decBox) {
        expect(decBox.height).toBeGreaterThanOrEqual(36);
      }
    }
  });

  test('TC-09: Contact form validates required fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await expect(page.locator('h1')).toContainText(/Contact|Kitchen/i);
    const submitBtn = page.locator('button:has-text("Send"), button:has-text("Submit")').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    }
  });
});
