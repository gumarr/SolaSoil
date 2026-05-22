'use client'

import { useEffect, useRef, useState } from 'react'

interface MapPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (address: string) => void
  initialAddress?: string
}

export default function MapPickerModal({
  isOpen,
  onClose,
  onConfirm,
  initialAddress = ''
}: MapPickerModalProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const autocompleteInputRef = useRef<HTMLInputElement>(null)
  const [address, setAddress] = useState(initialAddress)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [loadingGeo, setLoadingGeo] = useState(false)
  
  const mapInstanceRef = useRef<any>(null)
  const markerInstanceRef = useRef<any>(null)
  const geocoderRef = useRef<any>(null)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  useEffect(() => {
    if (!isOpen) return

    // Inject Google Maps script if not already present
    if (typeof window !== 'undefined' && !window.hasOwnProperty('google')) {
      const scriptId = 'google-maps-script'
      let script = document.getElementById(scriptId) as HTMLScriptElement

      if (!script) {
        script = document.createElement('script')
        script.id = scriptId
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
        script.async = true
        script.defer = true
        script.onload = () => {
          setMapLoaded(true)
        }
        document.body.appendChild(script)
      } else {
        // Script exists but maybe not fully loaded yet
        const checkLoaded = setInterval(() => {
          if (window.hasOwnProperty('google')) {
            setMapLoaded(true)
            clearInterval(checkLoaded)
          }
        }, 100)
      }
    } else {
      setMapLoaded(true)
    }
  }, [isOpen, apiKey])

  useEffect(() => {
    if (!isOpen || !mapLoaded || !mapRef.current) return

    const google = (window as any).google
    if (!google) return

    // Default center: Hanoi, Vietnam
    const defaultCenter = { lat: 21.0285, lng: 105.8542 }
    geocoderRef.current = new google.maps.Geocoder()

    // Initialize Map
    const map = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 15,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    })
    mapInstanceRef.current = map

    // Initialize Marker
    const marker = new google.maps.Marker({
      position: defaultCenter,
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP
    })
    markerInstanceRef.current = marker

    // Set map address dynamically if initialAddress is present
    if (initialAddress) {
      setAddress(initialAddress)
      geocoderRef.current.geocode({ address: initialAddress }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location
          map.setCenter(loc)
          marker.setPosition(loc)
        }
      })
    }

    // Auto-complete setup
    if (autocompleteInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(autocompleteInputRef.current)
      autocomplete.bindTo('bounds', map)

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place.geometry || !place.geometry.location) return

        const loc = place.geometry.location
        map.setCenter(loc)
        marker.setPosition(loc)
        setAddress(place.formatted_address || '')
      })
    }

    // Drag marker event
    marker.addListener('dragend', () => {
      const position = marker.getPosition()
      if (!position) return

      geocoderRef.current.geocode({ location: position }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          setAddress(results[0].formatted_address)
        }
      })
    })

    // Click map to place marker
    map.addListener('click', (event: any) => {
      const position = event.latLng
      marker.setPosition(position)
      
      geocoderRef.current.geocode({ location: position }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          setAddress(results[0].formatted_address)
        }
      })
    })

  }, [isOpen, mapLoaded, initialAddress])

  // Get current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị.')
      return
    }

    setLoadingGeo(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const google = (window as any).google
        if (!google || !mapInstanceRef.current || !markerInstanceRef.current) {
          setLoadingGeo(false)
          return
        }

        const latLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        mapInstanceRef.current.setCenter(latLng)
        mapInstanceRef.current.setZoom(17)
        markerInstanceRef.current.setPosition(latLng)

        geocoderRef.current.geocode({ location: latLng }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            setAddress(results[0].formatted_address)
          }
          setLoadingGeo(false)
        })
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Không thể lấy vị trí hiện tại. Vui lòng cấp quyền vị trí hoặc nhập thủ công.')
        setLoadingGeo(false)
      }
    )
  }

  const handleConfirm = () => {
    if (!address) {
      alert('Vui lòng chọn hoặc nhập một địa chỉ hợp lệ.')
      return
    }
    onConfirm(address)
    onClose()
  }

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
              ref={autocompleteInputRef}
              type="text"
              placeholder="Tìm kiếm địa chỉ hoặc kéo thả ghim trên bản đồ..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm text-gray-900"
            />
            {address && (
              <button 
                onClick={() => setAddress('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
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

        {/* Map Container */}
        <div className="flex-1 w-full bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200 mb-6">
          {!mapLoaded ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500">
              <div className="w-8 h-8 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium">Đang tải Bản đồ...</p>
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full" />
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
            className="px-6 py-3 bg-green-800 hover:bg-green-900 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-green-900/20"
          >
            Xác nhận địa chỉ
          </button>
        </div>
      </div>
    </div>
  )
}
