-- =============================================================================
-- DHARVIKA GRAINS — Customer Profile & Role Architecture Migration
-- =============================================================================
-- Links: auth.users (Supabase Auth) -> public.profiles
-- Supports 3 Core Roles: CUSTOMER, ADMIN, OWNER
-- Enforces Row Level Security (RLS) at PostgreSQL database layer
-- =============================================================================

-- 1. Create Profiles Table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN', 'OWNER')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for Performance & Queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Helper Security Definer Functions (Avoids RLS infinite recursion)
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'OWNER'
  );
$$;

-- 5. RLS Policies on public.profiles

-- Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own_or_service" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_owner_only" ON public.profiles;

-- SELECT POLICY:
-- - Customer can view ONLY their own profile (auth.uid() = id)
-- - Admin and Owner can view all customer profiles
CREATE POLICY "profiles_select_own_or_admin"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR public.is_admin()
);

-- UPDATE POLICY:
-- - Customer can update their own profile details
-- - Customer CANNOT change their own role (prevent privilege escalation)
-- - Admin can update non-owner profiles
-- - Owner can update any profile and manage roles
CREATE POLICY "profiles_update_own_or_admin"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id OR public.is_admin()
)
WITH CHECK (
  (
    -- Regular customer updating own profile: role must remain identical
    auth.uid() = id 
    AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
  )
  OR public.is_owner()
  OR (public.is_admin() AND role <> 'OWNER')
);

-- INSERT POLICY:
-- - New user can insert their own profile with role = 'CUSTOMER'
-- - Admin / Service role can insert profiles
CREATE POLICY "profiles_insert_own_or_service"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() = id AND role = 'CUSTOMER')
  OR public.is_admin()
);

-- DELETE POLICY:
-- - Only an OWNER can delete profiles (or cascades on auth.users deletion)
CREATE POLICY "profiles_delete_owner_only"
ON public.profiles
FOR DELETE
TO authenticated
USING (
  public.is_owner()
);

-- 6. Trigger: Automatic Profile Creation on auth.users SignUp
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_full_name TEXT;
  user_phone TEXT;
BEGIN
  user_full_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    ''
  );
  user_phone := COALESCE(
    new.raw_user_meta_data->>'phone',
    new.phone,
    ''
  );

  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    new.id,
    user_full_name,
    new.email,
    user_phone,
    'CUSTOMER'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = timezone('utc'::text, now());

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Trigger: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profiles_updated_at ON public.profiles;
CREATE TRIGGER on_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Trigger: Prevent Unauthorized Role Escalation (Defense in Depth)
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role <> OLD.role THEN
    IF NOT public.is_owner() AND NOT (public.is_admin() AND NEW.role <> 'OWNER') THEN
      RAISE EXCEPTION 'Unauthorized role change attempt. Only OWNER or ADMIN can modify roles.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_prevent_role_escalation ON public.profiles;
CREATE TRIGGER tr_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();
