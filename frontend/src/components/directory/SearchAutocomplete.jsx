/**
 * SearchAutocomplete v2 — Portal-based dropdowns
 * Renders dropdown at document.body level via React Portal.
 * This bypasses ALL parent overflow:hidden / stacking context issues.
 * Location-aware: detects user's city via geolocation on mount.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

const API = import.meta.env.VITE_API_URL || 'https://reevenow.com/api'
const F = "'Figtree',-apple-system,sans-serif"

/* ─── Portal Dropdown — renders at body level ─── */
function PortalDropdown({ anchorRef, show, children }) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })

  useEffect(() => {
    if (!show || !anchorRef.current) return
    const update = () => {
      const r = anchorRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + window.scrollY + 6, left: r.left + window.scrollX, width: r.width })
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update) }
  }, [show, anchorRef])

  if (!show) return null
  return createPortal(
    <div style={{
      position: 'absolute', top: pos.top, left: pos.left, width: Math.max(pos.width, 280),
      background: '#fff', borderRadius: 14, overflow: 'hidden',
      boxShadow: '0 12px 48px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #F3F4F6', zIndex: 99999,
      animation: 'acDrop 0.15s ease-out',
    }}>
      {children}
      <style>{`@keyframes acDrop { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>,
    document.body
  )
}

/* ─── Monochrome icons ─── */
const CatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
)
const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
)

const Row = ({ active, onClick, children }) => (
  <button onMouseDown={e => { e.preventDefault(); onClick() }}
    style={{
      display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px',
      border: 'none', cursor: 'pointer', fontFamily: F, fontSize: 14, textAlign: 'left',
      background: active ? '#FFFBEB' : 'none', color: '#111', transition: 'background 0.1s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = active ? '#FFFBEB' : '#FAFAFA'}
    onMouseLeave={e => e.currentTarget.style.background = active ? '#FFFBEB' : 'none'}>
    {children}
  </button>
)

const Label = ({ text }) => (
  <div style={{ padding: '10px 16px 4px', fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: F }}>{text}</div>
)

const Badge = ({ type }) => (
  <span style={{
    fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600,
    background: type === 'category' ? '#FEF3C7' : '#E0F2FE',
    color: type === 'category' ? '#92400E' : '#0369A1',
  }}>{type === 'category' ? 'Category' : 'Area'}</span>
)

/* ═══════════════════════════════════════════════════
   QUERY AUTOCOMPLETE (treatment/venue input)
   ═══════════════════════════════════════════════════ */
export function QueryAutocomplete({ value, onChange, onSelect, placeholder = "Treatment or venue", style = {} }) {
  const [sugg, setSugg] = useState([])
  const [show, setShow] = useState(false)
  const [active, setActive] = useState(-1)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (value.length < 2) { setSugg([]); return }
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`${API}/directory/suggest?q=${encodeURIComponent(value)}&limit=8`)
        if (r.ok) setSugg((await r.json()).suggestions || [])
      } catch {}
    }, 180)
    return () => clearTimeout(t)
  }, [value])

  const pick = useCallback((item) => {
    onChange(item.text)
    onSelect?.(item)
    setShow(false)
    setActive(-1)
  }, [onChange, onSelect])

  const onKey = (e) => {
    if (!show || !sugg.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, sugg.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && active >= 0) { e.preventDefault(); pick(sugg[active]) }
    if (e.key === 'Escape') setShow(false)
  }

  const cats = sugg.filter(s => s.type === 'category')
  const areas = sugg.filter(s => s.type === 'area')

  return (
    <div ref={wrapRef} style={{ position: 'relative', ...style }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 1, pointerEvents: 'none' }}>
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
      <input type="text" value={value}
        onChange={e => { onChange(e.target.value); setShow(true); setActive(-1) }}
        onFocus={() => { setShow(true); if (value.length >= 2) setActive(-1) }}
        onBlur={() => setTimeout(() => setShow(false), 200)}
        onKeyDown={onKey}
        placeholder={placeholder}
        style={{ width: '100%', padding: '14px 16px 14px 42px', border: 'none', outline: 'none', fontSize: 15, fontFamily: F, boxSizing: 'border-box', background: 'transparent' }}
      />
      <PortalDropdown anchorRef={wrapRef} show={show && sugg.length > 0}>
        {cats.length > 0 && (
          <>
            <Label text="Categories" />
            {cats.map((s, i) => (
              <Row key={`c${i}`} active={active === i} onClick={() => pick(s)}>
                <CatIcon /><span style={{ fontWeight: 500 }}>{s.text}</span>
              </Row>
            ))}
          </>
        )}
        {areas.length > 0 && (
          <>
            {cats.length > 0 && <div style={{ height: 1, background: '#F3F4F6', margin: '4px 16px' }} />}
            <Label text="Locations" />
            {areas.map((s, i) => (
              <Row key={`a${i}`} active={active === cats.length + i} onClick={() => pick(s)}>
                <PinIcon /><span style={{ fontWeight: 500 }}>{s.text}</span>
              </Row>
            ))}
          </>
        )}
        <div style={{ padding: '8px 16px', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9CA3AF', fontFamily: F }}>
          <SearchIcon /><span>Search for <strong style={{ color: '#111' }}>"{value}"</strong></span>
        </div>
      </PortalDropdown>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   CITY AUTOCOMPLETE (location input)
   Location-aware: auto-detects city on focus
   ═══════════════════════════════════════════════════ */
export function CityAutocomplete({ value, onChange, onSelect, placeholder = "City or area", style = {} }) {
  const [allAreas, setAllAreas] = useState([])
  const [filtered, setFiltered] = useState([])
  const [show, setShow] = useState(false)
  const [active, setActive] = useState(-1)
  const [detectedCity, setDetectedCity] = useState(null)
  const wrapRef = useRef(null)

  // Load all areas once
  useEffect(() => {
    fetch(`${API}/directory/locations`).then(r => r.json()).then(setAllAreas).catch(() => {})
  }, [])

  // Detect user location on mount
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&zoom=10`)
        if (!r.ok) return
        const d = await r.json()
        const city = d.address?.city || d.address?.town || d.address?.county || ''
        if (city) setDetectedCity(city)
      } catch {}
    }, () => {}, { timeout: 5000, maximumAge: 300000 })
  }, [])

  // Filter areas based on input
  useEffect(() => {
    if (value.length < 1) {
      // Show popular + detected city when empty
      const popular = allAreas.slice(0, 6)
      if (detectedCity) {
        const match = allAreas.find(a => a.name.toLowerCase() === detectedCity.toLowerCase())
        if (match && !popular.find(p => p.name === match.name)) popular.unshift(match)
      }
      setFiltered(popular)
      return
    }
    const q = value.toLowerCase()
    const starts = allAreas.filter(a => a.name.toLowerCase().startsWith(q))
    const contains = allAreas.filter(a => !a.name.toLowerCase().startsWith(q) && a.name.toLowerCase().includes(q))
    setFiltered([...starts, ...contains].slice(0, 8))
  }, [value, allAreas, detectedCity])

  const pick = useCallback((area) => {
    onChange(area.name)
    onSelect?.(area)
    setShow(false)
    setActive(-1)
  }, [onChange, onSelect])

  const onKey = (e) => {
    if (!show || !filtered.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && active >= 0) { e.preventDefault(); pick(filtered[active]) }
    if (e.key === 'Escape') setShow(false)
  }

  // Auto-fill detected city into placeholder
  const dynamicPlaceholder = detectedCity ? detectedCity : placeholder

  return (
    <div ref={wrapRef} style={{ position: 'relative', ...style }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 1, pointerEvents: 'none' }}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
      <input type="text" value={value}
        onChange={e => { onChange(e.target.value); setShow(true); setActive(-1) }}
        onFocus={() => { setShow(true); setActive(-1) }}
        onBlur={() => setTimeout(() => setShow(false), 200)}
        onKeyDown={onKey}
        placeholder={dynamicPlaceholder}
        style={{ width: '100%', padding: '14px 16px 14px 40px', border: 'none', outline: 'none', fontSize: 15, fontFamily: F, boxSizing: 'border-box', background: 'transparent' }}
      />
      <PortalDropdown anchorRef={wrapRef} show={show && filtered.length > 0}>
        {detectedCity && value.length === 0 && (
          <>
            <Label text="Near you" />
            {filtered.filter(a => a.name.toLowerCase() === detectedCity.toLowerCase()).map((a, i) => (
              <Row key={`d${i}`} active={active === i} onClick={() => pick(a)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="#C9A84C"/>
                </svg>
                <span style={{ fontWeight: 600 }}>{a.name}</span>
                <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 'auto' }}>{a.count?.toLocaleString()}</span>
              </Row>
            ))}
            <div style={{ height: 1, background: '#F3F4F6', margin: '4px 16px' }} />
          </>
        )}
        <Label text={value.length > 0 ? 'Matching areas' : 'Popular areas'} />
        {filtered.filter(a => !(detectedCity && value.length === 0 && a.name.toLowerCase() === detectedCity.toLowerCase())).map((a, i) => {
          const idx = detectedCity && value.length === 0 ? i + 1 : i
          return (
            <Row key={`a${i}`} active={active === idx} onClick={() => pick(a)}>
              <PinIcon />
              <span style={{ fontWeight: 500 }}>{a.name}</span>
              <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 'auto' }}>{a.count?.toLocaleString()}</span>
            </Row>
          )
        })}
      </PortalDropdown>
    </div>
  )
}
