-- ============================================================
-- SOLASOIL — FULL DATABASE MIGRATION
-- Chạy script này trong Supabase SQL Editor (1 lần duy nhất)
-- ============================================================

-- 1. XÓA BẢNG CŨ (nếu có) theo thứ tự phụ thuộc
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS combo_items CASCADE;
DROP TABLE IF EXISTS combos CASCADE;
DROP TABLE IF EXISTS gift_combos CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS site_config CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- 2. TẠO BẢNG MỚI
-- ============================================================

-- ── Categories ───────────────────────────────────────────────
CREATE TABLE public.categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        varchar NOT NULL,
  icon        varchar,
  description text,
  subtitle    varchar,
  grad        varchar DEFAULT 'from-stone-900 to-amber-900',
  image_url   text,
  created_at  timestamptz DEFAULT now()
);

-- ── Products ─────────────────────────────────────────────────
CREATE TABLE public.products (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id    uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  name           varchar NOT NULL,
  description    text,
  price          numeric NOT NULL,
  weight         varchar,
  stock_quantity integer DEFAULT 0,
  ocop_stars     integer,
  origin         varchar DEFAULT 'Sơn La',
  is_active      boolean DEFAULT true,
  image_main     text,
  image_reveal   text,
  image_thumb    text,
  emoji          varchar DEFAULT '📦',
  reveal_emoji   varchar DEFAULT '✨',
  grad           varchar DEFAULT 'from-stone-800 via-stone-700 to-amber-900',
  reveal_grad    varchar DEFAULT 'from-orange-700 via-red-700 to-rose-800',
  badge          varchar,
  detail_story   text,
  ingredients    text,
  usage_instructions text,
  benefits       text,
  created_at     timestamptz DEFAULT now()
);

-- ── Gift Combos ──────────────────────────────────────────────
CREATE TABLE public.gift_combos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        varchar NOT NULL,
  description text,
  price       numeric NOT NULL,
  image_url   text,
  emoji       varchar DEFAULT '🎁',
  grad        varchar DEFAULT 'from-stone-800 to-green-900',
  tag         varchar,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- ── Testimonials ─────────────────────────────────────────────
CREATE TABLE public.testimonials (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       varchar NOT NULL,
  role       varchar,
  text       text NOT NULL,
  location   varchar,
  rating     integer DEFAULT 5,
  is_active  boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ── Site Config (hero images, story images, etc.) ────────────
CREATE TABLE public.site_config (
  key        varchar PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- ── Users (synced with Supabase Auth) ────────────────────────
CREATE TABLE public.users (
  id         uuid PRIMARY KEY,  -- matches auth.users.id
  full_name  varchar,
  email      varchar UNIQUE,
  phone      varchar,
  address    text,
  role       varchar DEFAULT 'customer',
  created_at timestamptz DEFAULT now()
);

-- ── Orders ───────────────────────────────────────────────────
CREATE TABLE public.orders (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid REFERENCES public.users(id),
  total_amount     numeric NOT NULL,
  status           varchar DEFAULT 'pending',
  shipping_address text NOT NULL,
  payment_method   varchar,
  created_at       timestamptz DEFAULT now()
);

-- ── Order Items ──────────────────────────────────────────────
CREATE TABLE public.order_items (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id        uuid REFERENCES public.products(id),
  quantity          integer NOT NULL,
  price_at_purchase numeric NOT NULL
);

-- ============================================================
-- 3. AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    CASE
      WHEN NEW.email = 'luckyhuy100@gmail.com' THEN 'admin'
      ELSE 'customer'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 4. RLS POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Public read for storefront tables
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read gift_combos" ON public.gift_combos FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public read site_config" ON public.site_config FOR SELECT USING (true);

-- Admin write (INSERT/UPDATE/DELETE) via user role check
CREATE POLICY "Admin write categories" ON public.categories FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin write products" ON public.products FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin write gift_combos" ON public.gift_combos FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin write testimonials" ON public.testimonials FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin write site_config" ON public.site_config FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Users can read their own profile
CREATE POLICY "Users read own profile" ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Admin can read all users (use JWT email to avoid infinite recursion)
CREATE POLICY "Admin read all users" ON public.users FOR SELECT
  USING (auth.jwt()->>'email' = 'luckyhuy100@gmail.com');

-- Admin write users (use JWT email to avoid infinite recursion)
CREATE POLICY "Admin write users" ON public.users FOR ALL
  USING (auth.jwt()->>'email' = 'luckyhuy100@gmail.com');

-- Orders: users see own, admin sees all
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Admin read all orders" ON public.orders FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users create orders" ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Read own order items" ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- ============================================================
-- DONE! Bây giờ chạy seed script: npm run seed:http
-- ============================================================
