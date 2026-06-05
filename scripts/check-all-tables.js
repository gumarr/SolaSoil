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
  await client.connect()
  
  const tables = ['products', 'categories', 'gift_combos', 'testimonials', 'site_config'];
  for (const tableName of tables) {
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = $1;
    `, [tableName])
    
    console.log(`\nColumns in ${tableName}:`)
    console.log(res.rows.map(r => `${r.column_name} (${r.data_type})`))
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await client.end()
  })
