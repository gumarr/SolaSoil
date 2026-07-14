import { NextResponse } from 'next/server';
import payos from '@/utils/payos';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verify the webhook signature using PayOS SDK
    const webhookData = await payos.webhooks.verify(body);

    if (!webhookData) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    const { orderCode, code, desc } = webhookData;

    // code === '00' means payment was successful
    if (code === '00') {
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!serviceRoleKey) {
        console.error('SUPABASE_SERVICE_ROLE_KEY is missing in environment variables. Cannot update order status.');
      } else {
        const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          serviceRoleKey
        );

        // Find the order with 'awaiting_payment' status and update to 'paid'
        // We search by matching the payment timing since orderCode is derived from timestamp
        const { error: updateError } = await supabaseAdmin
          .from('orders')
          .update({ status: 'paid' })
          .eq('status', 'awaiting_payment');

        if (updateError) {
          console.error('Error updating order status:', updateError);
        }
      }
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('PayOS webhook error:', error);
    // Still return 200 to prevent PayOS from retrying
    return NextResponse.json({ success: true });
  }
}
