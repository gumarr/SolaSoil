'use client'

import { useState } from 'react'
import { AdminTable, AdminRow, AdminCell, AdminFormModal, AdminInput, DeleteButton, AdminPageHeader } from '@/components/admin/AdminUI'
import { createProduct, updateProduct, deleteProduct } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'

export default function ProductsClient({ products, categories }: { products: any[], categories: any[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(false)
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

  return (
    <>
      <AdminPageHeader title="Sản Phẩm" subtitle={`${products.length} sản phẩm`} onAdd={() => { setEditing(null); setModalOpen(true) }} />

      <AdminTable headers={['Tên', 'Danh mục', 'Giá', 'Tồn kho', 'Badge', 'Trạng thái', '']}>
        {products.map(p => (
          <AdminRow key={p.id}>
            <AdminCell>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{p.emoji || '📦'}</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#faf8f4' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(201,222,202,0.4)' }}>{p.weight}</div>
                </div>
              </div>
            </AdminCell>
            <AdminCell>{p.category?.name || '—'}</AdminCell>
            <AdminCell><span style={{ color: '#f6c87a', fontWeight: 700 }}>{Number(p.price).toLocaleString('vi-VN')}đ</span></AdminCell>
            <AdminCell>{p.stock_quantity}</AdminCell>
            <AdminCell>{p.badge || '—'}</AdminCell>
            <AdminCell>
              <span style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                background: p.is_active ? 'rgba(77,133,80,0.15)' : 'rgba(220,50,50,0.15)',
                color: p.is_active ? '#9dc49e' : '#f87171',
              }}>
                {p.is_active ? 'Hoạt động' : 'Ẩn'}
              </span>
            </AdminCell>
            <AdminCell>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(157,196,158,0.12)', color: '#9dc49e', fontWeight: 600, fontSize: 12 }}
                  onClick={() => { setEditing(p); setModalOpen(true) }}>Sửa</button>
                <DeleteButton onDelete={() => handleDelete(p.id)} />
              </div>
            </AdminCell>
          </AdminRow>
        ))}
      </AdminTable>

      <AdminFormModal title={editing ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'} isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} onSubmit={handleSubmit} loading={loading}>
        <AdminInput label="Tên sản phẩm" name="name" defaultValue={editing?.name} required />
        <AdminInput label="Mô tả" name="description" defaultValue={editing?.description} rows={3} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AdminInput label="Giá (VND)" name="price" type="number" defaultValue={editing?.price} required />
          <AdminInput label="Khối lượng" name="weight" defaultValue={editing?.weight} placeholder="500g" />
        </div>
        <div>
          <label style={{ color: 'rgba(201,222,202,0.6)', fontSize: 11, fontWeight: 600, marginBottom: 4, display: 'block' }}>Danh mục</label>
          <select name="category_id" defaultValue={editing?.category_id || ''} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(157,196,158,0.15)', color: '#faf8f4', fontSize: 13 }}>
            <option value="">— Chọn —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <AdminInput label="OCOP Stars" name="ocop_stars" type="number" defaultValue={editing?.ocop_stars} />
          <AdminInput label="Tồn kho" name="stock_quantity" type="number" defaultValue={editing?.stock_quantity} />
          <AdminInput label="Xuất xứ" name="origin" defaultValue={editing?.origin} placeholder="Sơn La" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AdminInput label="Emoji" name="emoji" defaultValue={editing?.emoji} placeholder="🥩" />
          <AdminInput label="Badge" name="badge" defaultValue={editing?.badge} placeholder="Bán chạy" />
        </div>
        <AdminInput label="Ảnh chính (URL)" name="image_main" defaultValue={editing?.image_main} placeholder="https://..." />
        <AdminInput label="Ảnh reveal (URL)" name="image_reveal" defaultValue={editing?.image_reveal} />
        <AdminInput label="Ảnh thumb (URL)" name="image_thumb" defaultValue={editing?.image_thumb} />
        <AdminInput label="Gradient" name="grad" defaultValue={editing?.grad} placeholder="from-stone-800 via-stone-700 to-amber-900" />
        <AdminInput label="Reveal Gradient" name="reveal_grad" defaultValue={editing?.reveal_grad} />
        <AdminInput label="Reveal Emoji" name="reveal_emoji" defaultValue={editing?.reveal_emoji} />
        {editing && (
          <div>
            <label style={{ color: 'rgba(201,222,202,0.6)', fontSize: 11, fontWeight: 600 }}>Trạng thái</label>
            <select name="is_active" defaultValue={String(editing.is_active)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(157,196,158,0.15)', color: '#faf8f4', fontSize: 13 }}>
              <option value="true">Hoạt động</option>
              <option value="false">Ẩn</option>
            </select>
          </div>
        )}
      </AdminFormModal>
    </>
  )
}
