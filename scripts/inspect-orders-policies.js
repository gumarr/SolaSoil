require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
  console.log('Connecting to:', connectionString ? connectionString.split('@')[1] : 'undefined');
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  const res = await client.query(`
    SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check 
    FROM pg_policies 
    WHERE tablename = 'orders';
  `);
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}
main().catch(console.error);
