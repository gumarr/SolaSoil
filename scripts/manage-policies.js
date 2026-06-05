require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const policies = [
  { table: 'categories', name: 'Admin write categories' },
  { table: 'products', name: 'Admin write products' },
  { table: 'gift_combos', name: 'Admin write gift_combos' },
  { table: 'testimonials', name: 'Admin write testimonials' },
  { table: 'site_config', name: 'Admin write site_config' },
  { table: 'orders', name: 'Admin read all orders', cmd: 'SELECT' }
];

async function main() {
  const action = process.argv[2]; // 'drop' or 'create'
  const client = new Client({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
  await client.connect();

  if (action === 'drop') {
    for (const p of policies) {
      console.log(`Dropping policy ${p.name} on ${p.table}...`);
      await client.query(`DROP POLICY IF EXISTS "${p.name}" ON ${p.table};`).catch(console.warn);
    }
    console.log("Done dropping policies.");
  } else if (action === 'create') {
    for (const p of policies) {
      console.log(`Creating policy ${p.name} on ${p.table}...`);
      const cmd = p.cmd || 'ALL';
      const qual = `(EXISTS ( SELECT 1 FROM users WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'admin'::text))))`;
      await client.query(`
        CREATE POLICY "${p.name}" ON ${p.table}
        FOR ${cmd}
        TO public
        USING (${qual});
      `).catch(console.error);
    }
    console.log("Done creating policies.");
  } else {
    console.log("Please specify 'drop' or 'create' as the argument.");
  }
  
  await client.end();
}

main().catch(console.error);
