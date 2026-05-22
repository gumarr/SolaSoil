'use client'
import { useState } from 'react'
import { AdminTable, AdminRow, AdminCell, AdminFormModal, AdminInput, DeleteButton, AdminPageHeader } from '@/components/admin/AdminUI'
import { createTestimonial, updateTestimonial, deleteTestimonial } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'

export default function TestimonialsClient({ testimonials }: { testimonials: any[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [sortBy, setSortBy] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = editing ? await updateTestimonial(editing.id, fd) : await createTestimonial(fd)
    setLoading(false)
    if (res?.error) alert(res.error)
    else { setModalOpen(false); setEditing(null); router.refresh() }
  }

  const selectClassName = "w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm appearance-none cursor-pointer"

  const filteredTestimonials = testimonials
    .filter(t => {
      const matchesSearch = 
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.role?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.text?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = !ratingFilter || String(t.rating) === ratingFilter;
      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'name_desc') return (b.name || '').localeCompare(a.name || '');
      if (sortBy === 'rating_desc') return Number(b.rating || 5) - Number(a.rating || 5);
      if (sortBy === 'rating_asc') return Number(a.rating || 5) - Number(b.rating || 5);
      return 0;
    });

  return (
    <>
      <AdminPageHeader title="Đánh Giá" subtitle={`${filteredTestimonials.length} đánh giá`} onAdd={() => { setEditing(null); setModalOpen(true) }} />

      {/* Bộ lọc và Tìm kiếm */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm đánh giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm placeholder-zinc-500"
          />
        </div>
        <div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm appearance-none cursor-pointer"
          >
            <option value="" className="bg-zinc-950 text-zinc-300">Tất cả số sao</option>
            <option value="5" className="bg-zinc-950 text-zinc-300">5 sao ⭐⭐⭐⭐⭐</option>
            <option value="4" className="bg-zinc-950 text-zinc-300">4 sao ⭐⭐⭐⭐</option>
            <option value="3" className="bg-zinc-950 text-zinc-300">3 sao ⭐⭐⭐</option>
            <option value="2" className="bg-zinc-950 text-zinc-300">2 sao ⭐⭐</option>
            <option value="1" className="bg-zinc-950 text-zinc-300">1 sao ⭐</option>
          </select>
        </div>
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm appearance-none cursor-pointer"
          >
            <option value="" className="bg-zinc-950 text-zinc-300">Sắp xếp theo...</option>
            <option value="name_asc" className="bg-zinc-950 text-zinc-300">Tên khách hàng: A-Z</option>
            <option value="name_desc" className="bg-zinc-950 text-zinc-300">Tên khách hàng: Z-A</option>
            <option value="rating_desc" className="bg-zinc-950 text-zinc-300">Đánh giá: Cao đến Thấp</option>
            <option value="rating_asc" className="bg-zinc-950 text-zinc-300">Đánh giá: Thấp đến Cao</option>
          </select>
        </div>
      </div>

      <AdminTable headers={['Tên', 'Vai trò', 'Nội dung', 'Địa điểm', 'Đánh giá', 'Thao tác']}>
        {filteredTestimonials.map(t => (
          <AdminRow key={t.id}>
            <AdminCell><span className="font-semibold text-zinc-100">{t.name}</span></AdminCell>
            <AdminCell>{t.role}</AdminCell>
            <AdminCell><span className="max-w-[200px] inline-block truncate">{t.text}</span></AdminCell>
            <AdminCell>{t.location}</AdminCell>
            <AdminCell><span className="text-amber-400 font-bold font-mono">{'⭐'.repeat(t.rating || 5)}</span></AdminCell>
            <AdminCell>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
                  onClick={() => { setEditing(t); setModalOpen(true) }}>Sửa</button>
                <DeleteButton onDelete={async () => { const r = await deleteTestimonial(t.id); if (r?.error) alert(r.error); else router.refresh() }} />
              </div>
            </AdminCell>
          </AdminRow>
        ))}
      </AdminTable>
      <AdminFormModal title={editing ? 'Sửa Đánh Giá' : 'Thêm Đánh Giá'} isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} onSubmit={handleSubmit} loading={loading}>
        <AdminInput label="Tên khách hàng" name="name" defaultValue={editing?.name} required />
        <AdminInput label="Vai trò" name="role" defaultValue={editing?.role} placeholder="Khách hàng thân thiết" />
        <AdminInput label="Nội dung đánh giá" name="text" defaultValue={editing?.text} rows={4} required />
        <div className="grid grid-cols-2 gap-4">
          <AdminInput label="Địa điểm" name="location" defaultValue={editing?.location} placeholder="Hà Nội" />
          <AdminInput label="Rating (1-5)" name="rating" type="number" defaultValue={editing?.rating || 5} />
        </div>
        {editing && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Trạng thái</label>
            <select name="is_active" defaultValue={String(editing.is_active)} className={selectClassName}>
              <option value="true" className="bg-zinc-950 text-zinc-300">Hiển thị</option>
              <option value="false" className="bg-zinc-950 text-zinc-300">Ẩn</option>
            </select>
          </div>
        )}
      </AdminFormModal>
    </>
  )
}
