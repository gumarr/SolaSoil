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
  console.log('Connecting to PostgreSQL database...')
  await client.connect()
  console.log('Connected! Adding details columns to products table...')
  await client.query(`
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS detail_story TEXT;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ingredients TEXT;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS usage_instructions TEXT;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS benefits TEXT;
  `)
  console.log('Columns added successfully!')
}

main()
  .catch((e) => {
    console.error('Error during migration:', e)
    process.exit(1)
  })
  .finally(async () => {
    await client.end()
  })
