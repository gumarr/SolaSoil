'use client'

import { useState } from 'react'

// ── Backward Compatible Style Fallbacks (Zinc & Emerald theme) ────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 12,
  background: '#18181b',
  border: '1px solid #27272a',
  color: '#f4f4f5', fontSize: 13, outline: 'none',
}

const btnPrimary: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
  background: '#10b981',
  color: '#ffffff', fontWeight: 700, fontSize: 13,
}

const btnDanger: React.CSSProperties = {
  padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
  background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontWeight: 600, fontSize: 12,
}

const btnEdit: React.CSSProperties = {
  padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
  background: 'rgba(39, 39, 42, 0.8)', color: '#e4e4e7', fontWeight: 600, fontSize: 12,
}

// ── Table wrapper ────────────────────────────────────────────
export function AdminTable({ headers, children }: { headers: string[], children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-md shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/30">
              {headers.map(h => (
                <th key={h} className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">{children}</tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="hover:bg-zinc-900/30 transition-colors duration-150">
      {children}
    </tr>
  )
}

export function AdminCell({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 text-sm text-zinc-300 align-middle">{children}</td>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 md:p-8 shadow-2xl flex flex-col gap-6 max-h-[85vh] animate-fade-in-grow"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-zinc-800/80 pb-4">
          <h3 className="text-lg font-bold text-zinc-100 tracking-tight">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded-xl hover:bg-zinc-900 transition-colors"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-5 overflow-hidden">
          <div className="space-y-4 overflow-y-auto pr-1 py-1 max-h-[50vh]">
            {children}
          </div>
          <div className="flex gap-3 pt-5 border-t border-zinc-800/80 mt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all duration-150 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu dữ liệu'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-semibold text-sm transition-all duration-150 cursor-pointer"
            >
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
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
        {label}
      </label>
      {rows ? (
        <textarea 
          name={name} 
          defaultValue={defaultValue ?? ''} 
          required={required}
          placeholder={placeholder} 
          rows={rows}
          className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm resize-none" 
        />
      ) : (
        <input 
          name={name} 
          type={type} 
          defaultValue={defaultValue ?? ''} 
          required={required}
          placeholder={placeholder} 
          className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm" 
        />
      )}
    </div>
  )
}

// ── Delete confirm ───────────────────────────────────────────
export function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div className="flex gap-2">
        <button 
          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm shadow-rose-950/20"
          onClick={onDelete}
        >
          Xác nhận
        </button>
        <button 
          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors cursor-pointer border border-zinc-700"
          onClick={() => setConfirming(false)}
        >
          Hủy
        </button>
      </div>
    )
  }

  return (
    <button 
      className="px-3 py-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/40 text-rose-400 border border-rose-900/30 font-semibold text-xs transition-colors cursor-pointer"
      onClick={() => setConfirming(true)}
    >
      Xóa
    </button>
  )
}

// ── Page Header ──────────────────────────────────────────────
export function AdminPageHeader({ title, subtitle, onAdd }: { title: string, subtitle: string, onAdd: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">{title}</h1>
        <p className="text-zinc-500 text-sm mt-1">{subtitle}</p>
      </div>
      <button 
        onClick={onAdd} 
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all duration-150 cursor-pointer hover:shadow-emerald-950/15"
      >
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
        Thêm mới
      </button>
    </div>
  )
}

export { inputStyle, btnPrimary, btnDanger, btnEdit }
