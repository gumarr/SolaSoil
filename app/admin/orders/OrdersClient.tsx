'use client'

import { useState, useTransition } from 'react'
import { 
  Search, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  Check, 
  Truck, 
  AlertTriangle, 
  X, 
  Eye, 
  RefreshCw,
  CreditCard,
  DollarSign,
  ChevronDown
} from 'lucide-react'
import { updateOrderStatus } from '../actions'

interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  combo_id: string | null
  quantity: number
  price_at_purchase: number
  product?: { name: string } | null
  gift_combo?: { name: string } | null
}

interface Order {
  id: string
  user_id: string | null
  total_amount: number
  status: string
  shipping_address: string
  payment_method: string
  full_name?: string | null
  phone?: string | null
  created_at: string
  order_items: OrderItem[]
}

interface OrdersClientProps {
  initialOrders: Order[]
}

// Bảng màu trạng thái
const STATUS_CONFIGS: Record<string, { label: string, color: string, bgColor: string, border: string, icon: any }> = {
  pending: { label: 'Chờ xử lý', color: 'text-amber-400', bgColor: 'bg-amber-950/20', border: 'border-amber-900/30', icon: Clock },
  awaiting_payment: { label: 'Chờ thanh toán', color: 'text-sky-400', bgColor: 'bg-sky-950/20', border: 'border-sky-900/30', icon: CreditCard },
  paid: { label: 'Đã thanh toán', color: 'text-emerald-400', bgColor: 'bg-emerald-950/20', border: 'border-emerald-900/30', icon: Check },
  shipping: { label: 'Đang giao hàng', color: 'text-indigo-400', bgColor: 'bg-indigo-950/20', border: 'border-indigo-900/30', icon: Truck },
  completed: { label: 'Đã hoàn thành', color: 'text-teal-400', bgColor: 'bg-teal-950/20', border: 'border-teal-900/30', icon: Check },
  cancelled: { label: 'Đã hủy', color: 'text-rose-400', bgColor: 'bg-rose-950/20', border: 'border-rose-900/30', icon: X },
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isPending, startTransition] = useTransition()

  // Helper để phân tách dữ liệu khách hàng nếu bị gộp trong shipping_address
  const parseOrderCustomer = (order: Order) => {
    let name = order.full_name || 'Khách hàng'
    let phone = order.phone || ''
    let address = order.shipping_address || ''

    if (!order.full_name && address.startsWith('[Người nhận:')) {
      const match = address.match(/^\[Người nhận:\s*([^\]\-]+)(?:\s*-\s*SĐT:\s*([^\]]+))?\]\s*(.*)$/)
      if (match) {
        name = match[1].trim()
        phone = match[2] ? match[2].trim() : ''
        address = match[3] ? match[3].trim() : address
      }
    }
    return { name, phone, address }
  }

  // Lọc danh sách đơn hàng
  const filteredOrders = orders.filter(order => {
    const cust = parseOrderCustomer(order)
    const matchSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone.includes(searchTerm) ||
      cust.address.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchStatus = statusFilter === 'all' || order.status === statusFilter
    return matchSearch && matchStatus
  })

  // Cập nhật trạng thái đơn hàng
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, newStatus)
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
        }
      } else {
        alert('Cập nhật trạng thái thất bại: ' + res.error)
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Quản Lý Đơn Hàng</h1>
        <p className="text-zinc-500 text-sm mt-1">Danh sách và trạng thái xử lý các đơn đặt hàng từ khách hàng</p>
      </div>

      {/* Control bar */}
      <div className="bg-zinc-950/20 border border-zinc-800/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={16} className="text-zinc-500" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên khách, SĐT, mã đơn..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-zinc-800 focus:border-zinc-700 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Filter status */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Trạng thái:</span>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-zinc-900/50 border border-zinc-800 focus:border-zinc-700 rounded-xl text-sm text-zinc-300 font-semibold cursor-pointer focus:outline-none"
            >
              <option value="all" className="bg-zinc-950">Tất cả</option>
              <option value="pending" className="bg-zinc-950">Chờ xử lý</option>
              <option value="awaiting_payment" className="bg-zinc-950">Chờ thanh toán</option>
              <option value="paid" className="bg-zinc-950">Đã thanh toán</option>
              <option value="shipping" className="bg-zinc-950">Đang giao hàng</option>
              <option value="completed" className="bg-zinc-950">Đã hoàn thành</option>
              <option value="cancelled" className="bg-zinc-950">Đã hủy</option>
            </select>
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-500">
              <ChevronDown size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="bg-zinc-950/20 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/20 border-b border-zinc-900 text-[10px] text-zinc-500 font-black uppercase tracking-wider">
                <th className="py-4 px-6">Mã đơn hàng</th>
                <th className="py-4 px-6">Khách hàng</th>
                <th className="py-4 px-6">Ngày đặt</th>
                <th className="py-4 px-6">Thành tiền</th>
                <th className="py-4 px-6">Thanh toán</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/60">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => {
                  const cust = parseOrderCustomer(order)
                  const StatusConfig = STATUS_CONFIGS[order.status] || STATUS_CONFIGS.pending
                  const StatusIcon = StatusConfig.icon

                  return (
                    <tr key={order.id} className="hover:bg-zinc-900/10 transition-colors group">
                      {/* ID */}
                      <td className="py-4 px-6">
                        <span className="font-mono text-zinc-400 text-xs font-bold truncate max-w-[120px] block group-hover:text-emerald-400 transition-colors">
                          #{order.id.slice(-8)}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-6">
                        <div>
                          <div className="text-zinc-200 text-sm font-bold">{cust.name}</div>
                          <div className="text-zinc-500 text-xs mt-0.5">{cust.phone || 'Không có SĐT'}</div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-xs text-zinc-400 font-medium">
                        {new Date(order.created_at).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      {/* Total */}
                      <td className="py-4 px-6">
                        <span className="text-zinc-100 font-extrabold text-sm">
                          {Number(order.total_amount).toLocaleString('vi-VN')} đ
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-6">
                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                          {order.payment_method === 'payos' ? '💳 PayOS' : '💵 COD'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${StatusConfig.bgColor} ${StatusConfig.color} ${StatusConfig.border}`}>
                          <StatusIcon size={12} className="animate-pulse-slow" />
                          {StatusConfig.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 rounded-xl text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold"
                        >
                          <Eye size={14} />
                          <span>Chi tiết</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 text-xs">
                    Không tìm thấy đơn hàng nào phù hợp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail side-drawer / modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setSelectedOrder(null)}></div>
          
          {/* Drawer container */}
          <div className="relative w-full max-w-lg bg-zinc-950 border-l border-zinc-800/80 p-6 md:p-8 flex flex-col justify-between overflow-y-auto h-full shadow-2xl animate-slide-in-right">
            
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-zinc-900">
                <div>
                  <div className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Chi tiết đơn hàng</div>
                  <h3 className="text-lg font-extrabold text-zinc-200 font-mono mt-0.5">#{selectedOrder.id}</h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 border border-zinc-900 hover:border-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Status update selector */}
              <div className="py-6 border-b border-zinc-900">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Trạng thái xử lý</div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <select
                      value={selectedOrder.status}
                      disabled={isPending}
                      onChange={e => handleStatusChange(selectedOrder.id, e.target.value)}
                      className="w-full appearance-none pl-4 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-xl text-sm text-zinc-300 font-bold cursor-pointer focus:outline-none disabled:opacity-50"
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="awaiting_payment">Chờ thanh toán</option>
                      <option value="paid">Đã thanh toán</option>
                      <option value="shipping">Đang giao hàng</option>
                      <option value="completed">Đã hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-500">
                      {isPending ? <RefreshCw size={14} className="animate-spin" /> : <ChevronDown size={14} />}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info details */}
              <div className="py-6 border-b border-zinc-900 space-y-4">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Thông tin giao nhận</div>
                
                {(() => {
                  const cust = parseOrderCustomer(selectedOrder)
                  return (
                    <div className="space-y-3.5">
                      <div className="flex items-start gap-3.5 text-sm text-zinc-300">
                        <User size={16} className="text-zinc-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-zinc-200">{cust.name}</div>
                          <div className="text-zinc-500 text-xs mt-0.5">Tên người nhận</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5 text-sm text-zinc-300">
                        <Phone size={16} className="text-zinc-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-zinc-200">{cust.phone || 'N/A'}</div>
                          <div className="text-zinc-500 text-xs mt-0.5">Số điện thoại liên lạc</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5 text-sm text-zinc-300">
                        <MapPin size={16} className="text-zinc-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-zinc-200 leading-relaxed">{cust.address}</div>
                          <div className="text-zinc-500 text-xs mt-0.5">Địa chỉ giao hàng</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5 text-sm text-zinc-300">
                        <Calendar size={16} className="text-zinc-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-zinc-200">
                            {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}
                          </div>
                          <div className="text-zinc-500 text-xs mt-0.5">Thời gian đặt hàng</div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Items ordered list */}
              <div className="py-6 space-y-3">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Sản phẩm đã chọn</div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedOrder.order_items.map((item) => {
                    const itemName = item.product?.name || item.gift_combo?.name || 'Sản phẩm/Combo đặc sản'
                    return (
                      <div key={item.id} className="flex justify-between items-center py-2 px-3 bg-zinc-900/30 border border-zinc-900 rounded-xl text-sm">
                        <div className="truncate max-w-[240px]">
                          <div className="font-bold text-zinc-300 truncate">{itemName}</div>
                          <div className="text-zinc-500 text-xs mt-0.5">Số lượng: {item.quantity}</div>
                        </div>
                        <div className="font-bold text-zinc-200">
                          {(Number(item.price_at_purchase) * item.quantity).toLocaleString('vi-VN')} đ
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Total Footer */}
            <div className="pt-6 border-t border-zinc-900 flex justify-between items-center bg-zinc-950 mt-4">
              <div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tổng thanh toán</div>
                <div className="text-[10px] text-zinc-500 mt-0.5 font-bold uppercase tracking-wider">
                  Qua: {selectedOrder.payment_method === 'payos' ? 'PayOS' : 'COD'}
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {Number(selectedOrder.total_amount).toLocaleString('vi-VN')} đ
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
