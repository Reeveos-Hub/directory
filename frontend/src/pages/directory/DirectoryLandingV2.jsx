/**
 * DirectoryLanding — Homepage for reevenow.com
 * Hero search bar (treatment + location + date), category circles,
 * "Available tonight" with live slots, social proof, trending dishes,
 * live feed preview (THE KILLER), list your business CTA
 * 
 * Covers gaps: #26-33 (homepage sections)
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHomePage } from '../../utils/directoryApi'
import BusinessCard from '../../components/directory/BusinessCard'
import SocialProof from '../../components/directory/SocialProof'
import TrendingDishes from '../../components/directory/TrendingDishes'
import ListYourBusiness from '../../components/directory/ListYourBusiness'
import DirectoryFooter from '../../components/directory/DirectoryFooter'
import SEOFooter from '../../components/directory/SEOFooter'
import Navbar from '../../components/directory/Navbar'

const $ = {
  h: '#111111', m: '#6B7280', l: '#9CA3AF', acc: '#C9A84C',
  bdr: '#E5E7EB', f: "'Figtree',-apple-system,sans-serif",
}

const CATEGORIES = [
  { id: 'restaurant', label: 'Restaurants', icon: 'M8.1 13.34l2.83-2.83L3.91 3.5a4 4 0 000 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z', photo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop' },
  { id: 'salon', label: 'Hair Salons', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', photo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop' },
  { id: 'barber', label: 'Barbers', icon: 'M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3h-3z', photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop' },
  { id: 'aesthetics', label: 'Aesthetics', icon: 'M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z', photo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop' },
  { id: 'nails', label: 'Nails', icon: 'M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7V5h10v14z', photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop' },
  { id: 'spa', label: 'Spas', icon: 'M15.49 9.63c-.18-2.79-1.31-5.51-3.43-7.63-2.14 2.14-3.32 4.86-3.55 7.63 1.28.68 2.46 1.56 3.49 2.63 1.03-1.06 2.21-1.94 3.49-2.63zm-6.5 2.65c-.14-.1-.3-.19-.45-.29C6.68 10.14 4.26 9.5 1.5 9.5c0 7.18 5.82 13 13 13 7.18 0 13-5.82 13-13-2.76 0-5.18.64-7.04 1.49-.15.1-.31.19-.45.29-1.55 1.17-2.86 2.71-3.52 4.57C15.85 14.99 14.56 13.45 13 12.28z', photo: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop' },
  { id: 'cafe', label: 'Cafés', icon: 'M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM2 21h18v-2H2v2z', photo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop' },
]

const DirectoryLanding = () => {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [searchDate, setSearchDate] = useState(new Date().toISOString().slice(0,10))
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  useEffect(() => {
    getHomePage().then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e?.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (searchLocation) params.set('city', searchLocation)
    if (searchDate) params.set('date', searchDate)
    navigate(`/search?${params.toString()}`)
  }

  const handleCategoryClick = (cat) => {
    navigate(`/search?category=${cat}`)
  }

  return (
    <div style={{ fontFamily: $.f, overflowX: 'hidden', maxWidth: '100vw' }}>
      <Navbar />
      {/* ═══ HERO SECTION ═══ */}
      <div style={{
        background: '#111', padding: 'clamp(40px, 8vw, 80px) 16px clamp(40px, 6vw, 60px)', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Gold glow effects */}
        <div style={{ position: 'absolute', top: '-20%', left: '20%', width: 400, height: 400, borderRadius: 999, background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-30%', right: '15%', width: 500, height: 500, borderRadius: 999, background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#fff', letterSpacing: -1, marginBottom: 12, lineHeight: 1.1 }}>
            Book & reserve{' '}
            <span style={{ color: $.acc }}>locally.</span>
          </h1>
          <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: $.l, marginBottom: 32 }}>
            Haircuts, facials, restaurants, barbers — one search, zero booking fees.
          </p>

          {/* Search bar */}
          {isMobile ? (
            /* ── MOBILE: stacked form ── */
            <form onSubmit={handleSearch} style={{
              background: '#fff', borderRadius: 16, padding: 16,
              width: '100%', maxWidth: '100%', margin: '0 auto', boxSizing: 'border-box',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden',
            }}>
              <div style={{ position: 'relative' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Treatment or venue" style={{
                    width: '100%', padding: '14px 16px 14px 42px', border: '1.5px solid #E5E7EB', outline: 'none',
                    fontSize: 15, fontFamily: $.f, borderRadius: 12, boxSizing: 'border-box', background: '#fff',
                  }} />
              </div>
              <div style={{ position: 'relative' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <input type="text" value={searchLocation} onChange={e => setSearchLocation(e.target.value)}
                  placeholder="City or postcode" style={{
                    width: '100%', padding: '14px 16px 14px 40px', border: '1.5px solid #E5E7EB', outline: 'none',
                    fontSize: 15, fontFamily: $.f, borderRadius: 12, boxSizing: 'border-box', background: '#fff',
                  }} />
              </div>
              <div style={{ position: 'relative' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <input type="date" value={searchDate} onChange={e => setSearchDate(e.target.value)} style={{
                  width: '100%', maxWidth: '100%', padding: '14px 16px 14px 40px', border: '1.5px solid #E5E7EB', outline: 'none',
                  fontSize: 15, fontFamily: $.f, borderRadius: 12, boxSizing: 'border-box', background: '#f9fafb',
                }} />
              </div>
              <button type="submit" className="pill pill-gold" style={{ width: '100%', padding: '14px 28px', borderRadius: 12 }}>
                Search
              </button>
            </form>
          ) : (
            /* ── DESKTOP: pill form ── */
            <form onSubmit={handleSearch} style={{
              display: 'flex', background: '#fff', borderRadius: 99, padding: 6,
              maxWidth: 700, margin: '0 auto', gap: 0,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}>
              <div style={{ flex: 2, minWidth: 140, position: 'relative' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}>
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Treatment or venue" style={{
                    width: '100%', padding: '14px 16px 14px 44px', border: 'none', outline: 'none',
                    fontSize: 15, fontFamily: $.f, borderRadius: '99px 0 0 99px', boxSizing: 'border-box',
                  }} />
              </div>
              <div style={{ width: 1, background: '#E5E7EB', margin: '8px 0' }} />
              <div style={{ flex: 1.5, minWidth: 120, position: 'relative' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <input type="text" value={searchLocation} onChange={e => setSearchLocation(e.target.value)}
                  placeholder="City or postcode" style={{
                    width: '100%', padding: '14px 16px 14px 40px', border: 'none', outline: 'none',
                    fontSize: 15, fontFamily: $.f, boxSizing: 'border-box',
                  }} />
              </div>
              <div style={{ width: 1, background: '#E5E7EB', margin: '8px 0' }} />
              <div style={{ flex: 1, minWidth: 120, position: 'relative' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <input type="date" value={searchDate} onChange={e => setSearchDate(e.target.value)} style={{
                  width: '100%', padding: '14px 16px 14px 40px', border: 'none', outline: 'none',
                  fontSize: 15, fontFamily: $.f, boxSizing: 'border-box',
                }} />
              </div>
              <button type="submit" className="pill pill-gold" style={{ margin: 2, padding: '12px 28px' }}>
                Search
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ═══ SOCIAL PROOF BAR (Gap #30, #54) ═══ */}
      <div style={{ maxWidth: 800, margin: '-28px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <SocialProof />
      </div>

      {/* ═══ CATEGORY CIRCLES (Gap #27) ═══ */}
      <div style={{ maxWidth: 1000, margin: '48px auto', padding: '0 24px' }}>
        <div className="category-grid" style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => handleCategoryClick(cat.id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.querySelector('.cat-circle').style.transform = 'scale(1.08)'; e.currentTarget.querySelector('.cat-circle').style.boxShadow = '0 8px 24px rgba(201,168,76,0.3)' }}
            onMouseLeave={e => { e.currentTarget.querySelector('.cat-circle').style.transform = 'scale(1)'; e.currentTarget.querySelector('.cat-circle').style.boxShadow = 'none' }}
            >
              <div className="cat-circle" style={{
                width: 80, height: 80, borderRadius: 99, position: 'relative',
                overflow: 'hidden', transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src={cat.photo} alt={cat.label} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(17,17,17,0.4)' }} />
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" style={{ position: 'relative', zIndex: 1 }}><path d={cat.icon}/></svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: $.h }}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ LIVE FEED PREVIEW (Gap #32 — THE KILLER FEATURE) ═══ */}
      {data?.live_feed_preview?.length > 0 && (
        <div style={{ maxWidth: 1200, margin: '0 auto 48px', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: 99, background: '#22C55E', animation: 'urgentPulse 2s infinite' }} />
            <div style={{ width: 40, height: 3, background: $.acc, borderRadius: 2 }} />
            <h2 style={{ fontSize: 22, fontWeight: 800, color: $.h, margin: 0 }}>Available right now</h2>
          </div>
          <p style={{ fontSize: 14, color: $.m, marginBottom: 16 }}>Cancelled appointments and last-minute openings near you</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {data.live_feed_preview.map(item => (
              <div key={item._id} style={{
                background: '#fff', border: '1.5px solid rgba(201,168,76,0.2)', borderRadius: 12,
                padding: 14, cursor: 'pointer', transition: 'all 0.3s',
              }}
              onClick={() => navigate(`/book/${item.business_slug}`)}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: $.h, marginBottom: 2 }}>{item.service_name}</div>
                <div style={{ fontSize: 12, color: $.m, marginBottom: 6 }}>{item.business_name}{item.staff_name ? ` · ${item.staff_name}` : ''}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {item.price > 0 && <span className="badge-pill badge-pill-gold">£{item.price}</span>}
                  <span style={{ fontSize: 11, color: $.l }}>{item.duration_minutes}min</span>
                  <button className="pill pill-sm" style={{ marginLeft: 'auto' }}>Book</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button className="pill" onClick={() => navigate('/live')}>See all available slots</button>
          </div>
        </div>
      )}

      {/* ═══ TRENDING BUSINESSES (Gap #28, #29) ═══ */}
      {data?.trending?.length > 0 && (
        <div style={{ maxWidth: 1200, margin: '0 auto 48px', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 40, height: 3, background: $.acc, borderRadius: 2 }} />
            <h2 style={{ fontSize: 22, fontWeight: 800, color: $.h, margin: 0 }}>Recommended near you</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {data.trending.slice(0, 8).map(biz => (
              <BusinessCard key={biz.id || biz.slug} business={biz} />
            ))}
          </div>
        </div>
      )}

      {/* ═══ TRENDING DISHES (Gap #30 — EPOS-powered) ═══ */}
      <div style={{ maxWidth: 1200, margin: '0 auto 48px', padding: '0 24px' }}>
        <TrendingDishes />
      </div>

      {/* ═══ BROWSE BY CITY ═══ */}
      {data?.locations?.length > 0 && (
        <div style={{ maxWidth: 1200, margin: '0 auto 48px', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 40, height: 3, background: $.acc, borderRadius: 2 }} />
            <h2 style={{ fontSize: 22, fontWeight: 800, color: $.h, margin: 0 }}>Browse by city</h2>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {data.locations.map((loc, i) => {
              const cityName = typeof loc._id === 'object' ? (loc._id?.city || loc._id?.name || JSON.stringify(loc._id)) : loc._id
              if (!cityName || cityName === 'null' || cityName === 'undefined') return null
              return (
                <button key={i} className="pill-filter" onClick={() => navigate(`/search?city=${cityName}`)}>
                  {cityName} ({loc.count})
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ═══ LIST YOUR BUSINESS CTA (Gap #52) ═══ */}
      <div style={{ maxWidth: 800, margin: '0 auto 0', padding: '0 24px 48px' }}>
        <ListYourBusiness />
      </div>

      {/* ═══ SEO FOOTER ═══ */}
      <SEOFooter />

      {/* ═══ FOOTER ═══ */}
      <DirectoryFooter />

      <style>{`@keyframes urgentPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.3); } 50% { box-shadow: 0 0 12px 4px rgba(34,197,94,0.2); } }`}</style>
    </div>
  )
}

export default DirectoryLanding
