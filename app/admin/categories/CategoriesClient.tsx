'use client'
import { useState } from 'react'
import { AdminTable, AdminRow, AdminCell, AdminFormModal, AdminInput, DeleteButton, AdminPageHeader } from '@/components/admin/AdminUI'
import { createCategory, updateCategory, deleteCategory } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'

export default function CategoriesClient({ categories }: { categories: any[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = editing ? await updateCategory(editing.id, fd) : await createCategory(fd)
    setLoading(false)
    if (res?.error) alert(res.error)
    else { setModalOpen(false); setEditing(null); router.refresh() }
  }

  return (
    <>
      <AdminPageHeader title="Danh Mục" subtitle={`${categories.length} danh mục`} onAdd={() => { setEditing(null); setModalOpen(true) }} />
      <AdminTable headers={['Icon', 'Tên', 'Mô tả', 'Subtitle', '']}>
        {categories.map(c => (
          <AdminRow key={c.id}>
            <AdminCell><span style={{ fontSize: 24 }}>{c.icon}</span></AdminCell>
            <AdminCell><span style={{ fontWeight: 600, color: '#faf8f4' }}>{c.name}</span></AdminCell>
            <AdminCell>{c.description || '—'}</AdminCell>
            <AdminCell>{c.subtitle || '—'}</AdminCell>
            <AdminCell>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(157,196,158,0.12)', color: '#9dc49e', fontWeight: 600, fontSize: 12 }}
                  onClick={() => { setEditing(c); setModalOpen(true) }}>Sửa</button>
                <DeleteButton onDelete={async () => { const r = await deleteCategory(c.id); if (r?.error) alert(r.error); else router.refresh() }} />
              </div>
            </AdminCell>
          </AdminRow>
        ))}
      </AdminTable>
      <AdminFormModal title={editing ? 'Sửa Danh Mục' : 'Thêm Danh Mục'} isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} onSubmit={handleSubmit} loading={loading}>
        <AdminInput label="Tên" name="name" defaultValue={editing?.name} required />
        <AdminInput label="Icon (emoji)" name="icon" defaultValue={editing?.icon} placeholder="🥩" />
        <AdminInput label="Mô tả" name="description" defaultValue={editing?.description} rows={2} />
        <AdminInput label="Subtitle" name="subtitle" defaultValue={editing?.subtitle} />
        <AdminInput label="Gradient" name="grad" defaultValue={editing?.grad} placeholder="from-stone-900 to-amber-900" />
        <AdminInput label="Ảnh (URL)" name="image_url" defaultValue={editing?.image_url} />
      </AdminFormModal>
    </>
  )
}
