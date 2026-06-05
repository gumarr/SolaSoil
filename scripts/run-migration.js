const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:HOSsPBtfuKSo6DCN@db.srxpqxvofngdmxdtokst.supabase.co:5432/postgres";

async function main() {
  const client = new Client({
    connectionString: connectionString
  });

  try {
    console.log('Reading migration.sql...');
    const sqlPath = path.join(__dirname, 'migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Connecting to PostgreSQL to run migration...');
    await client.connect();
    console.log('Connected! Executing migration queries (this will rebuild the schema)...');
    
    await client.query(sql);
    console.log('Migration completed successfully! Database schema rebuilt.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.end();
  }
}

main();
