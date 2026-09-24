/**
 * GATE 4 Verification & Security Test Suite
 * Tests Inventory & Batch Management, Traceability, Expired Batch Handling,
 * Invalid Quantities, Concurrent / Duplicate Operations, and Role Restrictions.
 */

const { db, isAdmin, isOwner, isCustomer } = require('../src/lib/db');
const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('================================================================');
  console.log('STARTING GATE 4 — INVENTORY & BATCH MANAGEMENT TESTS');
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
  const migrationPath = path.join(__dirname, '../supabase/migrations/20260924000003_create_inventory_and_batches_rls.sql');
  assert(fs.existsSync(migrationPath), 'Migration file 20260924000003_create_inventory_and_batches_rls.sql exists');

  const migrationSql = fs.readFileSync(migrationPath, 'utf8');
  assert(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.batches'), 'Batches table created');
  assert(migrationSql.includes('CHECK (expiry_date >= manufacturing_date)'), 'Date integrity constraint on batches');
  assert(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.inventory'), 'Traceable inventory table created');
  assert(migrationSql.includes('stock_received INT NOT NULL DEFAULT 0'), 'Tracks stock received');
  assert(migrationSql.includes('stock_reserved INT NOT NULL DEFAULT 0'), 'Tracks stock reserved');
  assert(migrationSql.includes('stock_sold INT NOT NULL DEFAULT 0'), 'Tracks stock sold');
  assert(migrationSql.includes('stock_adjusted INT NOT NULL DEFAULT 0'), 'Tracks stock adjusted');
  assert(migrationSql.includes('stock_returned INT NOT NULL DEFAULT 0'), 'Tracks stock returned');
  assert(migrationSql.includes('CHECK (stock >= 0)'), 'Non-negative stock constraint enforced');
  assert(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.inventory_transactions'), 'Append-only ledger table created');
  assert(migrationSql.includes('ENABLE ROW LEVEL SECURITY'), 'RLS enabled on batches, inventory, and ledger');

  // ---------------------------------------------------------------------------
  // 2. Batch Creation & Structure
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Batch Lifecycle & Date Validation ---');
  const adminActor = { id: 'usr_admin_001', role: 'ADMIN', email: 'admin@dharvikagrains.in' };
  const ownerActor = { id: 'usr_owner_001', role: 'OWNER', email: 'owner@dharvikagrains.in' };
  const customerActor = { id: 'usr_cust_001', role: 'CUSTOMER', email: 'cust@example.com' };

  // Create valid active batch
  const validBatch = db.createBatch({
    batchNumber: 'DG-TEST-VAL-2026',
    productId: 'millet-korralu',
    productName: 'Korralu (Foxtail Millet)',
    cropName: 'Foxtail Millet',
    manufacturingDate: '2026-08-01',
    expiryDate: '2027-07-31',
    sourceRegion: 'Ananthapuramu Cluster',
    qualityPassed: true,
    totalQuantityKg: 1000,
    remainingQuantityKg: 1000,
    status: 'ACTIVE'
  }, adminActor.email);

  assert(validBatch.batchNumber === 'DG-TEST-VAL-2026', 'Valid batch registered successfully');
  assert(validBatch.manufacturingDate === '2026-08-01', 'Supports manufacturing date');
  assert(validBatch.expiryDate === '2027-07-31', 'Supports expiry date');
  assert(validBatch.status === 'ACTIVE', 'Batch status is ACTIVE');

  // Create an expired batch for test cases
  const expiredBatch = db.createBatch({
    batchNumber: 'DG-TEST-EXP-2024',
    productId: 'millet-korralu',
    productName: 'Korralu (Foxtail Millet)',
    cropName: 'Foxtail Millet',
    manufacturingDate: '2024-01-01',
    expiryDate: '2025-01-01', // Past date
    sourceRegion: 'Ananthapuramu Cluster',
    qualityPassed: true,
    totalQuantityKg: 500,
    remainingQuantityKg: 500,
    status: 'EXPIRED'
  }, adminActor.email);

  assert(db.isBatchExpired(expiredBatch), 'Expired batch correctly identified as EXPIRED');

  // ---------------------------------------------------------------------------
  // 3. Traceable Stock Addition (Add Stock)
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. Stock Addition & Traceability ---');
  const targetSku = 'KORRALU-FOXTAIL-MILLET-500G';
  const initialInv = db.getInventoryItem(targetSku);
  const initialStock = initialInv.stock;
  const initialReceived = initialInv.stockReceived;

  // Add 50 units from valid batch
  const addResult = db.addStock(targetSku, 50, validBatch.batchNumber, adminActor, 'Fresh harvest restock');
  assert(addResult.success, 'Admin can add stock with valid batch');
  assert(addResult.inventory.stockReceived === initialReceived + 50, 'Stock received increased by exactly 50');
  assert(addResult.inventory.stock === initialStock + 50, `Available stock increased to ${initialStock + 50}`);

  // Check ledger transaction created
  const txList = db.getInventoryTransactions(targetSku);
  const latestTx = txList[0];
  assert(latestTx.type === 'STOCK_RECEIVED' && latestTx.quantity === 50, 'STOCK_RECEIVED ledger transaction recorded');
  assert(latestTx.batchNumber === validBatch.batchNumber, 'Ledger transaction linked to batch number');

  // ---------------------------------------------------------------------------
  // 4. Invalid Quantity Tests
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. Invalid Quantity Handling ---');
  const zeroAdd = db.addStock(targetSku, 0, validBatch.batchNumber, adminActor);
  assert(!zeroAdd.success && zeroAdd.error.includes('Invalid quantity'), 'Rejects zero quantity addition');

  const negAdd = db.addStock(targetSku, -15, validBatch.batchNumber, adminActor);
  assert(!negAdd.success && negAdd.error.includes('Invalid quantity'), 'Rejects negative quantity addition');

  const floatAdd = db.addStock(targetSku, 12.5, validBatch.batchNumber, adminActor);
  assert(!floatAdd.success && floatAdd.error.includes('Invalid quantity'), 'Rejects fractional/float quantity addition');

  // ---------------------------------------------------------------------------
  // 5. Expired Batch Handling
  // ---------------------------------------------------------------------------
  console.log('\n--- 5. Expired Batch Protection ---');
  const expAddResult = db.addStock(targetSku, 20, expiredBatch.batchNumber, adminActor);
  assert(!expAddResult.success && expAddResult.error.includes('Expired batch'), 'Strictly rejects adding stock from expired batch');

  // Attempt to reserve stock from an expired batch
  initialInv.batchNumber = expiredBatch.batchNumber;
  const expReserveResult = db.reserveInventory([{ sku: targetSku, quantity: 1 }], 'DG-EXP-ORD');
  assert(!expReserveResult.success && expReserveResult.error.includes('Expired batch'), 'Strictly rejects customer reservation from expired batch');

  // Restore valid batch
  initialInv.batchNumber = validBatch.batchNumber;

  // ---------------------------------------------------------------------------
  // 6. Traceable Stock Deduction (Deduct Stock / Sale)
  // ---------------------------------------------------------------------------
  console.log('\n--- 6. Stock Deduction & Overselling Protection ---');
  const stockBeforeDeduct = initialInv.stock;
  const deductResult = db.deductStock(targetSku, 10, 'STOCK_SOLD', adminActor, 'DG-ORDER-1001', 'Order fulfilled');
  assert(deductResult.success, 'Admin can deduct sold stock');
  assert(deductResult.inventory.stock === stockBeforeDeduct - 10, 'Stock reduced by exactly 10 units');
  assert(deductResult.inventory.stockSold === 10, 'stockSold tracked accurately');

  // Oversell attempt (exceeding stock)
  const hugeDeduct = db.deductStock(targetSku, 999999, 'STOCK_SOLD', adminActor);
  assert(!hugeDeduct.success && hugeDeduct.error.includes('Insufficient stock'), 'Rejects deduction exceeding available stock (no negative stock)');

  // ---------------------------------------------------------------------------
  // 7. Atomic Reservations & Release
  // ---------------------------------------------------------------------------
  console.log('\n--- 7. Atomic Stock Reservations & Releases ---');
  const stockBeforeReserve = initialInv.stock;
  const reservedBefore = initialInv.stockReserved;

  const reserveResult = db.reserveInventory([{ sku: targetSku, quantity: 5 }], 'DG-TEST-RES-1');
  assert(reserveResult.success, 'Atomically reserves stock for pending order');
  assert(initialInv.stockReserved === reservedBefore + 5, 'stockReserved incremented');

  // Release reservation (e.g. cart abandoned or payment failed)
  db.releaseInventory([{ sku: targetSku, quantity: 5 }], 'DG-TEST-RES-1');
  assert(initialInv.stockReserved === reservedBefore, 'stockReserved decremented upon release');

  // ---------------------------------------------------------------------------
  // 8. Customer Role Authorization Checks
  // ---------------------------------------------------------------------------
  console.log('\n--- 8. Role Authorization & Customer Boundaries ---');
  const custAdd = db.addStock(targetSku, 10, validBatch.batchNumber, customerActor);
  assert(!custAdd.success && custAdd.error.includes('Unauthorized'), 'Customer CANNOT add stock (403)');

  const custDeduct = db.deductStock(targetSku, 5, 'STOCK_SOLD', customerActor);
  assert(!custDeduct.success && custDeduct.error.includes('Unauthorized'), 'Customer CANNOT deduct stock (403)');

  const custReturn = db.returnStock(targetSku, 2, 'DG-ORD-1', customerActor);
  assert(!custReturn.success && custReturn.error.includes('Unauthorized'), 'Customer CANNOT manually modify return stock (403)');

  // ---------------------------------------------------------------------------
  // 9. Concurrent / Duplicate Operations Protection
  // ---------------------------------------------------------------------------
  console.log('\n--- 9. Concurrent / Duplicate Inventory Safety ---');
  // Attempt two simultaneous reservations where each requests more than half the stock
  const currentAvailable = initialInv.stock - initialInv.stockReserved;
  const chunk = Math.ceil(currentAvailable * 0.6); // 60% of stock

  const firstReservation = db.reserveInventory([{ sku: targetSku, quantity: chunk }], 'DG-CONC-1');
  assert(firstReservation.success, 'First concurrent reservation succeeds');

  const secondReservation = db.reserveInventory([{ sku: targetSku, quantity: chunk }], 'DG-CONC-2');
  assert(!secondReservation.success && secondReservation.error.includes('Insufficient stock'), 'Second overlapping reservation safely rejected (prevents oversell)');

  // Clean up test reservation
  db.releaseInventory([{ sku: targetSku, quantity: chunk }], 'DG-CONC-1');

  // ---------------------------------------------------------------------------
  // 10. Summary
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`GATE 4 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
