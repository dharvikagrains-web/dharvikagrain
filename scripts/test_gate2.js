/**
 * GATE 2 Verification & Security Test Suite
 * Tests CUSTOMER, ADMIN, OWNER role permissions, RLS policies, and unauthorized attempts.
 */

const { db, isCustomer, isAdmin, isOwner, canAccessAdmin, canManageRoles } = require('../src/lib/db');
const { signSession, verifySession } = require('../src/lib/auth/session');
const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('================================================================');
  console.log('STARTING GATE 2 — CUSTOMER PROFILE & ROLE ARCHITECTURE TESTS');
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
  console.log('\n--- 1. Database & Migration Inspection ---');
  const migrationPath = path.join(__dirname, '../supabase/migrations/20260924000001_create_profiles_and_rls.sql');
  const migrationExists = fs.existsSync(migrationPath);
  assert(migrationExists, 'Migration file 20260924000001_create_profiles_and_rls.sql exists');

  const migrationSql = fs.readFileSync(migrationPath, 'utf8');
  assert(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.profiles'), 'Migration defines public.profiles table');
  assert(migrationSql.includes('REFERENCES auth.users(id) ON DELETE CASCADE'), 'Profile id references auth.users(id)');
  assert(migrationSql.includes("CHECK (role IN ('CUSTOMER', 'ADMIN', 'OWNER'))"), 'Profile enforces 3-role CHECK constraint');
  assert(migrationSql.includes('ENABLE ROW LEVEL SECURITY'), 'RLS is explicitly enabled on public.profiles');
  assert(migrationSql.includes('CREATE POLICY "profiles_select_own_or_admin"'), 'SELECT RLS policy created');
  assert(migrationSql.includes('CREATE POLICY "profiles_update_own_or_admin"'), 'UPDATE RLS policy with role checks created');
  assert(migrationSql.includes('CREATE TRIGGER on_auth_user_created'), 'Auto-profile creation trigger created');
  assert(migrationSql.includes('CREATE TRIGGER tr_prevent_role_escalation'), 'Role escalation prevention trigger created');

  // ---------------------------------------------------------------------------
  // 2. Multi-Role Profiles Seeding & Structure
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Profile Structure & Initial State ---');
  const adminProfile = db.getProfileById('usr_admin_001');
  const ownerProfile = db.getProfileById('usr_owner_001');
  const customerProfile = db.getProfileById('usr_cust_001');

  assert(customerProfile && customerProfile.role === 'CUSTOMER', 'Customer profile exists with role CUSTOMER');
  assert(adminProfile && adminProfile.role === 'ADMIN', 'Admin profile exists with role ADMIN');
  assert(ownerProfile && ownerProfile.role === 'OWNER', 'Owner profile exists with role OWNER');

  // ---------------------------------------------------------------------------
  // 3. CUSTOMER Permissions & Unauthorized Attempts
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. Customer Role Isolation & Boundaries ---');

  // Customer accesses own profile -> ALLOWED
  const custOwn = db.getProfileById('usr_cust_001', { id: 'usr_cust_001', role: 'CUSTOMER' });
  assert(custOwn && custOwn.id === 'usr_cust_001', 'Customer can access own profile');

  // Customer accesses another customer's profile -> REJECTED
  const custOther = db.getProfileById('usr_admin_001', { id: 'usr_cust_001', role: 'CUSTOMER' });
  assert(custOther === undefined, 'Customer CANNOT access another user profile (isolated)');

  // Customer updates own profile details -> ALLOWED
  const custUpdateSelf = db.updateProfile(
    'usr_cust_001',
    { fullName: 'Pavan G. (Updated)', phone: '9876500000' },
    { id: 'usr_cust_001', role: 'CUSTOMER' }
  );
  assert(custUpdateSelf.success && custUpdateSelf.profile.fullName === 'Pavan G. (Updated)', 'Customer can update own profile details');

  // Customer attempts to update another customer's profile -> FORBIDDEN
  const custUpdateOther = db.updateProfile(
    'usr_owner_001',
    { fullName: 'Hacked Name' },
    { id: 'usr_cust_001', role: 'CUSTOMER' }
  );
  assert(!custUpdateOther.success && custUpdateOther.error.includes('Unauthorized'), 'Customer CANNOT update another customer\'s profile');

  // Customer attempts role escalation to ADMIN -> FORBIDDEN
  const custEscalateAdmin = db.updateProfile(
    'usr_cust_001',
    { role: 'ADMIN' },
    { id: 'usr_cust_001', role: 'CUSTOMER' }
  );
  assert(!custEscalateAdmin.success && custEscalateAdmin.error.includes('Customers cannot change their own role'), 'Customer CANNOT escalate own role to ADMIN');

  // Customer attempts role escalation to OWNER -> FORBIDDEN
  const custEscalateOwner = db.updateProfile(
    'usr_cust_001',
    { role: 'OWNER' },
    { id: 'usr_cust_001', role: 'CUSTOMER' }
  );
  assert(!custEscalateOwner.success, 'Customer CANNOT escalate own role to OWNER');

  // Customer admin access check -> DENIED
  assert(!canAccessAdmin('CUSTOMER'), 'Customer cannot access admin functionality');

  // ---------------------------------------------------------------------------
  // 4. ADMIN Permissions & Boundaries
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. Admin Role Capabilities & Boundaries ---');

  // Admin access check -> ALLOWED
  assert(canAccessAdmin('ADMIN'), 'Admin can access administrative functionality');

  // Admin views another customer's profile -> ALLOWED
  const adminViewCust = db.getProfileById('usr_cust_001', { id: 'usr_admin_001', role: 'ADMIN' });
  assert(adminViewCust && adminViewCust.id === 'usr_cust_001', 'Admin can view customer profiles');

  // Admin updates customer profile details -> ALLOWED
  const adminUpdateCust = db.updateProfile(
    'usr_cust_001',
    { phone: '9999999999' },
    { id: 'usr_admin_001', role: 'ADMIN' }
  );
  assert(adminUpdateCust.success, 'Admin can perform authorized administrative updates');

  // Admin attempts to promote customer to OWNER -> FORBIDDEN
  const adminPromoteToOwner = db.updateProfile(
    'usr_cust_001',
    { role: 'OWNER' },
    { id: 'usr_admin_001', role: 'ADMIN' }
  );
  assert(!adminPromoteToOwner.success && adminPromoteToOwner.error.includes('Admins cannot promote users to Owner'), 'Admin CANNOT promote anyone to OWNER');

  // Admin attempts to modify OWNER profile -> FORBIDDEN
  const adminModifyOwner = db.updateProfile(
    'usr_owner_001',
    { fullName: 'Compromised Owner' },
    { id: 'usr_admin_001', role: 'ADMIN' }
  );
  assert(!adminModifyOwner.success && adminModifyOwner.error.includes('Admins cannot modify Owner profiles'), 'Admin CANNOT modify Owner profile');

  // ---------------------------------------------------------------------------
  // 5. OWNER Permissions & Configuration Management
  // ---------------------------------------------------------------------------
  console.log('\n--- 5. Owner Role Management & Authority ---');

  // Owner admin access -> ALLOWED
  assert(canAccessAdmin('OWNER'), 'Owner can access administrative functionality');

  // Owner role management access -> ALLOWED
  assert(canManageRoles('OWNER'), 'Owner can manage roles and configurations');

  // Owner promotes customer to ADMIN -> ALLOWED
  const ownerPromote = db.updateProfile(
    'usr_cust_001',
    { role: 'ADMIN' },
    { id: 'usr_owner_001', role: 'OWNER' }
  );
  assert(ownerPromote.success && ownerPromote.profile.role === 'ADMIN', 'Owner can promote user to ADMIN');

  // Owner demotes back to CUSTOMER -> ALLOWED
  const ownerDemote = db.updateProfile(
    'usr_cust_001',
    { role: 'CUSTOMER' },
    { id: 'usr_owner_001', role: 'OWNER' }
  );
  assert(ownerDemote.success && ownerDemote.profile.role === 'CUSTOMER', 'Owner can reset user back to CUSTOMER');

  // ---------------------------------------------------------------------------
  // 6. Summary
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
