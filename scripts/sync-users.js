const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    await client.connect();
    const res = await client.query(`
      INSERT INTO public.users (id, email, full_name, role)
      SELECT id, email, raw_user_meta_data->>'full_name',
        CASE WHEN email = 'luckyhuy100@gmail.com' THEN 'admin' ELSE 'customer' END
      FROM auth.users
      ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, email = EXCLUDED.email;
    `);
    console.log('Synced users:', res.rowCount);
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

run();
