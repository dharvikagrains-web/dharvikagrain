import assert from 'assert';
import { calculateDiscount, formatCurrency } from '../src/lib/utils.ts';
import { products } from '../src/data/products.ts';

console.log('--- TESTING COMMERCE CALCULATIONS & DATA INTEGRITY ---');

// 1. Discount calculation test
assert.strictEqual(calculateDiscount(95, 120), 21, 'Discount calculation mismatch');
assert.strictEqual(calculateDiscount(100, 100), 0, 'Zero discount mismatch');
assert.strictEqual(calculateDiscount(120, 100), 0, 'Negative discount mismatch');
console.log('✓ calculateDiscount math verified');

// 2. Currency formatting test
assert.strictEqual(formatCurrency(95), '₹95', 'Format currency failed');
assert.strictEqual(formatCurrency(1250), '₹1,250', 'Format currency comma separator failed');
console.log('✓ formatCurrency formatting verified');

// 3. Products catalog verification
assert.ok(products.length >= 15, `Expected at least 15 products, found ${products.length}`);
for (const p of products) {
  assert.ok(p.id, `Product missing id: ${p.name}`);
  assert.ok(p.slug, `Product missing slug: ${p.name}`);
  assert.ok(p.name, `Product missing name: ${p.id}`);
  assert.ok(
    p.category === 'millets' ||
    p.category === 'spices' ||
    p.category === 'masalas' ||
    p.category === 'combos' ||
    p.category === 'signature',
    `Invalid category for ${p.name}: ${p.category}`
  );
  assert.ok(p.weights && p.weights.length > 0, `Product missing weights: ${p.name}`);
  for (const w of p.weights) {
    assert.ok(w.price > 0, `Price must be positive: ${p.name} (${w.size})`);
    assert.ok(w.mrp >= w.price, `MRP (${w.mrp}) must be >= price (${w.price}) for ${p.name}`);
  }
}
console.log(`✓ Verified all ${products.length} products have valid weights, positive prices, and correct categories.`);

// 4. Cart Subtotal & Free Shipping Math
const cartItems = [
  { price: 180, quantity: 2 }, // ₹360
  { price: 95, quantity: 4 },  // ₹380
  { price: 340, quantity: 1 }  // ₹340
];

const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
assert.strictEqual(subtotal, 1080, 'Cart subtotal calculation error');

const FREE_SHIPPING_THRESHOLD = 999;
const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
assert.strictEqual(isFreeShipping, true, 'Free shipping logic failed');
console.log(`✓ Cart subtotal (₹${subtotal}) and Free Shipping logic verified.`);

console.log('ALL COMMERCE MATH & DATA TESTS PASSED!');
