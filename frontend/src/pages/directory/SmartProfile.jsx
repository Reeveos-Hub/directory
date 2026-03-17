/**
 * SmartProfile — auto-detects business type and renders correct profile
 * Passes fetched data down to avoid double-fetch
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getListing } from '../../utils/directoryApi'
import ServiceProfilePage from './ServiceProfilePage'
import SEO from '../../components/seo/SEO'
import RestaurantProfilePage from './RestaurantProfilePage'

const SmartProfile = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getListing(slug)
      .then(data => setProfile(data))
      .catch(err => {
        console.error('Profile not found:', slug, err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 80, minHeight: '60vh', fontFamily: "'Figtree',sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #E5E7EB', borderTop: '3px solid #C9A84C', borderRadius: 99, animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontSize: 14, color: '#9CA3AF' }}>Loading business...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  if (error || !profile) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 80, minHeight: '60vh', fontFamily: "'Figtree',sans-serif" }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" style={{ marginBottom: 16 }}>
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 8 }}>Business not found</h2>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
          We couldn't find a business called "{slug}". It might not be on Reeve yet.
        </p>
        <button className="pill" onClick={() => navigate('/')}>Back to home</button>
        <div style={{ marginTop: 16 }}>
          <button className="pill pill-sm" style={{ background: 'transparent', color: '#9CA3AF', borderColor: '#E5E7EB' }} onClick={() => navigate('/search')}>Search businesses</button>
        </div>
      </div>
    </div>
  )

  const isRestaurant = profile.type === 'restaurant' || profile.category === 'Restaurants' || profile.category === 'restaurant' || profile.category === 'cafe'
  
  // SEO from backend seo_engine
  const seo = profile.seo || {}
  const schema = profile.schema_org || null

  return (
    <>
      <SEO
        title={seo.title || profile.name || profile.display_name}
        description={seo.description || `${profile.name || profile.display_name} in ${profile.area || ''}. Book online on Reeve Now.`}
        path={`/${slug}`}
        schema={schema}
      />
      {isRestaurant ? <RestaurantProfilePage /> : <ServiceProfilePage />}
    </>
  )
}

export default SmartProfile
