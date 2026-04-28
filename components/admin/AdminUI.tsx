'use client'

import { useState } from 'react'

// ── Shared Styles ────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(157,196,158,0.15)',
  color: '#faf8f4', fontSize: 13, outline: 'none',
}

const btnPrimary: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
  background: 'linear-gradient(135deg, #2f5632, #4d8550)',
  color: '#faf8f4', fontWeight: 700, fontSize: 13,
}

const btnDanger: React.CSSProperties = {
  padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
  background: 'rgba(220,50,50,0.15)', color: '#f87171', fontWeight: 600, fontSize: 12,
}

const btnEdit: React.CSSProperties = {
  padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
  background: 'rgba(157,196,158,0.12)', color: '#9dc49e', fontWeight: 600, fontSize: 12,
}

// ── Table wrapper ────────────────────────────────────────────
export function AdminTable({ headers, children }: { headers: string[], children: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid rgba(157,196,158,0.12)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(157,196,158,0.06)' }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(201,222,202,0.6)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function AdminRow({ children }: { children: React.ReactNode }) {
  return (
    <tr style={{ borderTop: '1px solid rgba(157,196,158,0.08)' }}>
      {children}
    </tr>
  )
}

export function AdminCell({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: '12px 16px', color: '#c9deca', fontSize: 13 }}>{children}</td>
}

// ── Form Modal ───────────────────────────────────────────────
export function AdminFormModal({
  title, isOpen, onClose, onSubmit, children, loading
}: {
  title: string, isOpen: boolean, onClose: () => void,
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  children: React.ReactNode, loading?: boolean
}) {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div style={{
        background: '#1a2e1b', borderRadius: 20, padding: '28px 32px',
        border: '1px solid rgba(157,196,158,0.15)',
        width: '100%', maxWidth: 520, maxHeight: '85vh', overflowY: 'auto',
      }} onClick={e => e.stopPropagation()}>
        <h3 style={{ color: '#faf8f4', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{title}</h3>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {children}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" style={btnPrimary} disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button type="button" onClick={onClose} style={{ ...btnEdit, padding: '10px 20px' }}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Form Input ───────────────────────────────────────────────
export function AdminInput({
  label, name, defaultValue, type = 'text', required, placeholder, rows
}: {
  label: string, name: string, defaultValue?: string | number | null,
  type?: string, required?: boolean, placeholder?: string, rows?: number
}) {
  return (
    <div>
      <label style={{ color: 'rgba(201,222,202,0.6)', fontSize: 11, fontWeight: 600, marginBottom: 4, display: 'block' }}>
        {label}
      </label>
      {rows ? (
        <textarea name={name} defaultValue={defaultValue ?? ''} required={required}
          placeholder={placeholder} rows={rows}
          style={{ ...inputStyle, resize: 'vertical' }} />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue ?? ''} required={required}
          placeholder={placeholder} style={inputStyle} />
      )}
    </div>
  )
}

// ── Delete confirm ───────────────────────────────────────────
export function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div style={{ display: 'flex', gap: 4 }}>
        <button style={{ ...btnDanger, background: 'rgba(220,50,50,0.3)' }} onClick={onDelete}>Xác nhận</button>
        <button style={btnEdit} onClick={() => setConfirming(false)}>Hủy</button>
      </div>
    )
  }

  return <button style={btnDanger} onClick={() => setConfirming(true)}>Xóa</button>
}

// ── Page Header ──────────────────────────────────────────────
export function AdminPageHeader({ title, subtitle, onAdd }: { title: string, subtitle: string, onAdd: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
      <div>
        <h1 style={{ color: '#faf8f4', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{title}</h1>
        <p style={{ color: 'rgba(201,222,202,0.5)', fontSize: 14 }}>{subtitle}</p>
      </div>
      <button onClick={onAdd} style={btnPrimary}>+ Thêm mới</button>
    </div>
  )
}

export { inputStyle, btnPrimary, btnDanger, btnEdit }
