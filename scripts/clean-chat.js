require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
  await client.connect();
  await client.query('DELETE FROM chat_messages; DELETE FROM chat_sessions;');
  console.log('Cleaned chat_sessions');
  await client.end();
}

main().catch(console.error);
