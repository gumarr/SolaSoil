'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Bell, X, ArrowRight, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

interface OrderNotification {
  id: string
  orderId: string
  fullName: string
  totalAmount: number
  paymentMethod: string
  timestamp: Date
}

export default function OrderNotificationHub() {
  const [notifications, setNotifications] = useState<OrderNotification[]>([])
  const supabase = createClient()

  // Hàm phát tiếng chuông thông báo lập trình (sử dụng Web Audio API)
  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return
      
      const ctx = new AudioContextClass()
      
      const playTone = (time: number, freq: number, duration: number) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, time)
        
        gain.gain.setValueAtTime(0, time)
        gain.gain.linearRampToValueAtTime(0.12, time + 0.03)
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration)
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.start(time)
        osc.stop(time + duration)
      }
      
      const now = ctx.currentTime
      playTone(now, 587.33, 0.3) // D5
      playTone(now + 0.1, 880.00, 0.4) // A5
    } catch (e) {
      console.warn('Web Audio API not allowed or supported by browser:', e)
    }
  }

  useEffect(() => {
    // Lắng nghe sự kiện chèn đơn hàng mới
    const channel = supabase
      .channel('admin_order_notification')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const newOrder = payload.new
          
          // Phát âm thanh
          playChime()

          // Tạo một ID thông báo duy nhất
          const notifId = crypto.randomUUID()
          
          const newNotification: OrderNotification = {
            id: notifId,
            orderId: newOrder.id,
            fullName: newOrder.full_name || 'Khách hàng ẩn danh',
            totalAmount: Number(newOrder.total_amount) || 0,
            paymentMethod: newOrder.payment_method || 'cod',
            timestamp: new Date(),
          }

          // Cập nhật state thông báo
          setNotifications((prev) => [newNotification, ...prev])

          // Tự động xóa thông báo sau 8 giây
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== notifId))
          }, 8000)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 max-w-sm w-full">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="bg-zinc-950/80 border border-emerald-500/50 backdrop-blur-xl rounded-2xl p-5 shadow-2xl animate-slide-in relative overflow-hidden group"
        >
          {/* Green highlight line */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-teal-400"></div>

          {/* Close button */}
          <button
            onClick={() => removeNotification(notif.id)}
            className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400 relative">
              <ShoppingCart size={16} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-zinc-950 rounded-full animate-ping"></span>
            </div>
            <div>
              <h4 className="text-zinc-100 font-extrabold text-sm tracking-tight">Đơn hàng mới!</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Vừa xong</p>
            </div>
          </div>

          {/* Body */}
          <div className="mt-3 space-y-1.5">
            <div className="text-xs text-zinc-300 flex justify-between">
              <span className="text-zinc-500">Khách hàng:</span>
              <span className="font-bold text-zinc-200">{notif.fullName}</span>
            </div>
            <div className="text-xs text-zinc-300 flex justify-between">
              <span className="text-zinc-500">Tổng tiền:</span>
              <span className="font-black text-emerald-400">{notif.totalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="text-xs text-zinc-300 flex justify-between">
              <span className="text-zinc-500">Thanh toán:</span>
              <span className="font-semibold text-zinc-400 uppercase text-[10px]">
                {notif.paymentMethod === 'payos' ? '💳 PayOS' : '💵 COD'}
              </span>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-end">
            <Link
              href={`/admin`}
              onClick={() => removeNotification(notif.id)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors group/link"
            >
              <span>Xem chi tiết dashboard</span>
              <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
