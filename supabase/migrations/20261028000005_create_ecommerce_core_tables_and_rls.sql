-- =============================================================================
-- DHARVIKA GRAINS — Comprehensive Ecommerce Core Schema & RLS Migration
-- Migration: 20261028000005_create_ecommerce_core_tables_and_rls.sql
-- Status: DESIGN DRAFT ONLY (Reviewed & Audited — Do not apply without approval)
-- =============================================================================
-- This migration designs the persistent PostgreSQL schema for:
--   1. Product catalog enrichment (weights JSONB, nutrition, cooking guides)
--   2. Product ID reconciliation (ensuring TEXT compatibility with canonical IDs)
--   3. Saved customer addresses (saved_addresses)
--   4. Orders and line items (orders, order_items)
--   5. Payments and webhook audit trail (payments, payment_events)
--   6. Coupons and user usage records (coupons, coupon_usage_records)
--   7. Customer reviews and return requests (reviews, return_requests)
--   8. Append-only administrative audit trail (audit_logs)
--   9. Ephemeral OTP verification ledger (otp_verifications)
--  10. Non-recursive, least-privilege Row Level Security (RLS) policies
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Helper Security Definer Functions & Order Number Sequence
-- -----------------------------------------------------------------------------

-- Secure handle_updated_at with explicit search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Explicitly restrict handle_updated_at permissions (Trigger function only)
REVOKE ALL ON FUNCTION public.handle_updated_at() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Concurrency-Safe Order Number Sequence & Generator Function
-- Format: DG-YYYY-XXXXXX (e.g. DG-2026-001001), expands naturally beyond 999,999
-- -----------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq
  START WITH 1001
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

-- Generator function creates atomic, sequential, collision-free order numbers.
-- Defined as SECURITY DEFINER with fixed search_path = public so that callers
-- do not need direct USAGE or SELECT permissions on the sequence itself.
-- Uses CASE with LPAD to guarantee minimum 6-digit zero-padding without right-truncation.
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE sql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'DG-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
    CASE 
      WHEN val < 1000000 THEN LPAD(val::TEXT, 6, '0')
      ELSE val::TEXT
    END
  FROM (SELECT nextval('public.order_number_seq') AS val) seq_val;
$$;

-- Restrict execute on order-number generator:
-- Authenticated users invoke this indirectly through column default on orders insert.
-- PUBLIC is revoked to prevent unauthenticated sequence draining or enumeration.
REVOKE ALL ON FUNCTION public.generate_order_number() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.generate_order_number() TO authenticated, service_role;

-- Restrict direct sequence access:
-- PUBLIC, anon, and authenticated are revoked to prevent direct nextval() draining.
-- Direct sequence privileges are reserved exclusively for service_role and function owner.
REVOKE ALL ON SEQUENCE public.order_number_seq FROM PUBLIC, anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.order_number_seq TO service_role;

-- -----------------------------------------------------------------------------
-- 2. Product Catalog Alignment & Rich Content Preservation
-- -----------------------------------------------------------------------------

-- Safely reconcile products.id to TEXT if previously defined as UUID, preserving any existing IDs
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'products' 
      AND column_name = 'id' 
      AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT;
    ALTER TABLE public.products ALTER COLUMN id TYPE TEXT USING id::text;
    ALTER TABLE public.products ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
  END IF;
END $$;

-- Enrich products table with complete rich storefront attributes
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS local_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS short_description TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS weights JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS ingredients TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS origin_details TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS processing_details TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS cooking_instructions TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS culinary_uses TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS storage_instructions TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS nutrition_facts JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS batch_info JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS lab_test_details TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2),
  ADD COLUMN IF NOT EXISTS review_count INT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_products_bestseller ON public.products(is_bestseller) WHERE is_bestseller = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = true;

-- -----------------------------------------------------------------------------
-- 3. Customer Saved Addresses Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Home' CHECK (type IN ('Home', 'Work', 'Other')),
  is_default BOOLEAN NOT NULL DEFAULT false,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  pincode TEXT NOT NULL,
  house_flat TEXT NOT NULL,
  street_area TEXT NOT NULL,
  landmark TEXT,
  city TEXT NOT NULL DEFAULT 'Hyderabad',
  state TEXT NOT NULL DEFAULT 'Telangana',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_saved_addresses_user_id ON public.saved_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_addresses_email ON public.saved_addresses(user_email);

-- -----------------------------------------------------------------------------
-- 4. Coupons & Coupon Usages Tables
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
  code TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'PERCENTAGE' CHECK (type IN ('PERCENTAGE', 'FIXED')),
  discount_percent NUMERIC(5, 2) CHECK (discount_percent IS NULL OR (discount_percent >= 0 AND discount_percent <= 100)),
  discount_amount NUMERIC(10, 2) CHECK (discount_amount IS NULL OR discount_amount >= 0),
  min_order_value NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (min_order_value >= 0),
  max_discount NUMERIC(10, 2) CHECK (max_discount IS NULL OR max_discount >= 0),
  description TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  usage_limit INT NOT NULL DEFAULT 500 CHECK (usage_limit >= 0),
  times_used INT NOT NULL DEFAULT 0 CHECK (times_used >= 0),
  per_user_limit INT NOT NULL DEFAULT 1 CHECK (per_user_limit >= 1),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_expiry ON public.coupons(expiry_date);

CREATE TABLE IF NOT EXISTS public.coupon_usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_code TEXT NOT NULL REFERENCES public.coupons(code) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  order_number TEXT NOT NULL,
  discount_applied NUMERIC(10, 2) NOT NULL CHECK (discount_applied >= 0),
  used_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_coupon_usage_code ON public.coupon_usage_records(coupon_code);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_email ON public.coupon_usage_records(customer_email);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_order ON public.coupon_usage_records(order_number);

-- -----------------------------------------------------------------------------
-- 5. Orders & Order Items Tables
-- Note: When inserting new customer orders from the application layer, omit the
-- order_number column to allow public.generate_order_number() to evaluate,
-- and retrieve the generated identifier using: RETURNING id, order_number;
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL DEFAULT public.generate_order_number(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  shipping_address_snapshot JSONB NOT NULL,
  billing_address_snapshot JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  tax NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN (
    'CREATED', 'PENDING', 'AUTHORIZED', 'CAPTURED', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'
  )),
  order_status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT' CHECK (order_status IN (
    'PENDING_PAYMENT', 'PAYMENT_FAILED', 'PAID', 'PROCESSING', 'PACKED', 
    'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUND_REQUESTED', 'REFUNDED'
  )),
  payment_method TEXT NOT NULL DEFAULT 'RAZORPAY',
  coupon_code TEXT,
  payment_id TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  shipment_id TEXT,
  courier_partner TEXT,
  tracking_id TEXT,
  awb_number TEXT,
  estimated_delivery TEXT,
  timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_mobile ON public.orders(mobile);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);

-- -----------------------------------------------------------------------------
-- Helper Security Definer Functions (Avoids RLS Recursion & Search-Path Issues)
-- Placed after public.orders table definition for LANGUAGE sql validation
-- -----------------------------------------------------------------------------

-- Helper to check if caller owns or has admin access to an order by UUID
CREATE OR REPLACE FUNCTION public.can_access_order(p_order_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = p_order_id
      AND (customer_id = auth.uid() OR public.is_admin())
  );
$$;

-- Restrict can_access_order permissions: RLS evaluation requires authenticated and service_role
REVOKE ALL ON FUNCTION public.can_access_order(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_access_order(UUID) TO authenticated, service_role;

-- Helper to check if caller owns or has admin access to an order by order number
CREATE OR REPLACE FUNCTION public.can_access_order_by_number(p_order_number TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders
    WHERE order_number = p_order_number
      AND (customer_id = auth.uid() OR public.is_admin())
  );
$$;

-- Restrict can_access_order_by_number permissions: RLS evaluation requires authenticated and service_role
REVOKE ALL ON FUNCTION public.can_access_order_by_number(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_access_order_by_number(TEXT) TO authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  product_id TEXT NOT NULL,
  slug TEXT NOT NULL DEFAULT '',
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  local_name TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  selected_weight TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  mrp NUMERIC(10, 2) NOT NULL CHECK (mrp >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  image TEXT NOT NULL,
  batch_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_number ON public.order_items(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_sku ON public.order_items(sku);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- -----------------------------------------------------------------------------
-- 6. Payments & Webhook Event Logs Tables
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  amount INT NOT NULL CHECK (amount >= 0), -- Amount in paise (e.g. 50000 = ₹500.00)
  currency TEXT NOT NULL DEFAULT 'INR',
  provider TEXT NOT NULL DEFAULT 'RAZORPAY',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  signature TEXT,
  status TEXT NOT NULL DEFAULT 'CREATED' CHECK (status IN (
    'CREATED', 'PENDING', 'AUTHORIZED', 'CAPTURED', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'
  )),
  method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_number ON public.payments(order_number);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON public.payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id ON public.payments(razorpay_payment_id);

CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id TEXT,
  order_number TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_payload JSONB NOT NULL,
  signature_verified BOOLEAN NOT NULL DEFAULT false,
  received_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_payment_events_order_number ON public.payment_events(order_number);
CREATE INDEX IF NOT EXISTS idx_payment_events_type ON public.payment_events(event_type);

-- -----------------------------------------------------------------------------
-- 7. Customer Reviews & Return Requests Tables
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON public.reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

CREATE TABLE IF NOT EXISTS public.return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL REFERENCES public.orders(order_number) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  product_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN (
    'REQUESTED', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED'
  )),
  refund_amount NUMERIC(10, 2) NOT NULL CHECK (refund_amount >= 0),
  refund_method TEXT NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_return_requests_order ON public.return_requests(order_number);
CREATE INDEX IF NOT EXISTS idx_return_requests_email ON public.return_requests(customer_email);

-- -----------------------------------------------------------------------------
-- 8. Audit Log Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_email TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp);

-- -----------------------------------------------------------------------------
-- 9. Persistent Cryptographic OTP Verification Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT UNIQUE NOT NULL, -- Normalized phone or email
  hashed_code TEXT NOT NULL,      -- Salted cryptographic HMAC/hash
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INT NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  max_attempts INT NOT NULL DEFAULT 5 CHECK (max_attempts > 0),
  last_requested_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_otp_identifier ON public.otp_verifications(identifier);
CREATE INDEX IF NOT EXISTS idx_otp_expires_at ON public.otp_verifications(expires_at);

-- -----------------------------------------------------------------------------
-- 10. Automatic Updated At Triggers
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_saved_addresses_updated ON public.saved_addresses;
CREATE TRIGGER on_saved_addresses_updated
  BEFORE UPDATE ON public.saved_addresses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_coupons_updated ON public.coupons;
CREATE TRIGGER on_coupons_updated
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_orders_updated ON public.orders;
CREATE TRIGGER on_orders_updated
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_payments_updated ON public.payments;
CREATE TRIGGER on_payments_updated
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_return_requests_updated ON public.return_requests;
CREATE TRIGGER on_return_requests_updated
  BEFORE UPDATE ON public.return_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_otp_verifications_updated ON public.otp_verifications;
CREATE TRIGGER on_otp_verifications_updated
  BEFORE UPDATE ON public.otp_verifications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 11. Row Level Security (RLS) Configuration & Explicit Permissions
-- -----------------------------------------------------------------------------

-- Enable RLS on all newly created tables
ALTER TABLE public.saved_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Explicit Table Grants for Standard Supabase Roles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_addresses TO authenticated;
GRANT SELECT ON public.coupons TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coupons TO authenticated;
GRANT SELECT, INSERT ON public.coupon_usage_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_events TO authenticated;
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.return_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.otp_verifications TO authenticated;

-- -----------------------------------------------------------------------------
-- RLS: saved_addresses (Strict Customer Isolation)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "addresses_select_own_or_admin" ON public.saved_addresses;
CREATE POLICY "addresses_select_own_or_admin" ON public.saved_addresses
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "addresses_insert_own_or_admin" ON public.saved_addresses;
CREATE POLICY "addresses_insert_own_or_admin" ON public.saved_addresses
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "addresses_update_own_or_admin" ON public.saved_addresses;
CREATE POLICY "addresses_update_own_or_admin" ON public.saved_addresses
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "addresses_delete_own_or_admin" ON public.saved_addresses;
CREATE POLICY "addresses_delete_own_or_admin" ON public.saved_addresses
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- -----------------------------------------------------------------------------
-- RLS: coupons & coupon_usage_records
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "coupons_select_active_or_admin" ON public.coupons;
CREATE POLICY "coupons_select_active_or_admin" ON public.coupons
  FOR SELECT TO public
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "coupons_admin_manage" ON public.coupons;
CREATE POLICY "coupons_admin_manage" ON public.coupons
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "coupon_usage_select_own_or_admin" ON public.coupon_usage_records;
CREATE POLICY "coupon_usage_select_own_or_admin" ON public.coupon_usage_records
  FOR SELECT TO authenticated
  USING (
    customer_email = (auth.jwt() ->> 'email')
    OR customer_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "coupon_usage_insert_admin_only" ON public.coupon_usage_records;
CREATE POLICY "coupon_usage_insert_admin_only" ON public.coupon_usage_records
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- RLS: orders
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "orders_select_own_or_admin" ON public.orders;
CREATE POLICY "orders_select_own_or_admin" ON public.orders
  FOR SELECT TO authenticated
  USING (auth.uid() = customer_id OR public.is_admin());

DROP POLICY IF EXISTS "orders_insert_customer_or_admin" ON public.orders;
CREATE POLICY "orders_insert_customer_or_admin" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = customer_id OR public.is_admin());

DROP POLICY IF EXISTS "orders_update_admin_only" ON public.orders;
CREATE POLICY "orders_update_admin_only" ON public.orders
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "orders_delete_owner_only" ON public.orders;
CREATE POLICY "orders_delete_owner_only" ON public.orders
  FOR DELETE TO authenticated
  USING (public.is_owner());

-- -----------------------------------------------------------------------------
-- RLS: order_items (Uses non-recursive security definer helper)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "order_items_select_parent_access" ON public.order_items;
CREATE POLICY "order_items_select_parent_access" ON public.order_items
  FOR SELECT TO authenticated
  USING (public.can_access_order(order_items.order_id));

DROP POLICY IF EXISTS "order_items_insert_parent_access" ON public.order_items;
CREATE POLICY "order_items_insert_parent_access" ON public.order_items
  FOR INSERT TO authenticated
  WITH CHECK (public.can_access_order(order_items.order_id));

DROP POLICY IF EXISTS "order_items_update_admin_only" ON public.order_items;
CREATE POLICY "order_items_update_admin_only" ON public.order_items
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "order_items_delete_admin_only" ON public.order_items;
CREATE POLICY "order_items_delete_admin_only" ON public.order_items
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- RLS: payments & payment_events
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "payments_select_parent_order_or_admin" ON public.payments;
CREATE POLICY "payments_select_parent_order_or_admin" ON public.payments
  FOR SELECT TO authenticated
  USING (public.can_access_order(payments.order_id));

DROP POLICY IF EXISTS "payments_write_admin_only" ON public.payments;
CREATE POLICY "payments_write_admin_only" ON public.payments
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "payment_events_admin_only" ON public.payment_events;
CREATE POLICY "payment_events_admin_only" ON public.payment_events
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- RLS: reviews
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "reviews_select_approved_or_own_or_admin" ON public.reviews;
CREATE POLICY "reviews_select_approved_or_own_or_admin" ON public.reviews
  FOR SELECT TO public
  USING (
    status = 'APPROVED'
    OR (auth.uid() IS NOT NULL AND auth.uid() = customer_id)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "reviews_insert_authenticated" ON public.reviews;
CREATE POLICY "reviews_insert_authenticated" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = customer_id OR public.is_admin());

DROP POLICY IF EXISTS "reviews_update_admin_only" ON public.reviews;
CREATE POLICY "reviews_update_admin_only" ON public.reviews
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "reviews_delete_own_or_admin" ON public.reviews;
CREATE POLICY "reviews_delete_own_or_admin" ON public.reviews
  FOR DELETE TO authenticated
  USING (auth.uid() = customer_id OR public.is_admin());

-- -----------------------------------------------------------------------------
-- RLS: return_requests (Uses non-recursive security definer helper)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "returns_select_own_or_admin" ON public.return_requests;
CREATE POLICY "returns_select_own_or_admin" ON public.return_requests
  FOR SELECT TO authenticated
  USING (public.can_access_order_by_number(return_requests.order_number));

DROP POLICY IF EXISTS "returns_insert_order_owner" ON public.return_requests;
CREATE POLICY "returns_insert_order_owner" ON public.return_requests
  FOR INSERT TO authenticated
  WITH CHECK (public.can_access_order_by_number(return_requests.order_number));

DROP POLICY IF EXISTS "returns_update_admin_only" ON public.return_requests;
CREATE POLICY "returns_update_admin_only" ON public.return_requests
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- RLS: audit_logs & otp_verifications
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "audit_logs_admin_only" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_only" ON public.audit_logs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "otp_verifications_admin_only" ON public.otp_verifications;
CREATE POLICY "otp_verifications_admin_only" ON public.otp_verifications
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
