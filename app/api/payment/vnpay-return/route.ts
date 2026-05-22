import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { verifyVNPayResponse } from '@/utils/vnpay';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params: any = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const orderId = params['vnp_TxnRef'];
  const responseCode = params['vnp_ResponseCode'];
  const transactionNo = params['vnp_TransactionNo'];

  const isValid = verifyVNPayResponse(params, process.env.VNP_HASH_SECRET!);

  if (!isValid) {
    return NextResponse.redirect(new URL('/checkout/failure?error=invalid_signature', request.url));
  }

  const supabase = await createClient();

  if (responseCode === '00') {
    // Payment Success
    const updateResult = await supabase
      .from('orders')
      .update({ 
        status: 'paid', 
        vnp_transaction_id: transactionNo 
      })
      .eq('id', orderId);

    if (updateResult.error && (updateResult.error.message.includes('vnp_transaction_id') || updateResult.error.message.includes('column'))) {
      console.warn('Orders table missing vnp_transaction_id column. Retrying status update only.');
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);
    }

    return NextResponse.redirect(new URL(`/checkout/success?orderId=${orderId}`, request.url));
  } else {
    // Payment Failed
    await supabase
      .from('orders')
      .update({ status: 'failed' })
      .eq('id', orderId);

    return NextResponse.redirect(new URL(`/checkout/failure?orderId=${orderId}&code=${responseCode}`, request.url));
  }
}
