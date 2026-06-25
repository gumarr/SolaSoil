const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.srxpqxvofngdmxdtokst:HOSsPBtfuKSo6DCN@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres";

async function main() {
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to PostgreSQL to update policies...');
    await client.connect();
    console.log('Connected!');

    // 1. Fix orders table SELECT policy
    console.log('Re-creating "Admin read all orders" policy...');
    await client.query(`
      DROP POLICY IF EXISTS "Admin read all orders" ON public.orders;
      CREATE POLICY "Admin read all orders" ON public.orders 
      FOR SELECT 
      USING (auth.jwt()->>'email' = 'luckyhuy100@gmail.com');
    `);
    console.log('Successfully updated "Admin read all orders" policy!');

    // 2. Fix order_items table SELECT policy for admin
    console.log('Re-creating "Admin read all order items" policy...');
    await client.query(`
      DROP POLICY IF EXISTS "Admin read all order items" ON public.order_items;
      CREATE POLICY "Admin read all order items" ON public.order_items 
      FOR SELECT 
      USING (auth.jwt()->>'email' = 'luckyhuy100@gmail.com');
    `);
    console.log('Successfully updated "Admin read all order items" policy!');

  } catch (error) {
    console.error('Database configuration failed:', error);
  } finally {
    await client.end();
  }
}

main();
