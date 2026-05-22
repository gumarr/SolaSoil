-- Thêm các trường cần thiết cho thanh toán và giao hàng vào bảng orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS phone varchar,
ADD COLUMN IF NOT EXISTS vnp_transaction_id varchar,
ADD COLUMN IF NOT EXISTS full_name varchar; -- Tên người nhận hàng (có thể khác tên tài khoản)

-- Cho phép khách hàng xem đơn hàng của mình dựa trên user_id hoặc email
-- (RLS đã có sẵn trong migration trước đó)
