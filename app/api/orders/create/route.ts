import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createVNPayUrl } from '@/utils/vnpay';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { items, shippingAddress, phone, fullName, paymentMethod, totalAmount } = body;

    const { data: { user } } = await supabase.auth.getUser();

    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        total_amount: totalAmount,
        status: 'pending',
        shipping_address: shippingAddress,
        phone: phone,
        full_name: fullName,
        payment_method: paymentMethod,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    // 3. Handle Payment Method
    if (paymentMethod === 'vnpay') {
      const vnpUrl = createVNPayUrl({
        amount: totalAmount,
        orderId: order.id,
        orderInfo: `Thanh toan don hang ${order.id}`,
        ipAddr: request.headers.get('x-forwarded-for') || '127.0.0.1',
        returnUrl: process.env.VNP_RETURN_URL!,
        tmnCode: process.env.VNP_TMN_CODE!,
        hashSecret: process.env.VNP_HASH_SECRET!,
        vnpUrl: process.env.VNP_URL!,
      });

      return NextResponse.json({ success: true, paymentUrl: vnpUrl, orderId: order.id });
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
