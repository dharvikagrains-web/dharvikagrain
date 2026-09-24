-- =============================================================================
-- DHARVIKA GRAINS — Product Catalog & Row Level Security (RLS) Migration
-- =============================================================================
-- Supports: Product Name, Slug, Category, Description, Images, Price,
-- Compare Price, Weight, Unit, Availability, Status, Created/Updated Timestamps
-- Categories: Millets, Spices, Combo Packs
-- Permissions:
--   - Customers / Public: Can SELECT published products only
--   - Admin / Owner: Can SELECT, INSERT, UPDATE, ARCHIVE all products
-- =============================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Millets', 'Spices', 'Combo Packs')),
  description TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_price NUMERIC(10, 2) CHECK (compare_price IS NULL OR compare_price >= 0),
  weight NUMERIC(10, 2) NOT NULL DEFAULT 500,
  unit TEXT NOT NULL DEFAULT 'g' CHECK (unit IN ('g', 'kg')),
  is_available BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('PUBLISHED', 'DRAFT', 'ARCHIVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Drop existing policies if any
DROP POLICY IF EXISTS "products_select_published_or_admin" ON public.products;
DROP POLICY IF EXISTS "products_insert_admin_only" ON public.products;
DROP POLICY IF EXISTS "products_update_admin_only" ON public.products;
DROP POLICY IF EXISTS "products_delete_admin_only" ON public.products;

-- SELECT POLICY:
-- - Public customers can view ONLY PUBLISHED products
-- - Admins and Owners can view all products (including DRAFT, ARCHIVED)
CREATE POLICY "products_select_published_or_admin"
ON public.products
FOR SELECT
TO public
USING (
  status = 'PUBLISHED' OR public.is_admin()
);

-- INSERT POLICY:
-- - Only Admins and Owners can create new products
CREATE POLICY "products_insert_admin_only"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin()
);

-- UPDATE POLICY:
-- - Only Admins and Owners can modify products (update price, stock, details, or archive)
CREATE POLICY "products_update_admin_only"
ON public.products
FOR UPDATE
TO authenticated
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);

-- DELETE POLICY:
-- - Only Admins and Owners can permanently delete products
CREATE POLICY "products_delete_admin_only"
ON public.products
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);

-- 5. Updated At Trigger
DROP TRIGGER IF EXISTS on_products_updated_at ON public.products;
CREATE TRIGGER on_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
