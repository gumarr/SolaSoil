'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/home/NavBar'
import Footer from '@/components/home/Footer'
import { Suspense } from 'react'

function FailureContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const code = searchParams.get('code')

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
        ✕
      </div>
      <h1 className="text-4xl font-black text-gray-900 mb-4">Thanh toán thất bại</h1>
      <p className="text-gray-600 mb-8 text-lg">
        {error === 'invalid_signature' 
          ? 'Chữ ký giao dịch không hợp lệ. Vui lòng liên hệ hỗ trợ.'
          : 'Rất tiếc, đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.'}
        {code && <span className="block text-sm mt-2 opacity-50">(Mã lỗi: {code})</span>}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/checkout" className="bg-green-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-900 transition-all">
          Thử lại
        </Link>
        <Link href="/" className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all">
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}

export default function FailurePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Suspense fallback={<div>Loading...</div>}>
        <FailureContent />
      </Suspense>
      <Footer />
    </div>
  )
}
