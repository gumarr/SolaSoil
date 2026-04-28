'use client'
import { useState } from 'react'
import { AdminTable, AdminRow, AdminCell, AdminFormModal, AdminInput, DeleteButton, AdminPageHeader } from '@/components/admin/AdminUI'
import { createTestimonial, updateTestimonial, deleteTestimonial } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'

export default function TestimonialsClient({ testimonials }: { testimonials: any[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = editing ? await updateTestimonial(editing.id, fd) : await createTestimonial(fd)
    setLoading(false)
    if (res?.error) alert(res.error)
    else { setModalOpen(false); setEditing(null); router.refresh() }
  }

  return (
    <>
      <AdminPageHeader title="Đánh Giá" subtitle={`${testimonials.length} đánh giá`} onAdd={() => { setEditing(null); setModalOpen(true) }} />
      <AdminTable headers={['Tên', 'Vai trò', 'Nội dung', 'Địa điểm', 'Rating', '']}>
        {testimonials.map(t => (
          <AdminRow key={t.id}>
            <AdminCell><span style={{ fontWeight: 600, color: '#faf8f4' }}>{t.name}</span></AdminCell>
            <AdminCell>{t.role}</AdminCell>
            <AdminCell><span style={{ maxWidth: 200, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text}</span></AdminCell>
            <AdminCell>{t.location}</AdminCell>
            <AdminCell>{'⭐'.repeat(t.rating || 5)}</AdminCell>
            <AdminCell>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(157,196,158,0.12)', color: '#9dc49e', fontWeight: 600, fontSize: 12 }}
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AdminInput label="Địa điểm" name="location" defaultValue={editing?.location} placeholder="Hà Nội" />
          <AdminInput label="Rating (1-5)" name="rating" type="number" defaultValue={editing?.rating || 5} />
        </div>
        {editing && (
          <div>
            <label style={{ color: 'rgba(201,222,202,0.6)', fontSize: 11, fontWeight: 600 }}>Trạng thái</label>
            <select name="is_active" defaultValue={String(editing.is_active)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(157,196,158,0.15)', color: '#faf8f4', fontSize: 13 }}>
              <option value="true">Hiển thị</option>
              <option value="false">Ẩn</option>
            </select>
          </div>
        )}
      </AdminFormModal>
    </>
  )
}
