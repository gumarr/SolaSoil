'use client'
import { useState } from 'react'
import { AdminTable, AdminRow, AdminCell, AdminFormModal, AdminInput, AdminMediaUpload, DeleteButton, AdminPageHeader } from '@/components/admin/AdminUI'
import { createGiftCombo, updateGiftCombo, deleteGiftCombo } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'

export default function GiftCombosClient({ giftCombos }: { giftCombos: any[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = editing ? await updateGiftCombo(editing.id, fd) : await createGiftCombo(fd)
    setLoading(false)
    if (res?.error) alert(res.error)
    else { setModalOpen(false); setEditing(null); router.refresh() }
  }

  const selectClassName = "w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm appearance-none cursor-pointer"

  const filteredGiftCombos = giftCombos
    .filter(g => {
      const matchesSearch = 
        g.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        g.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.tag?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = 
        !statusFilter || 
        (statusFilter === 'active' && g.is_active) || 
        (statusFilter === 'inactive' && !g.is_active);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'name_desc') return (b.name || '').localeCompare(a.name || '');
      if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
      return 0;
    });

  return (
    <>
      <AdminPageHeader title="Hộp Quà" subtitle={`${filteredGiftCombos.length} hộp quà`} onAdd={() => { setEditing(null); setModalOpen(true) }} />

      {/* Bộ lọc và Tìm kiếm */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm hộp quà..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm placeholder-zinc-500"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm appearance-none cursor-pointer"
          >
            <option value="" className="bg-zinc-950 text-zinc-300">Tất cả trạng thái</option>
            <option value="active" className="bg-zinc-950 text-zinc-300">Hoạt động</option>
            <option value="inactive" className="bg-zinc-950 text-zinc-300">Ẩn</option>
          </select>
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
            <option value="price_asc" className="bg-zinc-950 text-zinc-300">Giá: Thấp đến Cao</option>
            <option value="price_desc" className="bg-zinc-950 text-zinc-300">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      <AdminTable headers={['Emoji', 'Tên', 'Mô tả', 'Giá', 'Tag', 'Trạng thái', 'Thao tác']}>
        {filteredGiftCombos.map(g => (
          <AdminRow key={g.id}>
            <AdminCell><span className="text-2xl shrink-0">{g.emoji || '🎁'}</span></AdminCell>
            <AdminCell><span className="font-semibold text-zinc-100">{g.name}</span></AdminCell>
            <AdminCell><span className="max-w-[180px] inline-block truncate">{g.description}</span></AdminCell>
            <AdminCell><span className="text-amber-400 font-bold">{Number(g.price).toLocaleString('vi-VN')}đ</span></AdminCell>
            <AdminCell>
              {g.tag ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {g.tag}
                </span>
              ) : '—'}
            </AdminCell>
            <AdminCell>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                g.is_active 
                  ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/30' 
                  : 'bg-rose-950/30 text-rose-400 border-rose-900/30'
              }`}>
                {g.is_active ? 'Hoạt động' : 'Ẩn'}
              </span>
            </AdminCell>
            <AdminCell>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
                  onClick={() => { setEditing(g); setModalOpen(true) }}>Sửa</button>
                <DeleteButton onDelete={async () => { const r = await deleteGiftCombo(g.id); if (r?.error) alert(r.error); else router.refresh() }} />
              </div>
            </AdminCell>
          </AdminRow>
        ))}
      </AdminTable>
      <AdminFormModal title={editing ? 'Sửa Hộp Quà' : 'Thêm Hộp Quà'} isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} onSubmit={handleSubmit} loading={loading}>
        <AdminInput label="Tên" name="name" defaultValue={editing?.name} required />
        <AdminInput label="Mô tả" name="description" defaultValue={editing?.description} rows={3} />
        <div className="grid grid-cols-2 gap-4">
          <AdminInput label="Giá (VND)" name="price" type="number" defaultValue={editing?.price} required />
          <AdminInput label="Tag" name="tag" defaultValue={editing?.tag} placeholder="Phổ Biến" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <AdminInput label="Emoji" name="emoji" defaultValue={editing?.emoji} placeholder="🎁" />
          <AdminInput label="Gradient" name="grad" defaultValue={editing?.grad} placeholder="from-stone-800 to-green-900" />
        </div>
        <AdminMediaUpload label="Ảnh (URL)" name="image_url" defaultValue={editing?.image_url} />
        {editing && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Trạng thái</label>
            <select name="is_active" defaultValue={String(editing.is_active)} className={selectClassName}>
              <option value="true" className="bg-zinc-950 text-zinc-300">Hoạt động</option>
              <option value="false" className="bg-zinc-950 text-zinc-300">Ẩn</option>
            </select>
          </div>
        )}
      </AdminFormModal>
    </>
  )
}
