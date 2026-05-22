const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function run() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !anonKey) {
    console.error('Supabase URL or Key not found in .env.local');
    return;
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${anonKey}`);
    const data = await res.json();
    if (data.definitions && data.definitions.orders) {
      console.log('Orders table columns:');
      console.log(JSON.stringify(data.definitions.orders.properties, null, 2));
    } else {
      console.log('Orders table definition not found. Available definitions:', Object.keys(data.definitions || {}));
    }
  } catch (err) {
    console.error('Error fetching schema:', err);
  }
}

run();
