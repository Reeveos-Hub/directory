/**
 * SearchPageV2 — Search results with real Leaflet map
 * Fixes: "All" filter bug, emoji removed, real map, nav + footer
 * Split layout: cards left, interactive map right (desktop)
 */
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { searchWithAvailability } from '../../utils/directoryApi'
import BusinessCard from '../../components/directory/BusinessCard'
import Navbar from '../../components/directory/Navbar'
import DirectoryFooter from '../../components/directory/DirectoryFooter'
import SEOFooter from '../../components/directory/SEOFooter'
import LeafletMap from '../../components/directory/LeafletMap'

const $ = {
  h: '#111111', m: '#6B7280', l: '#9CA3AF', acc: '#C9A84C',
  bdr: '#E5E7EB', f: "'Figtree',-apple-system,sans-serif",
}

const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'restaurant', label: 'Restaurants' },
  { id: 'salon', label: 'Salons' },
  { id: 'barber', label: 'Barbers' },
  { id: 'aesthetics', label: 'Aesthetics' },
  { id: 'nails', label: 'Nails' },
  { id: 'spa', label: 'Spas' },
  { id: 'cafe', label: 'Cafés' },
]

const SearchPageV2 = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showMap, setShowMap] = useState(window.innerWidth > 768)
  const [userLocation, setUserLocation] = useState(null)

  const [query, setQuery] = useState(params.get('q') || '')
  const [category, setCategory] = useState(params.get('category') || '')
  const [city, setCity] = useState(params.get('city') || '')
  const [date, setDate] = useState(params.get('date') || new Date().toISOString().slice(0,10))
  const [minRating, setMinRating] = useState(null)
  const [openNow, setOpenNow] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 53.3811, lng: -1.4768 })
      )
    }
  }, [])

  const doSearch = useCallback(async () => {
    setLoading(true)
    try {
      const searchParams = { limit: 20, date }
      if (query) searchParams.query = query
      // FIX: Only send category if it's not empty (All = no filter)
      if (category) searchParams.category = category
      if (city) searchParams.city = city
      if (minRating) searchParams.min_rating = minRating
      if (openNow) searchParams.open_now = true
      if (userLocation) {
        searchParams.lat = userLocation.lat
        searchParams.lng = userLocation.lng
      }
      const data = await searchWithAvailability(searchParams)
      setResults(data.results || [])
      setTotal(data.total || 0)
    } catch (err) {
      console.error(err)
      setResults([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [query, category, city, date, minRating, openNow, userLocation])

  useEffect(() => { doSearch() }, [doSearch])

  const handleSlotClick = (business) => {
    navigate(`/${business.slug}`)
  }

  return (
    <div style={{ fontFamily: $.f, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar showBack />

      {/* Top search bar */}
      <div style={{ borderBottom: `1px solid ${$.bdr}`, padding: '12px 24px', background: '#fff' }}>
        <form onSubmit={e => { e.preventDefault(); doSearch() }} className="hero-search-form" style={{
          display: 'flex', gap: 8, maxWidth: 1200, margin: '0 auto', alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div style={{ position: 'relative', flex: 2, minWidth: 140 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Treatment or venue"
              style={{ width: '100%', padding: '10px 12px 10px 36px', border: `1.5px solid ${$.bdr}`, borderRadius: 99, fontSize: 14, fontFamily: $.f, outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = $.acc} onBlur={e => e.target.style.borderColor = $.bdr} />
          </div>
          <div style={{ position: 'relative', flex: 1, minWidth: 120 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City"
              style={{ width: '100%', padding: '10px 12px 10px 34px', border: `1.5px solid ${$.bdr}`, borderRadius: 99, fontSize: 14, fontFamily: $.f, outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = $.acc} onBlur={e => e.target.style.borderColor = $.bdr} />
          </div>
          <div style={{ position: 'relative', flex: 1, minWidth: 120 }}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${$.bdr}`, borderRadius: 99, fontSize: 14, fontFamily: $.f, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" className="pill pill-gold pill-sm">Search</button>
        </form>
      </div>

      {/* Filter bar */}
      <div style={{ borderBottom: `1px solid ${$.bdr}`, padding: '10px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div className="filter-pills-scroll" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} className={category === cat.id ? 'pill-filter active' : 'pill-filter'}
                onClick={() => setCategory(cat.id)}>{cat.label}</button>
            ))}
            <div style={{ width: 1, height: 20, background: $.bdr, margin: '0 4px' }} />
            <button className={openNow ? 'pill-filter active' : 'pill-filter'} onClick={() => setOpenNow(!openNow)}>Open now</button>
            <button className={minRating === 4 ? 'pill-filter active' : 'pill-filter'} onClick={() => setMinRating(minRating === 4 ? null : 4)}>4+ rated</button>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: $.m }}>{total} {total === 1 ? 'venue' : 'venues'}</span>
            <button onClick={() => setShowMap(!showMap)} className="pill-filter" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              </svg>
              {showMap ? 'Hide map' : 'Show map'}
            </button>
          </div>
        </div>
      </div>

      {/* Results + Map split */}
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flex: 1, width: '100%' }}>
        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
              <div style={{ width: 32, height: 32, border: '3px solid #E5E7EB', borderTop: `3px solid ${$.acc}`, borderRadius: 99, animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              {/* Monochrome SVG icon — NEVER emoji */}
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="1.5" style={{ marginBottom: 12 }}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: $.h, marginBottom: 8 }}>No results found</h3>
              <p style={{ fontSize: 14, color: $.m }}>Try adjusting your filters or search in a different area</p>
            </div>
          ) : (
            <div className="search-results-grid" style={{ display: 'grid', gridTemplateColumns: showMap ? '1fr 1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {results.map(biz => (
                <BusinessCard key={biz.id || biz.slug} business={biz} onSlotClick={handleSlotClick} />
              ))}
            </div>
          )}
        </div>

        {/* Real Leaflet map */}
        {showMap && (
          <div style={{
            width: '45%', maxWidth: 600, position: 'sticky', top: 64,
            height: 'calc(100vh - 200px)', borderLeft: `1px solid ${$.bdr}`,
          }} className="hide-on-mobile">
            <LeafletMap
              businesses={results}
              center={userLocation}
              onBusinessClick={(biz) => navigate(`/${biz.slug}`)}
            />
          </div>
        )}
      </div>

      <SEOFooter currentCity={city} currentCategory={category} />
      <DirectoryFooter />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media (max-width: 768px) { .hide-on-mobile { display: none !important; } }
      `}</style>
    </div>
  )
}

export default SearchPageV2
