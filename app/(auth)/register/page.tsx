import { RegisterForm } from '@/components/auth/register-form'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Đăng ký | SolaSoil',
  description: 'Tạo tài khoản SolaSoil để khám phá và mua sắm nông sản OCOP độc quyền.',
}

export default async function RegisterPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Redirect to home if already logged in
  if (session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595841696250-258124252a4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2813&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]"></div>
      </div>
      
      <div className="relative z-10 flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 pt-10">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl inline-block shadow-2xl ring-1 ring-white/20 relative group">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200 uppercase tracking-wider drop-shadow-sm flex items-center justify-center">
              SolaSoil
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
