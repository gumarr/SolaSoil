import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import payos from '@/utils/payos';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { items, shippingAddress, phone, fullName, paymentMethod, totalAmount } = body;

    const { data: { user } } = await supabase.auth.getUser();

    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Helper to validate UUID format to prevent FK errors with old localStorage data
    const isUUID = (str: any) => typeof str === 'string' && str.length === 36;

    // Validate that all items exist in the database BEFORE creating order to prevent orphan records
    const productIds = items
      .map((item: any) => item.productId)
      .filter((id: any) => isUUID(id));
      
    const comboIds = items
      .map((item: any) => item.comboId)
      .filter((id: any) => isUUID(id));

    // Fetch existing product IDs from DB
    let existingProductIds: string[] = [];
    if (productIds.length > 0) {
      const { data: productsData, error: productsFetchError } = await supabaseAdmin
        .from('products')
        .select('id')
        .in('id', productIds);
      if (productsFetchError) throw productsFetchError;
      existingProductIds = (productsData || []).map((p: any) => p.id);
    }

    // Fetch existing combo IDs from DB (from gift_combos table)
    let existingComboIds: string[] = [];
    if (comboIds.length > 0) {
      const { data: combosData, error: combosFetchError } = await supabaseAdmin
        .from('gift_combos')
        .select('id')
        .in('id', comboIds);
      if (combosFetchError) throw combosFetchError;
      existingComboIds = (combosData || []).map((c: any) => c.id);
    }

    // Check if there is any item that is invalid
    const invalidItems = items.filter((item: any) => {
      const hasProduct = isUUID(item.productId);
      const hasCombo = isUUID(item.comboId);
      
      // If it's a custom gift box (both productId and comboId are null), it is valid
      if (!hasProduct && !hasCombo) return false;
      
      if (hasProduct && !existingProductIds.includes(item.productId)) return true;
      if (hasCombo && !existingComboIds.includes(item.comboId)) return true;
      
      return false;
    });

    if (invalidItems.length > 0) {
      const invalidNames = invalidItems.map((item: any) => item.name).join(', ');
      return NextResponse.json({
        success: false,
        error: `Một số sản phẩm hoặc combo không còn tồn tại trong cửa hàng: ${invalidNames}. Vui lòng làm mới trang hoặc cập nhật lại giỏ hàng của bạn.`
      }, { status: 400 });
    }

    // 1. Create the order
    let order: any = null;
    let orderError: any = null;
    const orderId = crypto.randomUUID();

    const fullInsert = await supabaseAdmin
      .from('orders')
      .insert({
        id: orderId,
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

    if (fullInsert.error && (fullInsert.error.message.includes('full_name') || fullInsert.error.message.includes('column'))) {
      console.warn('Orders table missing full_name or phone columns. Using address fallback.');
      const fallbackAddress = `[Người nhận: ${fullName} - SĐT: ${phone}] ${shippingAddress}`;
      const fallbackInsert = await supabaseAdmin
        .from('orders')
        .insert({
          id: orderId,
          user_id: user?.id || null,
          total_amount: totalAmount,
          status: 'pending',
          shipping_address: fallbackAddress,
          payment_method: paymentMethod,
        })
        .select()
        .single();
      
      order = fallbackInsert.data;
      orderError = fallbackInsert.error;
    } else {
      order = fullInsert.data;
      orderError = fullInsert.error;
    }

    if (orderError) throw orderError;

    // 2. Create order items
    const orderItems = items.map((item: any) => ({
      id: crypto.randomUUID(),
      order_id: order.id,
      product_id: isUUID(item.productId) ? item.productId : null,
      combo_id: isUUID(item.comboId) ? item.comboId : null,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    // 3. Handle Payment Method
    if (paymentMethod === 'payos') {
      // Generate a numeric orderCode from timestamp (PayOS requires number type)
      const orderCode = Number(String(Date.now()).slice(-8));

      const origin = request.headers.get('origin') || 'http://localhost:3000';
      const returnUrl = `${origin}/checkout/success?orderId=${order.id}`;
      const cancelUrl = `${origin}/checkout/failure?orderId=${order.id}`;
      const paymentLink = await payos.paymentRequests.create({
        orderCode: orderCode,
        amount: Math.round(totalAmount),
        description: `DH ${String(orderCode).slice(-6)}`,
        returnUrl: returnUrl,
        cancelUrl: cancelUrl,
        items: items.map((item: any) => ({
          name: item.name.slice(0, 25),
          quantity: item.quantity,
          price: Math.round(item.price),
        })),
      });

      // Store the orderCode mapping for webhook verification
      await supabaseAdmin
        .from('orders')
        .update({ 
          status: 'awaiting_payment',
        })
        .eq('id', order.id);

      return NextResponse.json({ 
        success: true, 
        paymentUrl: paymentLink.checkoutUrl, 
        orderId: order.id 
      });
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error('Order creation error:', error);
    let errorMessage = error.message;
    if (error.code === '23503') {
      errorMessage = 'Sản phẩm hoặc combo trong giỏ hàng không khớp với cơ sở dữ liệu. Vui lòng làm mới trang hoặc cập nhật lại giỏ hàng.';
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
