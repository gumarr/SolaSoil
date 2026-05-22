'use client'
import { useState } from 'react'
import { AdminTable, AdminRow, AdminCell, AdminFormModal, AdminInput, DeleteButton, AdminPageHeader } from '@/components/admin/AdminUI'
import { createCategory, updateCategory, deleteCategory } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'

export default function CategoriesClient({ categories }: { categories: any[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = editing ? await updateCategory(editing.id, fd) : await createCategory(fd)
    setLoading(false)
    if (res?.error) alert(res.error)
    else { setModalOpen(false); setEditing(null); router.refresh() }
  }

  const filteredCategories = categories
    .filter(c => {
      const matchesSearch = 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'name_desc') return (b.name || '').localeCompare(a.name || '');
      return 0;
    });

  return (
    <>
      <AdminPageHeader title="Danh Mục" subtitle={`${filteredCategories.length} danh mục`} onAdd={() => { setEditing(null); setModalOpen(true) }} />

      {/* Bộ lọc và Tìm kiếm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm placeholder-zinc-500"
          />
        </div>
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm appearance-none cursor-pointer"
          >
            <option value="" className="bg-zinc-950 text-zinc-300">Sắp xếp theo...</option>
            <option value="name_asc" className="bg-zinc-950 text-zinc-300">Tên: A-Z</option>
            <option value="name_desc" className="bg-zinc-950 text-zinc-300">Tên: Z-A</option>
          </select>
        </div>
      </div>

      <AdminTable headers={['Icon', 'Tên', 'Mô tả', 'Subtitle', 'Thao tác']}>
        {filteredCategories.map(c => (
          <AdminRow key={c.id}>
            <AdminCell><span className="text-2xl shrink-0">{c.icon || '📦'}</span></AdminCell>
            <AdminCell><span className="font-semibold text-zinc-100">{c.name}</span></AdminCell>
            <AdminCell>{c.description || '—'}</AdminCell>
            <AdminCell>{c.subtitle || '—'}</AdminCell>
            <AdminCell>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
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
