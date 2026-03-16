/**
 * SearchPageV2 — Fresha-model search results
 * Split layout: cards left, map right (desktop)
 * Time slot pills on every card, filter pills, photo carousel
 * 
 * Covers gaps: #1 map, #2-6 time slots + services on cards,
 * #34-42 search results features
 */
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { searchWithAvailability } from '../../utils/directoryApi'
import BusinessCard from '../../components/directory/BusinessCard'

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
  const [showMap, setShowMap] = useState(true)
  const [userLocation, setUserLocation] = useState(null)

  // Filters from URL
  const [query, setQuery] = useState(params.get('q') || '')
  const [category, setCategory] = useState(params.get('category') || '')
  const [city, setCity] = useState(params.get('city') || '')
  const [date, setDate] = useState(params.get('date') || new Date().toISOString().slice(0,10))
  const [minRating, setMinRating] = useState(null)
  const [openNow, setOpenNow] = useState(false)

  // Get user location
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
    } finally {
      setLoading(false)
    }
  }, [query, category, city, date, minRating, openNow, userLocation])

  useEffect(() => { doSearch() }, [doSearch])

  const handleSlotClick = (business, time) => {
    navigate(`/book/${business.slug}`)
  }

  return (
    <div style={{ fontFamily: $.f, minHeight: '100vh' }}>
      {/* Top search bar */}
      <div style={{ borderBottom: `1px solid ${$.bdr}`, padding: '12px 24px', background: '#fff' }}>
        <form onSubmit={e => { e.preventDefault(); doSearch() }} style={{
          display: 'flex', gap: 8, maxWidth: 1200, margin: '0 auto', alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div style={{ position: 'relative', flex: 2, minWidth: 140 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Treatment or venue"
              style={{ width: '100%', padding: '10px 12px 10px 36px', border: `1.5px solid ${$.bdr}`, borderRadius: 99, fontSize: 14, fontFamily: $.f, outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = $.acc} onBlur={e => e.target.style.borderColor = $.bdr}
            />
          </div>
          <div style={{ position: 'relative', flex: 1, minWidth: 120 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City"
              style={{ width: '100%', padding: '10px 12px 10px 34px', border: `1.5px solid ${$.bdr}`, borderRadius: 99, fontSize: 14, fontFamily: $.f, outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = $.acc} onBlur={e => e.target.style.borderColor = $.bdr}
            />
          </div>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ padding: '10px 14px', border: `1.5px solid ${$.bdr}`, borderRadius: 99, fontSize: 14, fontFamily: $.f, outline: 'none' }}
            onFocus={e => e.target.style.borderColor = $.acc} onBlur={e => e.target.style.borderColor = $.bdr}
          />
          <button type="submit" className="pill pill-gold pill-sm">Search</button>
        </form>
      </div>

      {/* Filter bar + results count */}
      <div style={{ borderBottom: `1px solid ${$.bdr}`, padding: '10px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Category filters (Gap #39) */}
            {CATEGORIES.map(cat => (
              <button key={cat.id} className={category === cat.id ? 'pill-filter active' : 'pill-filter'}
                onClick={() => setCategory(cat.id)}>{cat.label}</button>
            ))}
            <div style={{ width: 1, height: 20, background: $.bdr, margin: '0 4px' }} />
            <button className={openNow ? 'pill-filter active' : 'pill-filter'} onClick={() => setOpenNow(!openNow)}>Open now</button>
            <button className={minRating === 4 ? 'pill-filter active' : 'pill-filter'} onClick={() => setMinRating(minRating === 4 ? null : 4)}>4+ rated</button>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* Results count (Gap #42) */}
            <span style={{ fontSize: 13, color: $.m }}>{total} {total === 1 ? 'venue' : 'venues'}</span>
            {/* Map toggle (Gap #41) */}
            <button onClick={() => setShowMap(!showMap)} className="pill-filter" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              </svg>
              {showMap ? 'Hide map' : 'Show map'}
            </button>
          </div>
        </div>
      </div>

      {/* Results + Map split layout (Gap #34) */}
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', minHeight: 'calc(100vh - 140px)' }}>
        {/* Left: results */}
        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
              <div style={{ width: 32, height: 32, border: '3px solid #E5E7EB', borderTop: `3px solid ${$.acc}`, borderRadius: 99, animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: $.h, marginBottom: 8 }}>No results found</h3>
              <p style={{ fontSize: 14, color: $.m }}>Try adjusting your filters or search in a different area</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: showMap ? '1fr 1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {results.map(biz => (
                <BusinessCard key={biz.id || biz.slug} business={biz} onSlotClick={handleSlotClick} />
              ))}
            </div>
          )}
        </div>

        {/* Right: map (Gap #1, #40) */}
        {showMap && (
          <div style={{
            width: '45%', maxWidth: 600, position: 'sticky', top: 0,
            height: 'calc(100vh - 140px)', background: '#F5F5F3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderLeft: `1px solid ${$.bdr}`,
          }} className="hide-on-mobile">
            {/* Map placeholder — wired to real data, just needs Mapbox/Leaflet integration */}
            <div style={{ textAlign: 'center', padding: 24 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="1.5">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
              </svg>
              <p style={{ fontSize: 14, color: $.m, marginTop: 12 }}>Interactive map</p>
              <p style={{ fontSize: 12, color: $.l }}>{results.length} locations</p>
              {/* Rating pins would render here with Mapbox GL JS */}
              {results.filter(r => r.lat && r.lng).length > 0 && (
                <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                  {results.filter(r => r.lat && r.lng).slice(0, 12).map(r => (
                    <span key={r.id} style={{
                      padding: '3px 8px', borderRadius: 99, background: '#111', color: $.acc,
                      fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    }} title={r.name} onClick={() => navigate(`/${r.slug}`)}>
                      {r.rating || '–'}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`@media (max-width: 768px) { .hide-on-mobile { display: none !important; } }`}</style>
    </div>
  )
}

export default SearchPageV2
