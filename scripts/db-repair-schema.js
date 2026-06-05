require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
  console.error('DATABASE_URL is not defined in .env.local')
  process.exit(1)
}

const client = new Client({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false
  }
})

async function main() {
  console.log('Connecting to database via pooler...')
  await client.connect()
  console.log('Connected! Executing schema repair query...')

  const query = `
    -- 1. Alter categories table
    ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS subtitle VARCHAR;
    ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS grad VARCHAR DEFAULT 'from-stone-900 to-amber-900';
    ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image_url TEXT;

    -- 2. Alter products table
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_main TEXT;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_reveal TEXT;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_thumb TEXT;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS emoji VARCHAR DEFAULT '📦';
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reveal_emoji VARCHAR DEFAULT '✨';
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS grad VARCHAR DEFAULT 'from-stone-800 via-stone-700 to-amber-900';
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reveal_grad VARCHAR DEFAULT 'from-orange-700 via-red-700 to-rose-800';
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS badge VARCHAR;

    -- 3. Create gift_combos table
    CREATE TABLE IF NOT EXISTS public.gift_combos (
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

    -- 4. Create testimonials table
    CREATE TABLE IF NOT EXISTS public.testimonials (
      id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name       varchar NOT NULL,
      role       varchar,
      text       text NOT NULL,
      location   varchar,
      rating     integer DEFAULT 5,
      is_active  boolean DEFAULT true,
      created_at timestamptz DEFAULT now()
    );

    -- 5. Create site_config table
    CREATE TABLE IF NOT EXISTS public.site_config (
      key        varchar PRIMARY KEY,
      value      jsonb NOT NULL,
      updated_at timestamptz DEFAULT now()
    );

    -- 6. Enable RLS on new tables
    ALTER TABLE public.gift_combos ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

    -- 7. Drop and recreate policies
    DROP POLICY IF EXISTS "Public read gift_combos" ON public.gift_combos;
    DROP POLICY IF EXISTS "Admin write gift_combos" ON public.gift_combos;
    CREATE POLICY "Public read gift_combos" ON public.gift_combos FOR SELECT USING (true);
    CREATE POLICY "Admin write gift_combos" ON public.gift_combos FOR ALL
      USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

    DROP POLICY IF EXISTS "Public read testimonials" ON public.testimonials;
    DROP POLICY IF EXISTS "Admin write testimonials" ON public.testimonials;
    CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
    CREATE POLICY "Admin write testimonials" ON public.testimonials FOR ALL
      USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

    DROP POLICY IF EXISTS "Public read site_config" ON public.site_config;
    DROP POLICY IF EXISTS "Admin write site_config" ON public.site_config;
    CREATE POLICY "Public read site_config" ON public.site_config FOR SELECT USING (true);
    CREATE POLICY "Admin write site_config" ON public.site_config FOR ALL
      USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

    -- 8. Reload schema cache
    NOTIFY pgrst, 'reload schema';
  `

  await client.query(query)
  console.log('Database schema repaired successfully and PostgREST schema cache reloaded!')
}

main()
  .catch((e) => {
    console.error('Error during schema repair:', e)
    process.exit(1)
  })
  .finally(async () => {
    await client.end()
  })
