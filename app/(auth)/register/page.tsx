import { RegisterForm } from '@/components/auth/register-form'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = {
  title: 'Đăng ký | Mộc Sơn',
  description: 'Tạo tài khoản Mộc Sơn để khám phá và mua sắm nông sản OCOP độc quyền.',
}

export default async function RegisterPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to home if already logged in
  if (user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-900 relative">
      {/* Quay về Trang chủ button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:border-white/20 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] group"
      >
        <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Quay về Trang chủ
      </Link>

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2813&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[4px]"></div>
      </div>
      
      <div className="relative z-10 flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 pt-10 text-center">
          <div className="bg-white/5 backdrop-blur-xl p-5 rounded-[2rem] inline-block shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/20 relative group transition-all duration-500 hover:bg-white/10 hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]">
            <h1 className="text-5xl font-black text-white uppercase tracking-widest drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center">
              Mộc Sơn
            </h1>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
