/**
 * LiveFeed — THE KILLER FEATURE
 * Real-time cancellation marketplace / "What's available near me right now"
 * Cross-vertical: haircuts AND tables in the same feed
 * Location-aware, with countdown timers, one-tap booking
 */
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLiveFeed, subscribeToFeed } from '../../utils/directoryApi'
import Navbar from '../../components/directory/Navbar'
import DirectoryFooter from '../../components/directory/DirectoryFooter'

/* Monochrome SVG icon paths — NEVER emojis */
const CATEGORY_ICON_PATHS = {
  restaurant: 'M8.1 13.34l2.83-2.83L3.91 3.5a4 4 0 000 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z',
  barber: 'M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64z',
  salon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  aesthetics: 'M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a.996.996 0 00-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z',
  spa: 'M15.49 9.63c-.18-2.79-1.31-5.51-3.43-7.63-2.14 2.14-3.32 4.86-3.55 7.63 1.28.68 2.46 1.56 3.49 2.63 1.03-1.06 2.21-1.94 3.49-2.63z',
  nails: 'M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7V5h10v14z',
  cafe: 'M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM2 21h18v-2H2v2z',
}

const CategoryIcon = ({ category, size = 16, color = '#111111' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d={CATEGORY_ICON_PATHS[category] || CATEGORY_ICON_PATHS.restaurant} />
  </svg>
)

// Pill-style category filter
const CategoryPill = ({ label, active, onClick }) => (
  <button
    className={active ? 'pill-filter active' : 'pill-filter'}
    onClick={onClick}
  >
    {label}
  </button>
)

// Countdown timer component
const Countdown = ({ minutesUntil }) => {
  const [mins, setMins] = useState(minutesUntil)

  useEffect(() => {
    setMins(minutesUntil)
    const interval = setInterval(() => setMins(m => Math.max(0, m - 1)), 60000)
    return () => clearInterval(interval)
  }, [minutesUntil])

  if (mins < 60) return <span style={{ color: '#EF4444', fontWeight: 700 }}>in {mins}m</span>
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return <span style={{ color: mins < 120 ? '#F59E0B' : '#6B7280' }}>in {h}h {m > 0 ? `${m}m` : ''}</span>
}

// Single feed item card
const FeedCard = ({ item, onBook }) => {
  const isRestaurant = item.business_category === 'restaurant' || item.business_category === 'cafe'
  const isUrgent = item.is_urgent

  return (
    <div
      style={{
        background: '#fff',
        border: `1.5px solid ${isUrgent ? 'rgba(201,168,76,0.4)' : '#E5E7EB'}`,
        borderRadius: 16,
        padding: '16px 20px',
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        transition: 'all 0.3s',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      className={isUrgent ? 'pill-urgent' : ''}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Left: category icon + business info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 99, background: '#111',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0,
        }}>
          <span style={{ filter: 'grayscale(1) brightness(2)' }}>
            <CategoryIcon category={item.business_category} size={18} color="#C9A84C" />
          </span>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 2 }}>
            {item.service_name}
          </div>
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>
            {item.business_name}
            {item.staff_name && <span> · {item.staff_name}</span>}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {item.price > 0 && (
              <span className="badge-pill badge-pill-gold">£{item.price}</span>
            )}
            {item.party_size && (
              <span className="badge-pill badge-pill-gold">Table for {item.party_size}</span>
            )}
            {item.duration_minutes && (
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>{item.duration_minutes} min</span>
            )}
            {item.distance_km !== undefined && (
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>{item.distance_km}km away</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: time + book button */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          <Countdown minutesUntil={item.minutes_until || 0} />
        </div>
        <button
          className="pill pill-sm"
          onClick={(e) => { e.stopPropagation(); onBook(item) }}
        >
          Book
        </button>
      </div>

      {/* Urgent indicator bar */}
      {isUrgent && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
          background: '#C9A84C', borderRadius: '2px 0 0 2px',
        }} />
      )}
    </div>
  )
}

// ═══ MAIN COMPONENT ═══
const LiveFeed = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [showSubscribe, setShowSubscribe] = useState(false)
  const [subEmail, setSubEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 53.3811, lng: -1.4768 }) // Default: Sheffield
      )
    }
  }, [])

  // Fetch feed
  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true)
      const params = {}
      if (userLocation) {
        params.lat = userLocation.lat
        params.lng = userLocation.lng
        params.radius_km = 15
      }
      if (activeCategory) params.category = activeCategory
      const data = await getLiveFeed(params)
      setItems(data.items || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userLocation, activeCategory])

  useEffect(() => { fetchFeed() }, [fetchFeed])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchFeed, 30000)
    return () => clearInterval(interval)
  }, [fetchFeed])

  const handleBook = (item) => {
    navigate(`/book/${item.business_slug}`)
  }

  const handleSubscribe = async () => {
    if (!subEmail) return
    try {
      await subscribeToFeed({
        email: subEmail,
        lat: userLocation?.lat,
        lng: userLocation?.lng,
        categories: activeCategory ? [activeCategory] : [],
      })
      setSubscribed(true)
      setShowSubscribe(false)
    } catch (err) {
      console.error(err)
    }
  }

  const categories = ['restaurant', 'barber', 'salon', 'aesthetics', 'spa', 'nails']

  return (
    <div style={{ fontFamily: "'Figtree',-apple-system,sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar showBack />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px', flex: 1 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 10, height: 10, borderRadius: 99,
            background: '#22C55E', animation: 'urgentPulse 2s infinite',
          }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: 1 }}>Live</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', letterSpacing: -0.5, marginBottom: 4 }}>
          Available right now
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
          Cancelled appointments and last-minute openings near you. Book instantly.
        </p>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          <CategoryPill
            label="All"
            active={!activeCategory}
            onClick={() => setActiveCategory(null)}
          />
          {categories.map(cat => (
            <CategoryPill
              key={cat}
              label={cat.charAt(0).toUpperCase() + cat.slice(1)}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            />
          ))}
        </div>

        {/* Notify me toggle */}
        {!subscribed ? (
          <button
            className="pill pill-sm"
            onClick={() => setShowSubscribe(!showSubscribe)}
            style={{ fontSize: 11 }}
          >
            🔔 Notify me when slots open
          </button>
        ) : (
          <span className="badge-pill badge-pill-green">✓ Notifications on</span>
        )}

        {showSubscribe && (
          <div style={{
            marginTop: 12, padding: 16, background: '#F5F5F3', borderRadius: 12,
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <input
              type="email"
              value={subEmail}
              onChange={e => setSubEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 99, border: '1.5px solid #E5E7EB',
                fontSize: 13, fontFamily: 'inherit', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
            <button className="pill pill-sm" onClick={handleSubscribe}>Subscribe</button>
          </div>
        )}
      </div>

      {/* Feed items */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <div style={{
            width: 32, height: 32, border: '3px solid #E5E7EB', borderTop: '3px solid #C9A84C',
            borderRadius: 99, animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
          }} />
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>Finding available slots near you...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <p style={{ fontSize: 14, color: '#EF4444' }}>Something went wrong</p>
          <button className="pill pill-sm" onClick={fetchFeed} style={{ marginTop: 12 }}>Try again</button>
        </div>
      ) : items.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 48, background: '#F5F5F3', borderRadius: 16,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🕐</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#111', marginBottom: 4 }}>No last-minute slots right now</p>
          <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>Check back soon — slots open up throughout the day</p>
          {!subscribed && (
            <button className="pill" onClick={() => setShowSubscribe(true)}>Get notified</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => (
            <FeedCard
              key={item._id}
              item={item}
              onBook={handleBook}
            />
          ))}
        </div>
      )}

      {/* Refresh indicator */}
      {!loading && items.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#9CA3AF' }}>
          Auto-refreshes every 30s · {items.length} slots available
          <button
            onClick={fetchFeed}
            style={{
              background: 'none', border: 'none', color: '#C9A84C',
              fontWeight: 600, cursor: 'pointer', marginLeft: 8, fontFamily: 'inherit',
            }}
          >
            Refresh now
          </button>
        </div>
      )}
      </div>
      <DirectoryFooter />
    </div>
  )
}

export default LiveFeed
