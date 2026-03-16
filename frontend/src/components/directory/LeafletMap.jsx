/**
 * LeafletMap — Real interactive map for directory search results
 * Uses CDN-loaded Leaflet (added to index.html)
 * Gold rating pins on dark markers. Monochrome only.
 */
import { useEffect, useRef } from 'react'

const LeafletMap = ({ businesses = [], center, onBusinessClick }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current || !window.L) return
    
    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const defaultCenter = center || { lat: 53.3811, lng: -1.4768 } // Sheffield
    const map = window.L.map(mapRef.current, {
      center: [defaultCenter.lat, defaultCenter.lng],
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    })

    // Clean monochrome tile layer
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    // Add business markers
    const markers = []
    businesses.forEach(biz => {
      if (!biz.lat || !biz.lng) return

      const rating = biz.rating || '–'
      const icon = window.L.divIcon({
        html: `<div style="
          background:#111111; color:#C9A84C; font-family:'Figtree',sans-serif;
          font-weight:700; font-size:11px; padding:4px 8px; border-radius:99px;
          border:2px solid #C9A84C; white-space:nowrap; text-align:center;
          box-shadow:0 2px 8px rgba(0,0,0,0.3); cursor:pointer;
        ">${rating}</div>`,
        className: '',
        iconSize: [40, 28],
        iconAnchor: [20, 28],
      })

      const marker = window.L.marker([biz.lat, biz.lng], { icon }).addTo(map)
      
      // Popup with business name
      marker.bindPopup(`
        <div style="font-family:'Figtree',sans-serif; padding:4px 0;">
          <strong style="font-size:14px; color:#111;">${biz.name}</strong><br/>
          <span style="font-size:12px; color:#6B7280;">${biz.category || ''} · ${biz.address || ''}</span>
        </div>
      `, { closeButton: false, offset: [0, -10] })

      marker.on('click', () => {
        if (onBusinessClick) onBusinessClick(biz)
      })

      markers.push(marker)
    })

    // Fit bounds to show all markers
    if (markers.length > 0) {
      const group = window.L.featureGroup(markers)
      map.fitBounds(group.getBounds().pad(0.1))
    }

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [businesses, center, onBusinessClick])

  return (
    <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: 300, borderRadius: 0 }} />
  )
}

export default LeafletMap
