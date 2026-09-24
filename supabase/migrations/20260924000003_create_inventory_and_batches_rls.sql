-- =============================================================================
-- DHARVIKA GRAINS — Inventory, Batch Traceability & Ledger RLS Migration
-- =============================================================================
-- Hierarchy:
--   PRODUCT
--     ↓
--   BATCH (Batch number, Product, Manufacturing date, Expiry date, Quantity, Status)
--     ↓
--   INVENTORY (Traceable stock: received, reserved, sold, adjusted, returned)
--     ↓
--   INVENTORY TRANSACTIONS (Append-only immutable audit ledger)
-- =============================================================================

-- 1. Create Batches Table
CREATE TABLE IF NOT EXISTS public.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number TEXT UNIQUE NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  crop_name TEXT,
  manufacturing_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  total_quantity_kg NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_quantity_kg >= 0),
  remaining_quantity_kg NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (remaining_quantity_kg >= 0),
  source_region TEXT,
  farmer_cluster TEXT,
  quality_passed BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DEPLETED', 'EXPIRED', 'ARCHIVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT chk_batch_dates CHECK (expiry_date >= manufacturing_date)
);

CREATE INDEX IF NOT EXISTS idx_batches_product_id ON public.batches(product_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON public.batches(status);
CREATE INDEX IF NOT EXISTS idx_batches_number ON public.batches(batch_number);

-- 2. Create Traceable Inventory Table
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  variant TEXT NOT NULL,
  batch_number TEXT REFERENCES public.batches(batch_number) ON DELETE SET NULL,
  stock_received INT NOT NULL DEFAULT 0 CHECK (stock_received >= 0),
  stock_reserved INT NOT NULL DEFAULT 0 CHECK (stock_reserved >= 0),
  stock_sold INT NOT NULL DEFAULT 0 CHECK (stock_sold >= 0),
  stock_adjusted INT NOT NULL DEFAULT 0,
  stock_returned INT NOT NULL DEFAULT 0 CHECK (stock_returned >= 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  threshold INT NOT NULL DEFAULT 15,
  status TEXT NOT NULL DEFAULT 'In Stock' CHECK (status IN ('In Stock', 'Low Stock', 'Out of Stock')),
  selling_price NUMERIC(10, 2) NOT NULL,
  mrp NUMERIC(10, 2) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_inventory_sku ON public.inventory(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_batch ON public.inventory(batch_number);

-- 3. Create Append-Only Immutable Inventory Ledger Transactions
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL,
  batch_number TEXT,
  type TEXT NOT NULL CHECK (type IN (
    'STOCK_RECEIVED',
    'STOCK_RESERVED',
    'STOCK_SOLD',
    'STOCK_ADJUSTED',
    'STOCK_RETURNED',
    'STOCK_RELEASED'
  )),
  quantity INT NOT NULL,
  stock_before INT NOT NULL,
  stock_after INT NOT NULL,
  reference_id TEXT,
  notes TEXT,
  actor_email TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_inv_tx_sku ON public.inventory_transactions(sku);
CREATE INDEX IF NOT EXISTS idx_inv_tx_batch ON public.inventory_transactions(batch_number);
CREATE INDEX IF NOT EXISTS idx_inv_tx_ref ON public.inventory_transactions(reference_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Batches Policies:
DROP POLICY IF EXISTS "batches_select_policy" ON public.batches;
DROP POLICY IF EXISTS "batches_admin_insert_policy" ON public.batches;
DROP POLICY IF EXISTS "batches_admin_update_policy" ON public.batches;
DROP POLICY IF EXISTS "batches_admin_delete_policy" ON public.batches;

CREATE POLICY "batches_select_policy" ON public.batches
FOR SELECT TO public
USING (true); -- Customers can view batch transparency & certificate data

CREATE POLICY "batches_admin_insert_policy" ON public.batches
FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "batches_admin_update_policy" ON public.batches
FOR UPDATE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "batches_admin_delete_policy" ON public.batches
FOR DELETE TO authenticated
USING (public.is_admin());

-- Inventory Policies:
DROP POLICY IF EXISTS "inventory_select_policy" ON public.inventory;
DROP POLICY IF EXISTS "inventory_admin_insert_policy" ON public.inventory;
DROP POLICY IF EXISTS "inventory_admin_update_policy" ON public.inventory;
DROP POLICY IF EXISTS "inventory_admin_delete_policy" ON public.inventory;

CREATE POLICY "inventory_select_policy" ON public.inventory
FOR SELECT TO public
USING (true); -- Public can read availability

CREATE POLICY "inventory_admin_insert_policy" ON public.inventory
FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "inventory_admin_update_policy" ON public.inventory
FOR UPDATE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "inventory_admin_delete_policy" ON public.inventory
FOR DELETE TO authenticated
USING (public.is_admin());

-- Inventory Transactions Ledger Policies:
DROP POLICY IF EXISTS "ledger_admin_select_policy" ON public.inventory_transactions;
DROP POLICY IF EXISTS "ledger_admin_insert_policy" ON public.inventory_transactions;

CREATE POLICY "ledger_admin_select_policy" ON public.inventory_transactions
FOR SELECT TO authenticated
USING (public.is_admin()); -- Strictly Admin/Owner internal ledger

CREATE POLICY "ledger_admin_insert_policy" ON public.inventory_transactions
FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

-- 6. Trigger: Updated At
DROP TRIGGER IF EXISTS on_inventory_updated_at ON public.inventory;
CREATE TRIGGER on_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
