const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:HOSsPBtfuKSo6DCN@db.srxpqxvofngdmxdtokst.supabase.co:5432/postgres";

async function main() {
  const client = new Client({
    connectionString: connectionString
  });

  try {
    await client.connect();
    
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products';
    `);
    
    console.log('Columns in categories table:');
    console.log(res.rows);
  } catch (error) {
    console.error('Failed to fetch columns:', error);
  } finally {
    await client.end();
  }
}

main();
