import nodemailer from 'nodemailer';

export async function sendOrderNotificationEmail(order: any, items: any[]) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const adminEmail = process.env.ADMIN_EMAIL || user;

  if (!host || !user || !pass) {
    console.warn('SMTP configuration is missing. Skipping email notification.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });

  // Format order items for email
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: left; color: #1f2937;">
        ${item.name || 'Sản phẩm/Combo'}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center; color: #1f2937;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right; color: #1f2937;">
        ${Math.round(item.price).toLocaleString('vi-VN')} đ
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: bold; color: #065f46;">
        ${Math.round(item.price * item.quantity).toLocaleString('vi-VN')} đ
      </td>
    </tr>
  `
    )
    .join('');

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; color: #1f2937; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); color: #ffffff; padding: 32px 24px; text-align: center;">
        <span style="font-size: 40px; display: block; margin-bottom: 12px;">📦</span>
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; tracking-tight: -0.025em; text-transform: uppercase;">Có Đơn Hàng Mới!</h1>
        <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Hệ thống đặc sản Mộc Sơn vừa tiếp nhận một đơn đặt hàng mới.</p>
      </div>
      
      <div style="padding: 28px 24px;">
        <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">
          Thông tin đơn hàng
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 28px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 150px;">Mã đơn hàng:</td>
            <td style="padding: 8px 0; font-weight: 700; color: #111827; font-family: monospace; font-size: 13px;">${order.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Tên khách hàng:</td>
            <td style="padding: 8px 0; font-weight: 700; color: #111827;">${order.full_name || 'Khách hàng'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Số điện thoại:</td>
            <td style="padding: 8px 0; font-weight: 700; color: #111827;">${order.phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Địa chỉ giao nhận:</td>
            <td style="padding: 8px 0; color: #374151; line-height: 1.4;">${order.shipping_address}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Thanh toán qua:</td>
            <td style="padding: 8px 0; color: #047857; font-weight: 700; text-transform: uppercase; font-size: 12px; tracking-wider: 0.05em;">
              ${order.payment_method === 'payos' ? '💳 Cổng PayOS (Trực tuyến)' : '💵 Nhận hàng thanh toán (COD)'}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Thời gian ghi nhận:</td>
            <td style="padding: 8px 0; color: #374151;">${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</td>
          </tr>
        </table>

        <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">
          Danh sách sản phẩm mua
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 28px;">
          <thead>
            <tr style="background-color: #f9fafb; color: #4b5563; font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">
              <th style="padding: 12px 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Sản phẩm</th>
              <th style="padding: 12px 10px; text-align: center; border-bottom: 2px solid #e5e7eb; width: 50px;">SL</th>
              <th style="padding: 12px 10px; text-align: right; border-bottom: 2px solid #e5e7eb; width: 100px;">Đơn giá</th>
              <th style="padding: 12px 10px; text-align: right; border-bottom: 2px solid #e5e7eb; width: 120px;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 20px 10px 10px 10px; text-align: right; font-weight: 700; color: #4b5563; font-size: 14px;">
                Tổng giá trị đơn hàng:
              </td>
              <td style="padding: 20px 10px 10px 10px; text-align: right; font-weight: 800; font-size: 20px; color: #065f46;">
                ${Math.round(order.total_amount).toLocaleString('vi-VN')} đ
              </td>
            </tr>
          </tfoot>
        </table>

        <div style="text-align: center; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'https://' + new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : '#'}/admin" 
             style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(6, 95, 70, 0.2);">
            Xem Đơn Hàng Trên Admin Panel
          </a>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; line-height: 1.5;">
        Đây là email thông báo tự động từ hệ thống cửa hàng đặc sản Sơn La - <strong>Mộc Sơn</strong>.<br>
        Vui lòng không phản hồi lại email này.
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Mộc Sơn Store" <${user}>`,
      to: adminEmail,
      subject: `🛍️ [ĐƠN HÀNG MỚI] Khách hàng ${order.full_name || 'Khách hàng'} đặt mua - ${Math.round(order.total_amount).toLocaleString('vi-VN')} đ`,
      html: emailHtml,
    });
    console.log('Order notification email sent successfully to', adminEmail, 'MessageId:', info.messageId);
  } catch (error) {
    console.error('Error sending order notification email:', error);
  }
}
