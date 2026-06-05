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
  console.log('Connected! Checking and adding badge column to products table...')
  
  // 1. Alter table to add badge column if it doesn't exist
  await client.query(`
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS badge VARCHAR;
  `)
  console.log('badge column checked/added successfully!')

  // 2. Reload schema cache for PostgREST
  console.log('Reloading PostgREST schema cache...')
  await client.query("NOTIFY pgrst, 'reload schema';")
  console.log('PostgREST schema cache reload signal sent successfully!')
}

main()
  .catch((e) => {
    console.error('Error during migration:', e)
    process.exit(1)
  })
  .finally(async () => {
    await client.end()
  })
