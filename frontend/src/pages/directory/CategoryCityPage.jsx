/**
 * CategoryCityPage — SEO landing page
 * e.g. /categories/barbers/sheffield, /categories/restaurants/nottingham
 * FIX: Handles missing city parameter (no more "Undefined")
 * Includes Navbar, Footer, SEO Footer, breadcrumbs
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCategoryCity, getCategoryBusinesses } from '../../utils/directoryApi'
import BusinessCard from '../../components/directory/BusinessCard'
import Breadcrumbs from '../../components/directory/Breadcrumbs'
import ListYourBusiness from '../../components/directory/ListYourBusiness'
import Navbar from '../../components/directory/Navbar'
import DirectoryFooter from '../../components/directory/DirectoryFooter'
import SEOFooter from '../../components/directory/SEOFooter'

const $ = {
  h: '#111111', acc: '#C9A84C', m: '#6B7280', l: '#9CA3AF',
  f: "'Figtree',-apple-system,sans-serif",
}

const CategoryCityPage = () => {
  const { category, city } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    
    // FIX: If no city provided, fetch category-wide results instead of sending "undefined"
    const fetchData = city
      ? getCategoryCity(category, city)
      : getCategoryBusinesses(category)
    
    fetchData
      .then(d => {
        // Ensure city is never "Undefined"
        if (d && !d.city && city) d.city = city.charAt(0).toUpperCase() + city.slice(1)
        if (d && !d.city && !city) d.city = null
        setData(d)
      })
      .catch(() => setData({ results: [], total: 0, city: city || null, popular_tags: [] }))
      .finally(() => setLoading(false))
  }, [category, city, navigate])

  const catLabel = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All'
  const cityLabel = data?.city || city?.charAt(0).toUpperCase() + city?.slice(1) || null

  return (
    <div style={{ fontFamily: $.f, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar showBack />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: catLabel, path: `/search?category=${category}` },
          ...(cityLabel ? [{ label: cityLabel, path: `/categories/${category}/${city}` }] : []),
        ]} />

        <h1 style={{ fontSize: 32, fontWeight: 800, color: $.h, marginBottom: 8, letterSpacing: -0.5 }}>
          {catLabel}{cityLabel ? ` in ${cityLabel}` : ''}
        </h1>
        <p style={{ fontSize: 15, color: $.m, marginBottom: 24 }}>
          {data?.total || 0} {catLabel.toLowerCase()} found{cityLabel ? ` in ${cityLabel}` : ''}
        </p>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <div style={{ width: 32, height: 32, border: '3px solid #E5E7EB', borderTop: `3px solid ${$.acc}`, borderRadius: 99, animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : (
          <>
            {/* Popular treatment tags */}
            {data?.popular_tags?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, marginBottom: 10 }}>Popular</h3>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {data.popular_tags.map(t => (
                    <button key={t.tag} className="pill-filter"
                      onClick={() => navigate(`/search?q=${encodeURIComponent(t.tag)}${city ? `&city=${city}` : ''}`)}>
                      {t.tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 48 }}>
              {data?.results?.map(biz => (
                <BusinessCard key={biz.id || biz.slug} business={biz} />
              ))}
            </div>

            {(!data?.results || data.results.length === 0) && (
              <div style={{ textAlign: 'center', padding: 48 }}>
                {/* Monochrome SVG — NEVER emoji */}
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="1.5" style={{ marginBottom: 12 }}>
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: $.h }}>
                  No {catLabel.toLowerCase()} found{cityLabel ? ` in ${cityLabel}` : ''} yet
                </h3>
                <p style={{ fontSize: 14, color: $.m }}>Know a business that should be listed? Let us know.</p>
              </div>
            )}

            <ListYourBusiness />
          </>
        )}
      </div>

      <SEOFooter currentCity={cityLabel} currentCategory={category} />
      <DirectoryFooter />
    </div>
  )
}
export default CategoryCityPage
