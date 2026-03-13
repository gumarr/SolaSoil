import { RegisterForm } from '@/components/auth/register-form'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Đăng ký | Mộc Sơn',
  description: 'Tạo tài khoản Mộc Sơn để khám phá và mua sắm nông sản OCOP độc quyền.',
}

export default async function RegisterPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Redirect to home if already logged in
  if (session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-900 relative">
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
