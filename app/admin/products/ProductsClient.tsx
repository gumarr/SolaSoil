'use client'

import { useState } from 'react'
import { AdminTable, AdminRow, AdminCell, AdminFormModal, AdminInput, DeleteButton, AdminPageHeader } from '@/components/admin/AdminUI'
import { createProduct, updateProduct, deleteProduct } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'

export default function ProductsClient({ products, categories }: { products: any[], categories: any[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = editing
      ? await updateProduct(editing.id, fd)
      : await createProduct(fd)
    setLoading(false)
    if (res?.error) alert(res.error)
    else { setModalOpen(false); setEditing(null); router.refresh() }
  }

  const handleDelete = async (id: string) => {
    const res = await deleteProduct(id)
    if (res?.error) alert(res.error)
    else router.refresh()
  }

  const selectClassName = "w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm appearance-none cursor-pointer"

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || p.category_id === categoryFilter;
      const matchesStatus = 
        !statusFilter || 
        (statusFilter === 'active' && p.is_active) || 
        (statusFilter === 'inactive' && !p.is_active);
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'stock_asc') return (a.stock_quantity || 0) - (b.stock_quantity || 0);
      if (sortBy === 'stock_desc') return (b.stock_quantity || 0) - (a.stock_quantity || 0);
      if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'name_desc') return (b.name || '').localeCompare(a.name || '');
      return 0;
    });

  return (
    <>
      <AdminPageHeader title="Sản Phẩm" subtitle={`${filteredProducts.length} sản phẩm`} onAdd={() => { setEditing(null); setModalOpen(true) }} />

      {/* Bộ lọc và Tìm kiếm */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm placeholder-zinc-500"
          />
        </div>
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm appearance-none cursor-pointer"
          >
            <option value="" className="bg-zinc-950 text-zinc-300">Tất cả danh mục</option>
            {categories.map(c => (
              <option key={c.id} value={c.id} className="bg-zinc-950 text-zinc-300">{c.name}</option>
            ))}
          </select>
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
            <option value="stock_asc" className="bg-zinc-950 text-zinc-300">Tồn kho: Ít đến Nhiều</option>
            <option value="stock_desc" className="bg-zinc-950 text-zinc-300">Tồn kho: Nhiều đến Ít</option>
          </select>
        </div>
      </div>

      <AdminTable headers={['Tên', 'Danh mục', 'Giá', 'Tồn kho', 'Badge', 'Trạng thái', 'Thao tác']}>
        {filteredProducts.map(p => (
          <AdminRow key={p.id}>
            <AdminCell>
              <div className="flex items-center gap-3">
                <span className="text-2xl shrink-0">{p.emoji || '📦'}</span>
                <div>
                  <div className="font-semibold text-zinc-100">{p.name}</div>
                  {p.weight && <div className="text-[11px] text-zinc-500 mt-0.5 font-medium">{p.weight}</div>}
                </div>
              </div>
            </AdminCell>
            <AdminCell>{p.category?.name || '—'}</AdminCell>
            <AdminCell>
              <span className="text-amber-400 font-bold">{Number(p.price).toLocaleString('vi-VN')}đ</span>
            </AdminCell>
            <AdminCell>
              <span className="font-mono text-zinc-300">{p.stock_quantity}</span>
            </AdminCell>
            <AdminCell>
              {p.badge ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {p.badge}
                </span>
              ) : '—'}
            </AdminCell>
            <AdminCell>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                p.is_active 
                  ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/30' 
                  : 'bg-rose-950/30 text-rose-400 border-rose-900/30'
              }`}>
                {p.is_active ? 'Hoạt động' : 'Ẩn'}
              </span>
            </AdminCell>
            <AdminCell>
              <div className="flex items-center gap-2">
                <button 
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
                  onClick={() => { setEditing(p); setModalOpen(true) }}
                >
                  Sửa
                </button>
                <DeleteButton onDelete={() => handleDelete(p.id)} />
              </div>
            </AdminCell>
          </AdminRow>
        ))}
      </AdminTable>

      <AdminFormModal title={editing ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'} isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} onSubmit={handleSubmit} loading={loading}>
        <AdminInput label="Tên sản phẩm" name="name" defaultValue={editing?.name} required />
        <AdminInput label="Mô tả" name="description" defaultValue={editing?.description} rows={3} />
        <div className="grid grid-cols-2 gap-4">
          <AdminInput label="Giá (VND)" name="price" type="number" defaultValue={editing?.price} required />
          <AdminInput label="Khối lượng" name="weight" defaultValue={editing?.weight} placeholder="500g" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Danh mục</label>
          <div className="relative">
            <select name="category_id" defaultValue={editing?.category_id || ''} className={selectClassName}>
              <option value="" className="bg-zinc-950 text-zinc-300">— Chọn danh mục —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id} className="bg-zinc-950 text-zinc-300">{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <AdminInput label="OCOP Stars" name="ocop_stars" type="number" defaultValue={editing?.ocop_stars} />
          <AdminInput label="Tồn kho" name="stock_quantity" type="number" defaultValue={editing?.stock_quantity} />
          <AdminInput label="Xuất xứ" name="origin" defaultValue={editing?.origin} placeholder="Sơn La" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <AdminInput label="Emoji" name="emoji" defaultValue={editing?.emoji} placeholder="🥩" />
          <AdminInput label="Badge" name="badge" defaultValue={editing?.badge} placeholder="Bán chạy" />
        </div>
        <AdminInput label="Ảnh chính (URL)" name="image_main" defaultValue={editing?.image_main} placeholder="https://..." />
        <AdminInput label="Ảnh reveal (URL)" name="image_reveal" defaultValue={editing?.image_reveal} />
        <AdminInput label="Ảnh thumb (URL)" name="image_thumb" defaultValue={editing?.image_thumb} />
        
        {/* Các trường thông tin chi tiết */}
        <AdminInput label="Câu chuyện sản phẩm (Chi tiết)" name="detail_story" defaultValue={editing?.detail_story} rows={3} placeholder="Câu chuyện nguồn gốc, quy trình sản xuất..." />
        <AdminInput label="Thành phần" name="ingredients" defaultValue={editing?.ingredients} rows={2} placeholder="Thành phần tự nhiên của sản phẩm..." />
        <div className="grid grid-cols-2 gap-4">
          <AdminInput label="Hướng dẫn sử dụng" name="usage_instructions" defaultValue={editing?.usage_instructions} rows={2} placeholder="Cách chế biến, thưởng thức..." />
          <AdminInput label="Lợi ích sức khỏe / Công dụng" name="benefits" defaultValue={editing?.benefits} rows={2} placeholder="Lợi ích dinh dưỡng, sức khỏe..." />
        </div>

        <AdminInput label="Gradient" name="grad" defaultValue={editing?.grad} placeholder="from-stone-800 via-stone-700 to-amber-900" />
        <AdminInput label="Reveal Gradient" name="reveal_grad" defaultValue={editing?.reveal_grad} />
        <AdminInput label="Reveal Emoji" name="reveal_emoji" defaultValue={editing?.reveal_emoji} />
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
