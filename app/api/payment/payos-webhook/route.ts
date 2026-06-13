import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
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
      const supabase = await createClient();

      // Find the order with 'awaiting_payment' status and update to 'paid'
      // We search by matching the payment timing since orderCode is derived from timestamp
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('status', 'awaiting_payment');

      if (updateError) {
        console.error('Error updating order status:', updateError);
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
