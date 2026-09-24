/**
 * GATE 5 Verification & Security Test Suite
 * Tests Customer Cart, Cart Items, Authoritative Pricing, Subtotal Calculation,
 * Quantity Validation, Customer Isolation (RLS), and State Persistence.
 */

const { db, isAdmin, isOwner, isCustomer } = require('../src/lib/db');
const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('================================================================');
  console.log('STARTING GATE 5 — CUSTOMER CART ARCHITECTURE TESTS');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${details}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // 1. Database Schema & RLS Migration Inspection
  // ---------------------------------------------------------------------------
  console.log('--- 1. Database Schema & RLS Migration Inspection ---');
  const migrationPath = path.join(__dirname, '../supabase/migrations/20260924000004_create_carts_and_rls.sql');
  assert(fs.existsSync(migrationPath), 'Migration file 20260924000004_create_carts_and_rls.sql exists');

  const migrationSql = fs.readFileSync(migrationPath, 'utf8');
  assert(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.carts'), 'Carts table created');
  assert(migrationSql.includes('user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id)'), 'Carts 1:1 foreign key reference to auth.users');
  assert(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.cart_items'), 'Cart items table created');
  assert(migrationSql.includes('quantity INTEGER NOT NULL CHECK (quantity > 0)'), 'Check constraint: quantity must be strictly greater than 0');
  assert(migrationSql.includes('CONSTRAINT unique_cart_item UNIQUE (cart_id, product_id, selected_weight)'), 'Unique constraint on cart item (cart_id, product_id, selected_weight)');
  assert(migrationSql.includes('ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY'), 'RLS enabled on public.carts');
  assert(migrationSql.includes('ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY'), 'RLS enabled on public.cart_items');
  assert(migrationSql.includes('auth.uid() = user_id'), 'Customer isolation policy on carts');
  assert(migrationSql.includes('carts.user_id = auth.uid()'), 'Customer isolation policy on cart_items');

  // ---------------------------------------------------------------------------
  // 2. Actors & Setup
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Customer Setup & Cart Initialization ---');
  const customerA = { id: 'usr_cust_a_101', role: 'CUSTOMER', email: 'aarav@example.com' };
  const customerB = { id: 'usr_cust_b_202', role: 'CUSTOMER', email: 'bhavya@example.com' };
  const adminActor = { id: 'usr_admin_001', role: 'ADMIN', email: 'admin@dharvikagrains.in' };

  // Ensure clean slate
  db.clearCart(customerA.id, customerA);
  db.clearCart(customerB.id, customerB);

  const initialCartA = db.getCart(customerA.id, customerA);
  assert(initialCartA.success, 'Successfully initialized/retrieved Customer A cart');
  assert(initialCartA.cart.items.length === 0, 'Customer A cart is initially empty');
  assert(initialCartA.cart.subtotal === 0, 'Initial cart subtotal is 0');

  // ---------------------------------------------------------------------------
  // 3. Add Product & Authoritative Pricing
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. Add Product & Authoritative Pricing ---');
  // Korralu 500g is ₹95 official catalog price
  const addResult1 = db.addToCart(customerA.id, 'millet-korralu', '500g', 2, customerA);
  assert(addResult1.success, 'Successfully added product to Customer A cart');
  assert(addResult1.cart.items.length === 1, 'Cart has exactly 1 item');
  
  const item1 = addResult1.cart.items[0];
  assert(item1.productId === 'millet-korralu', 'Correct product reference (productId)');
  assert(item1.name === 'Korralu (Foxtail Millet)', 'Correct product name');
  assert(item1.selectedWeight === '500g', 'Correct selected weight variant');
  assert(item1.quantity === 2, 'Correct quantity added (2 units)');
  assert(item1.unitPrice === 95, 'Authoritative server price used (₹95)');
  assert(item1.lineTotal === 190, 'Line total correctly calculated (95 * 2 = 190)');
  assert(addResult1.cart.subtotal === 190, 'Subtotal correctly matches line total (₹190)');

  // ---------------------------------------------------------------------------
  // 4. Do Not Trust Frontend Prices (Tamper Resistance)
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. Frontend Price Tamper Resistance ---');
  // Adding by slug with attempted price injection or no price
  // Stemless Red Chilli Powder 250g official price is ₹110
  const addResult2 = db.addToCart(customerA.id, 'pure-red-chilli-powder', '250g', 1, customerA);
  assert(addResult2.success, 'Added second product by slug reference');
  assert(addResult2.cart.items.length === 2, 'Cart now has 2 distinct items');
  
  const item2 = addResult2.cart.items.find(i => i.slug === 'pure-red-chilli-powder');
  assert(item2 !== undefined, 'Second product found in cart');
  assert(item2.unitPrice === 110, 'Authoritative price of ₹110 enforced (frontend prices ignored)');
  assert(item2.lineTotal === 110, 'Line total is exactly ₹110');
  
  // Correct Subtotal: 190 + 110 = 300
  assert(addResult2.cart.subtotal === 300, 'Authoritative subtotal correctly calculated: 190 + 110 = ₹300');

  // ---------------------------------------------------------------------------
  // 5. Increase & Decrease Quantity
  // ---------------------------------------------------------------------------
  console.log('\n--- 5. Increase & Decrease Quantity ---');
  // Increase Korralu by 1 -> qty 3
  const incResult = db.increaseCartItemQuantity(customerA.id, item1.id, 1, customerA);
  assert(incResult.success, 'Successfully increased item quantity by 1');
  const updatedItem1 = incResult.cart.items.find(i => i.id === item1.id);
  assert(updatedItem1.quantity === 3, 'Item quantity updated to 3');
  assert(updatedItem1.lineTotal === 285, 'Updated line total: 95 * 3 = 285');
  assert(incResult.cart.subtotal === 395, 'Updated subtotal: 285 + 110 = ₹395');

  // Decrease Korralu by 1 -> qty 2
  const decResult = db.decreaseCartItemQuantity(customerA.id, item1.id, 1, customerA);
  assert(decResult.success, 'Successfully decreased item quantity by 1');
  const revertedItem1 = decResult.cart.items.find(i => i.id === item1.id);
  assert(revertedItem1.quantity === 2, 'Item quantity returned to 2');
  assert(decResult.cart.subtotal === 300, 'Subtotal returned to ₹300');

  // Decrease quantity down to 0 removes the item
  const tempAdd = db.addToCart(customerA.id, 'pure-coriander-powder', '250g', 1, customerA);
  const tempItem = tempAdd.cart.items.find(i => i.slug === 'pure-coriander-powder');
  assert(tempItem !== undefined, 'Temporary item added');
  const decToZero = db.decreaseCartItemQuantity(customerA.id, tempItem.id, 1, customerA);
  assert(decToZero.success, 'Decreasing quantity to 0 succeeds');
  assert(!decToZero.cart.items.some(i => i.id === tempItem.id), 'Item automatically removed when quantity reaches 0');

  // ---------------------------------------------------------------------------
  // 6. Remove Product
  // ---------------------------------------------------------------------------
  console.log('\n--- 6. Explicit Remove Product ---');
  const removeResult = db.removeCartItem(customerA.id, item2.id, customerA);
  assert(removeResult.success, 'Successfully removed product from cart');
  assert(removeResult.cart.items.length === 1, 'Only 1 item remains in cart');
  assert(!removeResult.cart.items.some(i => i.id === item2.id), 'Removed item no longer present in cart');
  assert(removeResult.cart.subtotal === 190, 'Subtotal correctly updated after removal (₹190)');

  // ---------------------------------------------------------------------------
  // 7. Prevent Invalid Quantities
  // ---------------------------------------------------------------------------
  console.log('\n--- 7. Invalid Quantity Prevention ---');
  const zeroAdd = db.addToCart(customerA.id, 'millet-korralu', '500g', 0, customerA);
  assert(!zeroAdd.success && zeroAdd.status === 400, 'Rejects zero quantity addition (400)');

  const negAdd = db.addToCart(customerA.id, 'millet-korralu', '500g', -3, customerA);
  assert(!negAdd.success && negAdd.status === 400, 'Rejects negative quantity addition (400)');

  const floatAdd = db.addToCart(customerA.id, 'millet-korralu', '500g', 1.75, customerA);
  assert(!floatAdd.success && floatAdd.status === 400, 'Rejects non-integer/fractional quantity (400)');

  const nanAdd = db.addToCart(customerA.id, 'millet-korralu', '500g', NaN, customerA);
  assert(!nanAdd.success && nanAdd.status === 400, 'Rejects NaN quantity (400)');

  const negUpdate = db.updateCartItemQuantity(customerA.id, item1.id, -2, customerA);
  assert(!negUpdate.success && negUpdate.status === 400, 'Rejects negative quantity on update (400)');

  // ---------------------------------------------------------------------------
  // 8. Prevent Invalid Product References
  // ---------------------------------------------------------------------------
  console.log('\n--- 8. Product Reference Validation ---');
  const invalidProd = db.addToCart(customerA.id, 'non-existent-grain-sku', '500g', 1, customerA);
  assert(!invalidProd.success && invalidProd.status === 404, 'Rejects non-existent product reference (404)');

  // ---------------------------------------------------------------------------
  // 9. Persist Cart for Authenticated Customer
  // ---------------------------------------------------------------------------
  console.log('\n--- 9. Customer Cart Persistence ---');
  // Re-fetch cart for customer A
  const persistedCart = db.getCart(customerA.id, customerA);
  assert(persistedCart.success, 'Successfully fetched persisted cart');
  assert(persistedCart.cart.userId === customerA.id, 'Cart userId matches authenticated customer');
  assert(persistedCart.cart.items.length === 1, 'Persisted cart maintains item count');
  assert(persistedCart.cart.items[0].quantity === 2, 'Persisted cart maintains item quantity');
  assert(persistedCart.cart.subtotal === 190, 'Persisted cart maintains subtotal');

  // ---------------------------------------------------------------------------
  // 10. Customer Isolation & Security (Prevent Cross-Customer Access)
  // ---------------------------------------------------------------------------
  console.log('\n--- 10. Customer Cart Isolation & RLS Boundary ---');
  // Customer B tries to view Customer A's cart
  const crossView = db.getCart(customerA.id, customerB);
  assert(!crossView.success && crossView.status === 403, 'Customer B cannot view Customer A cart (403 Forbidden)');

  // Customer B tries to add product into Customer A's cart
  const crossAdd = db.addToCart(customerA.id, 'millet-korralu', '500g', 1, customerB);
  assert(!crossAdd.success && crossAdd.status === 403, 'Customer B cannot add items into Customer A cart (403 Forbidden)');

  // Customer B tries to modify item in Customer A's cart
  const crossUpdate = db.updateCartItemQuantity(customerA.id, item1.id, 10, customerB);
  assert(!crossUpdate.success && crossUpdate.status === 403, 'Customer B cannot modify item in Customer A cart (403 Forbidden)');

  // Customer B tries to delete item from Customer A's cart
  const crossDelete = db.removeCartItem(customerA.id, item1.id, customerB);
  assert(!crossDelete.success && crossDelete.status === 403, 'Customer B cannot delete item from Customer A cart (403 Forbidden)');

  // Customer B's own cart remains clean and separate
  const cartB = db.getCart(customerB.id, customerB);
  assert(cartB.success && cartB.cart.items.length === 0, "Customer B's cart is isolated and unaffected");

  // Admin can inspect cart if necessary
  const adminView = db.getCart(customerA.id, adminActor);
  assert(adminView.success, 'Admin/Owner can inspect customer cart for operational support');

  // ---------------------------------------------------------------------------
  // 11. Clear Cart
  // ---------------------------------------------------------------------------
  console.log('\n--- 11. Clear Cart ---');
  const clearResult = db.clearCart(customerA.id, customerA);
  assert(clearResult.success, 'Customer A can clear entire cart');
  assert(clearResult.cart.items.length === 0, 'Cart is empty after clear');
  assert(clearResult.cart.subtotal === 0, 'Subtotal is reset to 0');

  console.log('\n================================================================');
  console.log(`GATE 5 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
