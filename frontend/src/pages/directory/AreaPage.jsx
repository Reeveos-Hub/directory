/**
 * AreaPage — SEO landing pages for areas
 * /area/sheffield — all businesses in Sheffield
 * /area/sheffield/restaurants — restaurants in Sheffield
 * Generates 2,500+ indexable pages (229 areas × 11 categories)
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import SEO from '../../components/seo/SEO'
import BusinessCard from '../../components/directory/BusinessCard'
import Navbar from '../../components/directory/Navbar'
import DirectoryFooter from '../../components/directory/DirectoryFooter'

const API = import.meta.env.VITE_API_URL || 'https://reevenow.com/api'
const F = "'Figtree',-apple-system,sans-serif"

const CATS = [
  { slug: 'restaurants', label: 'Restaurants', db: 'Restaurants' },
  { slug: 'hair-beauty', label: 'Hair & Beauty', db: 'Hair & Beauty' },
  { slug: 'barbers', label: 'Barbers', db: 'Barbers' },
  { slug: 'health', label: 'Health', db: 'Health' },
  { slug: 'wellness', label: 'Wellness', db: 'Wellness' },
  { slug: 'fitness', label: 'Fitness', db: 'Fitness' },
  { slug: 'tattoo-piercing', label: 'Tattoo & Piercing', db: 'Tattoo & Piercing' },
  { slug: 'pet-services', label: 'Pet Services', db: 'Pet Services' },
  { slug: 'education', label: 'Education', db: 'Education' },
  { slug: 'photography', label: 'Photography', db: 'Photography' },
  { slug: 'driving', label: 'Driving', db: 'Driving' },
]

export default function AreaPage() {
  const { area, category } = useParams()
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState(null)

  const areaName = area ? area.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : ''
  const catMatch = category ? CATS.find(c => c.slug === category) : null
  const catLabel = catMatch?.label || ''

  useEffect(() => {
    setLoading(true)
    const url = category
      ? `${API}/directory/area/${area}/${category}`
      : `${API}/directory/area/${area}`
    
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then(d => {
        setResults(d.results || d.listings || [])
        setTotal(d.total || 0)
        setMeta(d.area_page_meta || d.seo || null)
      })
      .catch(() => { setResults([]); setTotal(0) })
      .finally(() => setLoading(false))
  }, [area, category])

  const title = catLabel
    ? `${catLabel} in ${areaName} — Book Online`
    : `Local Businesses in ${areaName} — Book Online`
  const desc = catLabel
    ? `Find and book the best ${catLabel.toLowerCase()} in ${areaName}. ${total} venues, zero booking fees.`
    : `Discover ${total} local businesses in ${areaName}. Restaurants, salons, barbers and more. Zero booking fees.`

  return (
    <div style={{ fontFamily: F, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar showBack />

      {/* Hero */}
      <div style={{ background: '#111', padding: '48px 24px 40px', textAlign: 'center' }}>
        <SEO title={title} description={desc} path={`/area/${area}${category ? `/${category}` : ''}`} />

        {/* Breadcrumbs */}
        <div style={{ maxWidth: 1200, margin: '0 auto 20px', display: 'flex', gap: 6, justifyContent: 'center', fontSize: 13, color: '#9CA3AF' }}>
          <Link to="/" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to={`/area/${area}`} style={{ color: catLabel ? '#9CA3AF' : '#C9A84C', textDecoration: 'none' }}>{areaName}</Link>
          {catLabel && <><span>/</span><span style={{ color: '#C9A84C' }}>{catLabel}</span></>}
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: -0.5, marginBottom: 8 }}>
          {catLabel ? `${catLabel} in ` : 'Local businesses in '}
          <span style={{ color: '#C9A84C' }}>{areaName}</span>
        </h1>
        <p style={{ fontSize: 16, color: '#9CA3AF' }}>
          {total} {catLabel ? catLabel.toLowerCase() : 'businesses'} found — zero booking fees
        </p>
      </div>

      {/* Category pills (only on area-wide page) */}
      {!category && (
        <div style={{ borderBottom: '1px solid #E5E7EB', padding: '12px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 0' }}>
            <button className="pill-filter active" onClick={() => {}}>All</button>
            {CATS.map(c => (
              <button key={c.slug} className="pill-filter"
                onClick={() => navigate(`/area/${area}/${c.slug}`)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Back to all link (on category-filtered page) */}
      {category && (
        <div style={{ padding: '12px 24px', background: '#fff', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Link to={`/area/${area}`} style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              All businesses in {areaName}
            </Link>
          </div>
        </div>
      )}

      {/* Results */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <div style={{ width: 32, height: 32, border: '3px solid #E5E7EB', borderTop: '3px solid #C9A84C', borderRadius: 99, animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" style={{ marginBottom: 12 }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 8 }}>No results yet</h3>
            <p style={{ fontSize: 14, color: '#6B7280' }}>We're still adding businesses in {areaName}.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {results.map(biz => (
              <BusinessCard key={biz.id || biz.slug} business={biz} />
            ))}
          </div>
        )}
      </div>

      {/* Cross-links to other areas (SEO internal linking) */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px', width: '100%', boxSizing: 'border-box' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 16 }}>
          {catLabel ? `${catLabel} in other areas` : 'Explore other areas'}
        </h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['sheffield','nottingham','manchester','birmingham','leeds','bristol','edinburgh','glasgow','cardiff','liverpool','newcastle','brighton'].filter(a => a !== area).slice(0, 8).map(a => (
            <Link key={a} to={`/area/${a}${category ? `/${category}` : ''}`}
              style={{ padding: '8px 16px', borderRadius: 99, border: '1px solid #E5E7EB', fontSize: 13, fontWeight: 500, color: '#111', textDecoration: 'none', fontFamily: F }}>
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      <DirectoryFooter />
    </div>
  )
}
