'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:-z-10">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-black text-white tracking-tight drop-shadow-sm">Chào mừng trở lại</h2>
          <p className="mt-3 text-sm text-white/80 font-medium">
            Trải nghiệm nông sản OCOP độc quyền cùng Mộc Sơn
          </p>
        </div>
        
        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <div className="space-y-4">
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
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-sm font-semibold text-white/90" htmlFor="password">Mật khẩu</label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
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
                'Đăng nhập'
              )}
            </button>
          </div>
        </form>
        <div className="mt-8 text-center">
           <p className="text-sm font-medium text-white/80">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="font-bold text-white hover:text-white/90 transition-all duration-300 underline decoration-white/40 hover:decoration-white underline-offset-4">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
