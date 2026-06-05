const { Client } = require('pg');
// Load dotenv to access direct connection urls if needed
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:HOSsPBtfuKSo6DCN@db.srxpqxvofngdmxdtokst.supabase.co:5432/postgres";

async function main() {
  const client = new Client({
    connectionString: connectionString
  });

  try {
    console.log('Connecting to PostgreSQL using direct connection...');
    await client.connect();
    console.log('Connected!');

    // 1. Create chat_sessions table
    console.log('Creating chat_sessions table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        session_key VARCHAR(255) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL DEFAULT 'Khách hàng',
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log('Table chat_sessions created successfully!');

    // 2. Create chat_messages table
    console.log('Creating chat_messages table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
        sender_id UUID,
        sender_role VARCHAR(50) NOT NULL DEFAULT 'customer',
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log('Table chat_messages created successfully!');

    // 3. Enable realtime for chat_messages table
    console.log('Enabling Supabase Realtime for chat_messages...');
    try {
      await client.query(`
        ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
      `);
      console.log('Successfully enabled Supabase Realtime for chat_messages!');
    } catch (e) {
      if (e.message && e.message.includes('already exists')) {
        console.log('Realtime is already enabled for chat_messages.');
      } else {
        console.warn('Warning adding table to realtime publication:', e.message);
      }
    }

  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    await client.end();
  }
}

main();
