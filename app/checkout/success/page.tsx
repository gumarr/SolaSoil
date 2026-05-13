'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/home/NavBar'
import Footer from '@/components/home/Footer'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
        ✓
      </div>
      <h1 className="text-4xl font-black text-gray-900 mb-4">Đặt hàng thành công!</h1>
      <p className="text-gray-600 mb-8 text-lg">
        Cảm ơn bạn đã tin tưởng Mộc Sơn. Mã đơn hàng của bạn là: <span className="font-bold text-green-800">{orderId}</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/" className="bg-green-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-900 transition-all">
          Về trang chủ
        </Link>
        <Link href="/products" className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all">
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  )
}
