require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query(`
    SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check 
    FROM pg_policies 
    WHERE qual LIKE '%users%' OR with_check LIKE '%users%';
  `);
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}
main().catch(console.error);
