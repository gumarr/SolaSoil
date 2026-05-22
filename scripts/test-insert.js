const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function run() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('Supabase URL or Service Key not found');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  console.log('Inserting with all fields (full_name, phone)...');
  const { data: d1, error: e1 } = await supabase
    .from('orders')
    .insert({
      total_amount: 1000,
      shipping_address: 'Test Address',
      full_name: 'Test Name',
      phone: '0123456789',
    })
    .select();

  console.log('Result with all fields:', { data: d1, error: e1 });

  console.log('Inserting without full_name and phone...');
  const { data: d2, error: e2 } = await supabase
    .from('orders')
    .insert({
      total_amount: 1000,
      shipping_address: 'Test Address',
    })
    .select();

  console.log('Result without full_name and phone:', { data: d2, error: e2 });
}

run();
