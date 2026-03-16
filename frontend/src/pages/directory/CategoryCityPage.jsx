/**
 * CategoryCityPage — SEO landing page
 * e.g. /barbers/sheffield, /restaurants/nottingham
 * Popular treatment tags, breadcrumbs, business grid
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCategoryCity } from '../../utils/directoryApi'
import BusinessCard from '../../components/directory/BusinessCard'
import Breadcrumbs from '../../components/directory/Breadcrumbs'
import ListYourBusiness from '../../components/directory/ListYourBusiness'

const CategoryCityPage = () => {
  const { category, city } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getCategoryCity(category, city)
      .then(setData).catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [category, city, navigate])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #E5E7EB', borderTop: '3px solid #C9A84C', borderRadius: 99, animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
  if (!data) return null

  const catLabel = category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <div style={{ fontFamily: "'Figtree',sans-serif", maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px' }}>
      <Breadcrumbs items={data.breadcrumbs || [
        { label: 'Home', path: '/' },
        { label: catLabel, path: `/search?category=${category}` },
        { label: data.city || city, path: `/${category}/${city}` },
      ]} />

      <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111', marginBottom: 8, letterSpacing: -0.5 }}>
        {catLabel} in {data.city}
      </h1>
      <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 24 }}>
        {data.total} {catLabel.toLowerCase()} found in {data.city}
      </p>

      {/* Popular treatment tags (Gap #38 — Booksy-style tag cloud) */}
      {data.popular_tags?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 10 }}>Popular</h3>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {data.popular_tags.map(t => (
              <button key={t.tag} className="pill-filter"
                onClick={() => navigate(`/search?q=${encodeURIComponent(t.tag)}&city=${city}`)}>
                {t.tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 48 }}>
        {data.results?.map(biz => (
          <BusinessCard key={biz.id || biz.slug} business={biz} />
        ))}
      </div>

      {data.results?.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>No {catLabel.toLowerCase()} found in {data.city} yet</h3>
          <p style={{ fontSize: 14, color: '#6B7280' }}>Know a business that should be listed? Let us know.</p>
        </div>
      )}

      <ListYourBusiness />
    </div>
  )
}
export default CategoryCityPage
