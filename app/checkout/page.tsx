'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import NavBar from '@/components/home/NavBar'
import Footer from '@/components/home/Footer'
import { createClient } from '@/utils/supabase/client'
import MapPickerModal from '@/components/checkout/MapPickerModal'

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, giftBoxes, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    shippingAddress: '',
    paymentMethod: 'cod' // default to COD
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        setFormData(prev => ({
          ...prev,
          fullName: user.user_metadata.full_name || '',
          email: user.email || ''
        }))
        setAuthLoading(false)
      } else {
        router.push('/login?redirect=/checkout')
      }
    })
  }, [router])

  const allItems = [
    ...cartItems.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.priceNum,
      quantity: item.qty,
      image: item.image_thumb || item.image_main
    })),
    ...giftBoxes.map(box => ({
      productId: null, // Gift boxes are complex, usually we'd handle them differently, but for simplicity:
      name: `Gói quà ${box.style}`,
      price: box.totalPrice,
      quantity: 1,
      image: null
    }))
  ]

  const subtotal = allItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingFee = 30000
  const total = subtotal + shippingFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (allItems.length === 0) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: allItems,
          shippingAddress: formData.shippingAddress,
          phone: formData.phone,
          fullName: formData.fullName,
          paymentMethod: formData.paymentMethod,
          totalAmount: total
        })
      })

      const data = await res.json()
      if (data.success) {
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
        } else {
          clearCart()
          router.push(`/checkout/success?orderId=${data.orderId}`)
        }
      } else {
        alert('Có lỗi xảy ra: ' + data.error)
      }
    } catch (err) {
      alert('Lỗi kết nối server')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Đang kiểm tra thông tin đăng nhập...</p>
      </div>
    )
  }

  if (allItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng của bạn đang trống</h1>
          <button onClick={() => router.push('/products')} className="bg-green-800 text-white px-8 py-3 rounded-xl font-bold">
            Tiếp tục mua sắm
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Thanh toán</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Shipping Form */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin giao hàng</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Địa chỉ giao hàng</label>
                    <button
                      type="button"
                      onClick={() => setIsMapModalOpen(true)}
                      className="text-xs text-green-800 hover:text-green-950 font-bold flex items-center gap-1 hover:underline transition-all"
                    >
                      📍 Chọn từ bản đồ (Google Maps)
                    </button>
                  </div>
                  <textarea
                    required
                    rows={3}
                    value={formData.shippingAddress}
                    onChange={e => setFormData({...formData, shippingAddress: e.target.value})}
                    placeholder="Nhập địa chỉ chi tiết hoặc chọn từ bản đồ..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-10 mb-6">Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                    className="hidden"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-green-600' : 'border-gray-300'}`}>
                    {formData.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>}
                  </div>
                  <span className="font-semibold text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                </label>

                <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'vnpay' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="vnpay"
                    checked={formData.paymentMethod === 'vnpay'}
                    onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                    className="hidden"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${formData.paymentMethod === 'vnpay' ? 'border-blue-600' : 'border-gray-300'}`}>
                    {formData.paymentMethod === 'vnpay' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Thanh toán qua VNPay</span>
                    <p className="text-xs text-gray-500">Thẻ ATM, Visa, Master, QR Pay</p>
                  </div>
                </label>
              </div>

              <button
                disabled={loading}
                className="w-full bg-green-800 hover:bg-green-900 text-white py-4 rounded-2xl font-bold text-lg mt-8 shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                   <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  formData.paymentMethod === 'vnpay' ? '🚀 Thanh toán ngay' : '📦 Đặt hàng ngay'
                )}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                {allItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" suppressHydrationWarning />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-xl font-black text-gray-900 pt-3 border-t border-gray-100">
                  <span>Tổng cộng</span>
                  <span className="text-green-800">{total.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <MapPickerModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onConfirm={(addr) => setFormData(prev => ({ ...prev, shippingAddress: addr }))}
        initialAddress={formData.shippingAddress}
      />
    </div>
  )
}
