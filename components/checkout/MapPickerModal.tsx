'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface MapPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (address: string) => void
  initialAddress?: string
}

// Leaflet CSS CDN
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'

// Nominatim reverse geocode
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=vi`,
      { headers: { 'User-Agent': 'SolaSoil/1.0' } }
    )
    const data = await res.json()
    return data.display_name || ''
  } catch {
    return ''
  }
}

// Nominatim forward search
async function searchAddress(query: string): Promise<any[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=vn&accept-language=vi`,
      { headers: { 'User-Agent': 'SolaSoil/1.0' } }
    )
    return await res.json()
  } catch {
    return []
  }
}

export default function MapPickerModal({
  isOpen,
  onClose,
  onConfirm,
  initialAddress = ''
}: MapPickerModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [address, setAddress] = useState(initialAddress)
  const [mapReady, setMapReady] = useState(false)
  const [loadingGeo, setLoadingGeo] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [searching, setSearching] = useState(false)

  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const searchTimeoutRef = useRef<any>(null)

  // Load Leaflet CSS & JS
  useEffect(() => {
    if (!isOpen) return

    // Inject CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = LEAFLET_CSS
      document.head.appendChild(link)
    }

    // Inject JS
    const L = (window as any).L
    if (L) {
      setMapReady(true)
      return
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script')
      script.id = 'leaflet-js'
      script.src = LEAFLET_JS
      script.async = true
      script.onload = () => setMapReady(true)
      document.body.appendChild(script)
    } else {
      const check = setInterval(() => {
        if ((window as any).L) {
          setMapReady(true)
          clearInterval(check)
        }
      }, 100)
      return () => clearInterval(check)
    }
  }, [isOpen])

  // Initialize map
  useEffect(() => {
    if (!isOpen || !mapReady || !mapContainerRef.current) return

    const L = (window as any).L
    if (!L) return

    // Avoid re-init
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize()
      return
    }

    const defaultCenter: [number, number] = [21.0285, 105.8542] // Hanoi

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 15,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)

    // Custom green marker icon
    const greenIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })

    const marker = L.marker(defaultCenter, { 
      draggable: true, 
      icon: greenIcon 
    }).addTo(map)

    mapInstanceRef.current = map
    markerRef.current = marker

    // Drag end → reverse geocode
    marker.on('dragend', async () => {
      const pos = marker.getLatLng()
      const addr = await reverseGeocode(pos.lat, pos.lng)
      if (addr) setAddress(addr)
    })

    // Click map → move marker + reverse geocode
    map.on('click', async (e: any) => {
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      const addr = await reverseGeocode(lat, lng)
      if (addr) setAddress(addr)
    })

    // If initial address, try to geocode it
    if (initialAddress) {
      setAddress(initialAddress)
      searchAddress(initialAddress).then(results => {
        if (results.length > 0) {
          const { lat, lon } = results[0]
          const latNum = parseFloat(lat)
          const lonNum = parseFloat(lon)
          map.setView([latNum, lonNum], 16)
          marker.setLatLng([latNum, lonNum])
        }
      })
    }

    // Cleanup on modal close
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [isOpen, mapReady, initialAddress])

  // Debounced search
  const handleSearchInput = useCallback((value: string) => {
    setSearchQuery(value)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

    if (value.trim().length < 3) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setSearching(true)
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchAddress(value)
      setSearchResults(results)
      setShowResults(results.length > 0)
      setSearching(false)
    }, 500)
  }, [])

  // Select a search result
  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat)
    const lon = parseFloat(result.lon)
    const displayName = result.display_name

    setAddress(displayName)
    setSearchQuery(displayName)
    setShowResults(false)

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lon], 17)
      markerRef.current.setLatLng([lat, lon])
    }
  }

  // Get current GPS location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị.')
      return
    }

    setLoadingGeo(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 17)
          markerRef.current.setLatLng([latitude, longitude])
        }

        const addr = await reverseGeocode(latitude, longitude)
        if (addr) {
          setAddress(addr)
          setSearchQuery(addr)
        }
        setLoadingGeo(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Không thể lấy vị trí hiện tại. Vui lòng cấp quyền vị trí hoặc nhập thủ công.')
        setLoadingGeo(false)
      }
    )
  }

  const handleConfirm = () => {
    const finalAddress = address.trim()
    if (!finalAddress) {
      alert('Vui lòng chọn hoặc nhập một địa chỉ hợp lệ.')
      return
    }
    onConfirm(finalAddress)
    onClose()
  }

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchResults([])
      setShowResults(false)
      setSearchQuery('')
    } else {
      setAddress(initialAddress)
      setSearchQuery('')
    }
  }, [isOpen, initialAddress])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] max-w-2xl w-full p-6 shadow-2xl flex flex-col h-[650px] relative animate-fade-in border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            📍 Chọn địa chỉ giao hàng
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Search bar & Geolocation Button */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm địa chỉ (vd: 123 Nguyễn Trãi, Hà Nội)..."
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm text-gray-900"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {searchQuery && !searching && (
              <button 
                onClick={() => {
                  setSearchQuery('')
                  setSearchResults([])
                  setShowResults(false)
                }} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectResult(result)}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 text-sm text-gray-700 border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <span className="mr-2">📍</span>
                    {result.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={loadingGeo}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all text-xs flex items-center gap-1.5 border border-gray-200 shrink-0"
          >
            {loadingGeo ? (
              <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              '📍 Định vị'
            )}
          </button>
        </div>

        {/* Selected address display */}
        {address && (
          <div className="mb-3 px-4 py-2 bg-green-50 rounded-xl border border-green-200 text-sm text-green-900 flex items-start gap-2">
            <span className="shrink-0 mt-0.5">✅</span>
            <span className="line-clamp-2">{address}</span>
          </div>
        )}

        {/* Map Container */}
        <div className="flex-1 w-full bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200 mb-6">
          {!mapReady ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500">
              <div className="w-8 h-8 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium">Đang tải Bản đồ...</p>
            </div>
          ) : (
            <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '300px' }} />
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!address.trim()}
            className={`px-6 py-3 font-bold rounded-xl text-sm transition-all shadow-md ${
              address.trim() 
                ? 'bg-green-800 hover:bg-green-900 text-white shadow-green-900/20' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            }`}
          >
            Xác nhận địa chỉ
          </button>
        </div>
      </div>
    </div>
  )
}
