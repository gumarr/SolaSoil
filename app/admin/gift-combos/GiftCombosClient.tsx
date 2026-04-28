'use client'
import { useState } from 'react'
import { AdminTable, AdminRow, AdminCell, AdminFormModal, AdminInput, DeleteButton, AdminPageHeader } from '@/components/admin/AdminUI'
import { createGiftCombo, updateGiftCombo, deleteGiftCombo } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'

export default function GiftCombosClient({ giftCombos }: { giftCombos: any[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = editing ? await updateGiftCombo(editing.id, fd) : await createGiftCombo(fd)
    setLoading(false)
    if (res?.error) alert(res.error)
    else { setModalOpen(false); setEditing(null); router.refresh() }
  }

  return (
    <>
      <AdminPageHeader title="Hộp Quà" subtitle={`${giftCombos.length} hộp quà`} onAdd={() => { setEditing(null); setModalOpen(true) }} />
      <AdminTable headers={['Emoji', 'Tên', 'Mô tả', 'Giá', 'Tag', 'Trạng thái', '']}>
        {giftCombos.map(g => (
          <AdminRow key={g.id}>
            <AdminCell><span style={{ fontSize: 24 }}>{g.emoji}</span></AdminCell>
            <AdminCell><span style={{ fontWeight: 600, color: '#faf8f4' }}>{g.name}</span></AdminCell>
            <AdminCell><span style={{ maxWidth: 180, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.description}</span></AdminCell>
            <AdminCell><span style={{ color: '#f6c87a', fontWeight: 700 }}>{Number(g.price).toLocaleString('vi-VN')}đ</span></AdminCell>
            <AdminCell>{g.tag || '—'}</AdminCell>
            <AdminCell>
              <span style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                background: g.is_active ? 'rgba(77,133,80,0.15)' : 'rgba(220,50,50,0.15)',
                color: g.is_active ? '#9dc49e' : '#f87171',
              }}>
                {g.is_active ? 'Hoạt động' : 'Ẩn'}
              </span>
            </AdminCell>
            <AdminCell>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(157,196,158,0.12)', color: '#9dc49e', fontWeight: 600, fontSize: 12 }}
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AdminInput label="Giá (VND)" name="price" type="number" defaultValue={editing?.price} required />
          <AdminInput label="Tag" name="tag" defaultValue={editing?.tag} placeholder="Phổ Biến" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AdminInput label="Emoji" name="emoji" defaultValue={editing?.emoji} placeholder="🎁" />
          <AdminInput label="Gradient" name="grad" defaultValue={editing?.grad} placeholder="from-stone-800 to-green-900" />
        </div>
        <AdminInput label="Ảnh (URL)" name="image_url" defaultValue={editing?.image_url} />
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
