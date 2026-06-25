const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:HOSsPBtfuKSo6DCN@db.srxpqxvofngdmxdtokst.supabase.co:5432/postgres";

async function main() {
  const client = new Client({
    connectionString: connectionString
  });

  try {
    console.log('Connecting to PostgreSQL to enable realtime for orders...');
    await client.connect();
    console.log('Connected!');

    console.log('Enabling Supabase Realtime for orders table...');
    try {
      await client.query(`
        ALTER PUBLICATION supabase_realtime ADD TABLE orders;
      `);
      console.log('Successfully enabled Supabase Realtime for orders!');
    } catch (e) {
      if (e.message && e.message.includes('already exists')) {
        console.log('Realtime is already enabled for orders.');
      } else {
        console.warn('Warning adding table to realtime publication:', e.message);
      }
    }

  } catch (error) {
    console.error('Database configuration failed:', error);
  } finally {
    await client.end();
  }
}

main();
