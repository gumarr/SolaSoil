import { createClient } from '@/utils/supabase/server'
import TestimonialsClient from './TestimonialsClient'

export default async function AdminTestimonialsPage() {
  const supabase = await createClient()
  const { data: testimonials } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
  return <TestimonialsClient testimonials={testimonials || []} />
}
