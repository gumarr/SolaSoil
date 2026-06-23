'use client'

import { useState, useMemo } from 'react'
import { 
  Search, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Globe, 
  Clock, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  TrendingUp, 
  Compass,
  ArrowUpRight,
  RefreshCw,
  Filter
} from 'lucide-react'

// Cấu trúc dữ liệu Visitor
interface VisitorSession {
  id: string
  ip: string
  location: string
  device: 'Mobile' | 'Desktop' | 'Tablet'
  browser: string
  referrer: string
  activePage: string
  status: 'active' | 'offline'
  timeAgo: string
  duration: string
  timestamp: Date
}

// Hàm băm giả lập nhất quán dựa trên hạt giống (seed) để tránh lỗi Hydration của Next.js
function getDeterministicRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function VisitorAnalytics() {
  const [searchTerm, setSearchTerm] = useState('')
  const [deviceFilter, setDeviceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // 1. Tạo danh sách 325 khách truy cập ngẫu nhiên nhưng ổn định (deterministic)
  const visitors: VisitorSession[] = useMemo(() => {
    const list: VisitorSession[] = []
    
    const locations = [
      { name: 'Hà Nội', weight: 0.35 },
      { name: 'TP. Hồ Chí Minh', weight: 0.30 },
      { name: 'Sơn La', weight: 0.15 },
      { name: 'Đà Nẵng', weight: 0.08 },
      { name: 'Hải Phòng', weight: 0.06 },
      { name: 'Mộc Châu', weight: 0.04 },
      { name: 'Cần Thơ', weight: 0.02 }
    ]

    const referrers = [
      { name: 'Google Search', weight: 0.38 },
      { name: 'Facebook', weight: 0.28 },
      { name: 'Trực tiếp (Direct)', weight: 0.20 },
      { name: 'Zalo', weight: 0.10 },
      { name: 'TikTok', weight: 0.04 }
    ]

    const pages = [
      { path: '/', label: 'Trang chủ' },
      { path: '/san-pham', label: 'Chi tiết sản phẩm' },
      { path: '/combo-qua', label: 'Combo quà tặng' },
      { path: '/tin-tuc', label: 'Tin tức ẩm thực' },
      { path: '/gioi-thieu', label: 'Về Mộc Sơn' }
    ]

    const devices = [
      { type: 'Mobile', browser: 'Chrome Mobile', weight: 0.58 },
      { type: 'Desktop', browser: 'Chrome Desktop', weight: 0.35 },
      { type: 'Tablet', browser: 'Safari Mobile', weight: 0.07 }
    ]

    // Hàm chọn ngẫu nhiên dựa trên phân bổ trọng số và hạt giống seed
    const pickWeighted = <T extends { weight: number }>(items: T[], seed: number): T => {
      const rand = getDeterministicRandom(seed)
      let sum = 0
      for (const item of items) {
        sum += item.weight
        if (rand <= sum) return item
      }
      return items[items.length - 1]
    }

    const now = new Date()

    for (let i = 0; i < 325; i++) {
      const seed = i + 1024
      const randVal = getDeterministicRandom(seed)

      // Chọn location
      const locationObj = pickWeighted(locations, seed)
      // Chọn referrer
      const referrerObj = pickWeighted(referrers, seed + 1)
      // Chọn device & browser
      const deviceObj = pickWeighted(devices, seed + 2)
      // Chọn page
      const pageIndex = Math.floor(getDeterministicRandom(seed + 3) * pages.length)
      const pageObj = pages[pageIndex]

      // Trạng thái: 12 người đầu tiên là Đang hoạt động (active), còn lại Offline
      const isActive = i < 12
      
      // Tạo địa chỉ IP ngẫu nhiên Việt Nam
      const ipA = 14 + Math.floor(getDeterministicRandom(seed + 4) * 105) // ví dụ 14, 27, 113, 115
      const ipB = Math.floor(getDeterministicRandom(seed + 5) * 255)
      const ipC = Math.floor(getDeterministicRandom(seed + 6) * 255)
      const ipD = Math.floor(getDeterministicRandom(seed + 7) * 255)
      const ip = `${ipA}.${ipB}.${ipC}.${ipD}`

      // Thời gian truy cập
      let timeAgoStr = ''
      let durationStr = ''
      let timeDiffMs = 0

      if (isActive) {
        timeAgoStr = 'Đang xem'
        durationStr = `${Math.floor(getDeterministicRandom(seed + 8) * 15) + 1}m ${Math.floor(getDeterministicRandom(seed + 9) * 59)}s`
      } else {
        // Phân bổ thời gian ngẫu nhiên từ 2 phút trước đến 24 giờ trước
        const diffMinutes = Math.floor(getDeterministicRandom(seed + 10) * 1440) + 2
        timeDiffMs = diffMinutes * 60 * 1000
        
        if (diffMinutes < 60) {
          timeAgoStr = `${diffMinutes} phút trước`
        } else {
          timeAgoStr = `${Math.floor(diffMinutes / 60)} giờ trước`
        }

        const durationMin = Math.floor(getDeterministicRandom(seed + 11) * 8)
        const durationSec = Math.floor(getDeterministicRandom(seed + 12) * 59)
        durationStr = durationMin > 0 ? `${durationMin}m ${durationSec}s` : `${durationSec}s`
      }

      list.push({
        id: `SES-${100000 + i}`,
        ip,
        location: locationObj.name,
        device: deviceObj.type as 'Mobile' | 'Desktop' | 'Tablet',
        browser: deviceObj.browser,
        referrer: referrerObj.name,
        activePage: pageObj.path,
        status: isActive ? 'active' : 'offline',
        timeAgo: timeAgoStr,
        duration: durationStr,
        timestamp: new Date(now.getTime() - timeDiffMs)
      })
    }

    return list
  }, [])

  // 2. Phân tích dữ liệu biểu đồ (Thống kê thực tế từ 325 records)
  const deviceCounts = useMemo(() => {
    let mobile = 0, desktop = 0, tablet = 0
    visitors.forEach(v => {
      if (v.device === 'Mobile') mobile++
      else if (v.device === 'Desktop') desktop++
      else if (v.device === 'Tablet') tablet++
    })
    return { mobile, desktop, tablet }
  }, [visitors])

  const topPages = useMemo(() => {
    const counts: Record<string, number> = {}
    visitors.forEach(v => {
      counts[v.activePage] = (counts[v.activePage] || 0) + 1
    })
    return Object.entries(counts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
  }, [visitors])

  const topReferrers = useMemo(() => {
    const counts: Record<string, number> = {}
    visitors.forEach(v => {
      counts[v.referrer] = (counts[v.referrer] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [visitors])

  // Lượng truy cập 14 ngày qua (Tổng cộng đúng 325 lượt)
  // [21, 17, 24, 28, 20, 22, 28, 25, 20, 24, 26, 22, 23, 25] = 325
  const dailyData = [
    { day: 'T2', val: 21 },
    { day: 'T3', val: 17 },
    { day: 'T4', val: 24 },
    { day: 'T5', val: 28 },
    { day: 'T6', val: 20 },
    { day: 'T7', val: 22 },
    { day: 'CN', val: 28 },
    { day: 'T2 ', val: 25 },
    { day: 'T3 ', val: 20 },
    { day: 'T4 ', val: 24 },
    { day: 'T5 ', val: 26 },
    { day: 'T6 ', val: 22 },
    { day: 'T7 ', val: 23 },
    { day: 'H.nay', val: 25 }
  ]

  // Tìm kiếm & Lọc dữ liệu khách hàng
  const filteredVisitors = useMemo(() => {
    return visitors.filter(v => {
      const matchSearch = 
        v.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.referrer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.activePage.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchDevice = deviceFilter === 'all' || v.device.toLowerCase() === deviceFilter.toLowerCase()
      const matchStatus = statusFilter === 'all' || v.status === statusFilter

      return matchSearch && matchDevice && matchStatus
    })
  }, [visitors, searchTerm, deviceFilter, statusFilter])

  // Phân trang
  const paginatedVisitors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredVisitors.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredVisitors, currentPage])

  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Helper render device icon
  const getDeviceIcon = (device: 'Mobile' | 'Desktop' | 'Tablet') => {
    switch (device) {
      case 'Mobile': return <Smartphone size={14} className="text-emerald-400" />
      case 'Desktop': return <Laptop size={14} className="text-indigo-400" />
      case 'Tablet': return <Tablet size={14} className="text-amber-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Analytics Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Biểu đồ lượng truy cập (SVG Area Chart) */}
        <div className="lg:col-span-2 bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <TrendingUp size={120} className="text-emerald-500" />
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-zinc-100 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-500" />
                Lượng truy cập 14 ngày qua
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Biểu đồ tổng quan số lượt truy cập (Tổng 325 người)</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/20 border border-emerald-900/30 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="h-48 w-full mt-2 relative">
            <svg className="w-full h-full" viewBox="0 0 700 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="700" y2="30" stroke="#27272a" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="90" x2="700" y2="90" stroke="#27272a" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="150" x2="700" y2="150" stroke="#27272a" strokeWidth="1" strokeDasharray="3,3" />

              {/* Area Path */}
              <path
                d="M 10 150 
                   Q 60 120, 110 145
                   T 210 110
                   T 310 130
                   T 410 100
                   T 510 120
                   T 610 95
                   T 690 100
                   L 690 170
                   L 10 170 Z"
                fill="url(#chartGrad)"
              />

              {/* Line Path */}
              <path
                d="M 10 150 
                   Q 60 120, 110 145
                   T 210 110
                   T 310 130
                   T 410 100
                   T 510 120
                   T 610 95
                   T 690 100"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Chart Nodes / Dots */}
              {dailyData.map((d, idx) => {
                const x = 10 + (idx * (680 / (dailyData.length - 1)))
                // Map values between 17 and 30 to visual height Y
                // Formula: y = 150 - ((val - 15) / 15) * 110
                const y = 160 - ((d.val - 15) / 15) * 110
                return (
                  <g key={idx} className="group/dot cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r="4.5"
                      fill="#09090b"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      className="transition-all duration-150 hover:r-6 hover:fill-emerald-400"
                    />
                    {/* Tooltip on SVG node */}
                    <rect
                      x={x - 20}
                      y={y - 28}
                      width="40"
                      height="20"
                      rx="4"
                      fill="#18181b"
                      stroke="#27272a"
                      strokeWidth="1"
                      className="opacity-0 group-hover/dot:opacity-100 transition-opacity duration-150 pointer-events-none"
                    />
                    <text
                      x={x}
                      y={y - 14}
                      fill="#e4e4e7"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="opacity-0 group-hover/dot:opacity-100 transition-opacity duration-150 pointer-events-none"
                    >
                      {d.val}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[10px] text-zinc-500 font-bold px-2 mt-2">
            {dailyData.map((d, idx) => (
              <span key={idx} className="w-8 text-center">{d.day}</span>
            ))}
          </div>
        </div>

        {/* Thiết bị & Trang phổ biến */}
        <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-zinc-100 flex items-center gap-2 mb-4">
              <Laptop size={16} className="text-indigo-400" />
              Tỷ lệ thiết bị sử dụng
            </h3>

            {/* Custom Premium progress-based donut alternative */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-1">
                  <div className="flex items-center gap-2">
                    <Smartphone size={14} className="text-emerald-400" />
                    <span>Di động (Mobile)</span>
                  </div>
                  <span>{((deviceCounts.mobile / 325) * 100).toFixed(1)}% ({deviceCounts.mobile} lượt)</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-2 border border-zinc-800/80 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: `${(deviceCounts.mobile / 325) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-1">
                  <div className="flex items-center gap-2">
                    <Laptop size={14} className="text-indigo-400" />
                    <span>Máy tính (Desktop)</span>
                  </div>
                  <span>{((deviceCounts.desktop / 325) * 100).toFixed(1)}% ({deviceCounts.desktop} lượt)</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-2 border border-zinc-800/80 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-400 h-full rounded-full" style={{ width: `${(deviceCounts.desktop / 325) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-1">
                  <div className="flex items-center gap-2">
                    <Tablet size={14} className="text-amber-400" />
                    <span>Máy tính bảng (Tablet)</span>
                  </div>
                  <span>{((deviceCounts.tablet / 325) * 100).toFixed(1)}% ({deviceCounts.tablet} lượt)</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-2 border border-zinc-800/80 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full" style={{ width: `${(deviceCounts.tablet / 325) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/60 mt-4">
            <h4 className="text-xs font-black uppercase text-zinc-500 tracking-wider mb-2">Trang được quan tâm nhất</h4>
            <div className="space-y-1.5">
              {topPages.slice(0, 3).map((page, idx) => (
                <div key={page.path} className="flex items-center justify-between text-xs py-1 hover:bg-zinc-900/30 px-2 rounded-lg transition-colors">
                  <span className="font-mono text-zinc-400 truncate max-w-[150px]">{page.path}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-200">{page.count} views</span>
                    <span className="text-[10px] bg-zinc-800/60 text-zinc-400 px-1.5 py-0.5 rounded">
                      {((page.count / 325) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visitor Log Table (with Search, filter and Pagination) */}
      <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-6 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-zinc-100 flex items-center gap-2">
              <Globe size={16} className="text-indigo-400" />
              Nhật ký truy cập chi tiết
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Danh sách {filteredVisitors.length} / 325 lượt khách phù hợp tiêu chí</p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 md:flex-initial">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-zinc-500" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Tìm IP, tỉnh thành..."
                className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800/80 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 placeholder-zinc-500 transition-colors"
              />
            </div>

            {/* Filter Device */}
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800/80 px-2.5 py-1.5 rounded-xl">
              <Filter size={12} className="text-zinc-500" />
              <select
                value={deviceFilter}
                onChange={e => {
                  setDeviceFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer pr-2 font-medium"
              >
                <option value="all" className="bg-zinc-950 text-zinc-300">Tất cả thiết bị</option>
                <option value="mobile" className="bg-zinc-950 text-zinc-300">Mobile</option>
                <option value="desktop" className="bg-zinc-950 text-zinc-300">Desktop</option>
                <option value="tablet" className="bg-zinc-950 text-zinc-300">Tablet</option>
              </select>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800/80 px-2.5 py-1.5 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer pr-2 font-medium"
              >
                <option value="all" className="bg-zinc-950 text-zinc-300">Tất cả trạng thái</option>
                <option value="active" className="bg-zinc-950 text-zinc-300">Đang trực tuyến</option>
                <option value="offline" className="bg-zinc-950 text-zinc-300">Đã rời đi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-900/10 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Mã phiên (Session)</th>
                <th className="py-3.5 px-6">Trạng thái</th>
                <th className="py-3.5 px-6">Địa chỉ IP</th>
                <th className="py-3.5 px-6">Khu vực</th>
                <th className="py-3.5 px-6">Thiết bị / Browser</th>
                <th className="py-3.5 px-6">Nguồn giới thiệu</th>
                <th className="py-3.5 px-6">Đang xem</th>
                <th className="py-3.5 px-6 text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {paginatedVisitors.length > 0 ? (
                paginatedVisitors.map(v => (
                  <tr key={v.id} className="hover:bg-zinc-900/20 transition-colors group">
                    {/* Session ID */}
                    <td className="py-4 px-6">
                      <span className="font-mono text-zinc-400 text-xs font-bold group-hover:text-emerald-400 transition-colors">
                        {v.id}
                      </span>
                    </td>
                    
                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      {v.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-900/30">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-zinc-900 text-zinc-500 border border-zinc-800">
                          Offline
                        </span>
                      )}
                    </td>

                    {/* IP */}
                    <td className="py-4 px-6 text-xs text-zinc-300 font-mono">
                      {v.ip}
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-semibold">
                        <span className="text-zinc-500">📍</span>
                        <span>{v.location}</span>
                      </div>
                    </td>

                    {/* Device & Browser */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(v.device)}
                        <span className="text-zinc-400 text-xs truncate max-w-[120px]">{v.browser}</span>
                      </div>
                    </td>

                    {/* Referrer */}
                    <td className="py-4 px-6 text-xs text-zinc-400">
                      {v.referrer}
                    </td>

                    {/* Active page */}
                    <td className="py-4 px-6">
                      <span className="font-mono text-[11px] px-2 py-1 bg-zinc-900/60 text-zinc-400 rounded-lg border border-zinc-800/30">
                        {v.activePage}
                      </span>
                    </td>

                    {/* Time / Duration */}
                    <td className="py-4 px-6 text-right">
                      <div className="text-xs text-zinc-300 font-medium">{v.timeAgo}</div>
                      <div className="text-[10px] text-zinc-500 flex items-center justify-end gap-1 mt-0.5">
                        <Clock size={10} />
                        {v.duration}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500 text-xs">
                    Không tìm thấy dữ liệu truy cập nào phù hợp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination footer */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-zinc-800/80 bg-zinc-900/10 flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-semibold">
              Trang <strong className="text-zinc-300">{currentPage}</strong> trong tổng số <strong className="text-zinc-300">{totalPages}</strong> ({filteredVisitors.length} người)
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              
              {/* Render dynamic pagination numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                // Hiển thị dải trang xung quanh trang hiện tại
                let pageNum = currentPage - 2 + idx
                if (currentPage <= 2) pageNum = idx + 1
                else if (currentPage >= totalPages - 1) pageNum = totalPages - 4 + idx
                
                // Giới hạn hợp lệ
                if (pageNum < 1 || pageNum > totalPages) return null

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                      currentPage === pageNum
                        ? 'bg-emerald-950/30 text-emerald-400 border-emerald-800'
                        : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
