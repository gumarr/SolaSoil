const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:HOSsPBtfuKSo6DCN@db.srxpqxvofngdmxdtokst.supabase.co:5432/postgres";

async function main() {
  const client = new Client({
    connectionString: connectionString
  });

  try {
    console.log('Connecting to database to reload schema...');
    await client.connect();
    
    // Reload PostgREST schema cache
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log('PostgREST schema cache reload signal sent successfully!');
  } catch (error) {
    console.error('Failed to reload schema cache:', error);
  } finally {
    await client.end();
  }
}

main();
