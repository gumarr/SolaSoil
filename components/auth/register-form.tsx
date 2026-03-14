'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export function RegisterForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Supabase Auth requires minimum 6 characters for default setting
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      setLoading(false)
      return
    }

    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
    } else {
      if (data?.session) {
        // Automatically logged in (if email confirmation is turned off)
        router.push('/')
        router.refresh()
      } else {
        // Email confirmation required
        setSuccess(true)
        setLoading(false)
      }
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md p-10 space-y-8 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.4)] border border-white/30 relative overflow-hidden text-center before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:-z-10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-green-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-emerald-400/30 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-6">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <svg className="w-12 h-12 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-lg">Đăng ký thành công!</h2>
          <div className="bg-black/20 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-inner">
            <p className="text-xl text-white font-medium leading-relaxed drop-shadow-md">
              Một email xác nhận đã được gửi đến hộp thư của bạn.
            </p>
            <p className="mt-3 text-white/90 font-bold bg-white/10 py-2 px-4 rounded-xl border border-white/20 inline-block uppercase tracking-wide text-sm">
              Vui lòng kiểm tra email và bấm vào liên kết để kích hoạt tài khoản.
            </p>
          </div>
          <p className="text-sm text-white/70 italic">
            Lưu ý: Nếu không tìm thấy, vui lòng kiểm tra cả thư mục Spam/Junk.
          </p>
          <Link href="/login" className="mt-8 inline-flex justify-center items-center w-full py-4 px-6 border border-white/30 text-base font-bold rounded-2xl text-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.3)] hover:-translate-y-1">
            Đến trang Đăng nhập
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:-z-10">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-black text-white tracking-tight drop-shadow-sm">Tạo tài khoản mới</h2>
          <p className="mt-3 text-sm text-white/80 font-medium">
            Trở thành thành viên của gia đình Mộc Sơn
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5 ml-1" htmlFor="fullName">Họ và tên</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="appearance-none block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-md sm:text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5 ml-1" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-md sm:text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5 ml-1" htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-md sm:text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-rose-200 text-sm font-medium bg-rose-500/20 backdrop-blur-md p-4 rounded-2xl border border-rose-500/30 flex items-center shadow-[0_4px_12px_rgba(225,29,72,0.2)]">
              <svg className="w-5 h-5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-white/20 text-sm font-bold rounded-2xl text-white bg-white/10 hover:bg-white/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_32px_rgba(255,255,255,0.2)] hover:-translate-y-1"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                'Đăng ký'
              )}
            </button>
          </div>
        </form>
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-white/80">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-bold text-white hover:text-white/90 transition-all duration-300 underline decoration-white/40 hover:decoration-white underline-offset-4">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
