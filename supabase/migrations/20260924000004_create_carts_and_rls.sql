-- =============================================================================
-- DHARVIKA GRAINS — Customer Cart Architecture & Row Level Security (RLS)
-- =============================================================================
-- Supports:
--   - carts (user_id 1:1 relation, auto-timestamped)
--   - cart_items (cart_id, product_id, selected_weight, quantity > 0)
-- Strict Customer Isolation:
--   - Customers can only select, insert, update, or delete items in their OWN cart.
--   - Direct attempts by Customer A to read or alter Customer B's cart are blocked by RLS.
--   - Database constraints enforce quantity > 0 and uniqueness of (cart_id, product_id, selected_weight).
-- =============================================================================

-- 1. Create carts table
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  selected_weight TEXT NOT NULL DEFAULT '500g',
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_cart_item UNIQUE (cart_id, product_id, selected_weight)
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for public.carts
DROP POLICY IF EXISTS "carts_select_own_or_admin" ON public.carts;
DROP POLICY IF EXISTS "carts_insert_own_or_admin" ON public.carts;
DROP POLICY IF EXISTS "carts_update_own_or_admin" ON public.carts;
DROP POLICY IF EXISTS "carts_delete_own_or_admin" ON public.carts;

CREATE POLICY "carts_select_own_or_admin"
ON public.carts
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR public.is_admin()
);

CREATE POLICY "carts_insert_own_or_admin"
ON public.carts
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id OR public.is_admin()
);

CREATE POLICY "carts_update_own_or_admin"
ON public.carts
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id OR public.is_admin()
)
WITH CHECK (
  auth.uid() = user_id OR public.is_admin()
);

CREATE POLICY "carts_delete_own_or_admin"
ON public.carts
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id OR public.is_admin()
);

-- 6. RLS Policies for public.cart_items
DROP POLICY IF EXISTS "cart_items_select_own_or_admin" ON public.cart_items;
DROP POLICY IF EXISTS "cart_items_insert_own_or_admin" ON public.cart_items;
DROP POLICY IF EXISTS "cart_items_update_own_or_admin" ON public.cart_items;
DROP POLICY IF EXISTS "cart_items_delete_own_or_admin" ON public.cart_items;

CREATE POLICY "cart_items_select_own_or_admin"
ON public.cart_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.carts
    WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR public.is_admin())
  )
);

CREATE POLICY "cart_items_insert_own_or_admin"
ON public.cart_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.carts
    WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR public.is_admin())
  )
);

CREATE POLICY "cart_items_update_own_or_admin"
ON public.cart_items
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.carts
    WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR public.is_admin())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.carts
    WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR public.is_admin())
  )
);

CREATE POLICY "cart_items_delete_own_or_admin"
ON public.cart_items
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.carts
    WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR public.is_admin())
  )
);
