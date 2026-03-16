/**
 * ReviewsPage — /reviews on reevenow.com
 * Review discovery hub — like Yelp/Yell
 * Recent reviews, top-rated businesses, review search
 */
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/directory/Navbar'
import ReeveNowFooter from '../../components/directory/ReeveNowFooter'

const API = import.meta.env.VITE_API_URL || 'https://api.reevenow.com'
const INDIGO = '#111111'
const AMBER = '#C9A84C'
const f = "'Figtree',-apple-system,sans-serif"

function Stars({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s <= Math.round(rating) ? AMBER : '#E5E7EB'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  const date = review.created_at ? new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: '20px', border: '1px solid #eee' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: INDIGO, color: AMBER, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
          {(review.user_initials || review.user_name?.[0] || '?')}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: INDIGO }}>{review.user_name || 'Anonymous'}</span>
            {review.verified && <span style={{ fontSize: 10, fontWeight: 700, color: '#34D399', background: 'rgba(52,211,153,0.1)', padding: '2px 8px', borderRadius: 20 }}>Verified booking</span>}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3 }}>
            <Stars rating={review.rating} size={12} />
            <span style={{ fontSize: 11, color: '#999' }}>{date}</span>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 14, color: '#444', lineHeight: 1.6, margin: '0 0 12px 0' }}>{review.text}</p>
      {review.business_name && (
        <Link to={`/${review.business_slug || '#'}`} style={{ fontSize: 12, color: AMBER, fontWeight: 700, textDecoration: 'none' }}>
          {review.business_name} →
        </Link>
      )}
    </div>
  )
}

function TopRatedCard({ business }) {
  const rating = business.average_rating || business.rating || 0
  const count = business.review_count || business.total_reviews || 0
  return (
    <Link to={`/${business.slug}`} style={{ textDecoration: 'none', background: 'white', borderRadius: 14, overflow: 'hidden', border: '1px solid #eee', display: 'block', transition: 'box-shadow 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {business.hero_image && (
        <div style={{ height: 140, overflow: 'hidden' }}>
          <img src={business.hero_image} alt={business.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        </div>
      )}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: INDIGO, marginBottom: 6 }}>{business.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Stars rating={rating} size={13} />
          <span style={{ fontSize: 13, fontWeight: 700, color: INDIGO }}>{rating.toFixed(1)}</span>
          <span style={{ fontSize: 12, color: '#999' }}>({count} reviews)</span>
        </div>
        <div style={{ fontSize: 12, color: '#888' }}>{business.city} · {business.category}</div>
      </div>
    </Link>
  )
}

export default function ReviewsPage() {
  const navigate = useNavigate()
  const [recentReviews, setRecentReviews] = useState([])
  const [topRated, setTopRated] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQ, setSearchQ] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [catFilter, setCatFilter] = useState('')

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/reviews/recent?limit=12`).then(r => r.ok ? r.json() : { reviews: [] }),
      fetch(`${API}/api/directory/businesses?sort=rating&limit=8&min_reviews=3`).then(r => r.ok ? r.json() : { businesses: [] }),
    ]).then(([reviewData, bizData]) => {
      setRecentReviews(reviewData.reviews || [])
      setTopRated(bizData.businesses || bizData.results || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e?.preventDefault()
    const params = new URLSearchParams()
    if (searchQ) params.set('q', searchQ)
    if (cityFilter) params.set('city', cityFilter)
    if (catFilter) params.set('category', catFilter)
    navigate(`/search?${params.toString()}`)
  }

  const CITIES = ['Sheffield', 'Nottingham', 'Cardiff', 'London', 'Manchester', 'Birmingham', 'Bristol', 'Leeds']
  const CATS = [
    { id: 'restaurant', label: 'Restaurants' },
    { id: 'salon', label: 'Hair Salons' },
    { id: 'barber', label: 'Barbers' },
    { id: 'aesthetics', label: 'Aesthetics' },
    { id: 'gym', label: 'Gyms' },
    { id: 'spa', label: 'Spas' },
  ]

  return (
    <div style={{ fontFamily: f, background: '#ffffff', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: INDIGO, padding: 'clamp(40px,6vw,64px) 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: -0.5 }}>
          Real reviews.<br /><span style={{ color: AMBER }}>Real independent businesses.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, maxWidth: 520, margin: '0 auto 28px' }}>
          Every review on Reeve Now comes from a verified booking. No fake reviews. No paid placements. Just honest feedback from real customers.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 700, margin: '0 auto' }}>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Business name or type..."
            style={{ flex: '2 1 200px', padding: '12px 18px', borderRadius: 50, border: 'none', fontSize: 14, fontFamily: f, outline: 'none' }} />
          <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}
            style={{ flex: '1 1 140px', padding: '12px 18px', borderRadius: 50, border: 'none', fontSize: 14, fontFamily: f, fontWeight: 600, color: INDIGO }}>
            <option value="">Any city</option>
            {CITIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
          </select>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            style={{ flex: '1 1 140px', padding: '12px 18px', borderRadius: 50, border: 'none', fontSize: 14, fontFamily: f, fontWeight: 600, color: INDIGO }}>
            <option value="">Any type</option>
            {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <button type="submit" style={{ padding: '12px 28px', borderRadius: 50, border: 'none', background: AMBER, color: INDIGO, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: f }}>
            Search
          </button>
        </form>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 16px' }}>

        {/* Top rated */}
        {topRated.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: INDIGO }}>Top rated independent businesses</h2>
              <Link to="/search?sort=rating" style={{ fontSize: 13, color: AMBER, fontWeight: 700, textDecoration: 'none' }}>See all →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {topRated.map((b, i) => <TopRatedCard key={b._id || i} business={b} />)}
            </div>
          </div>
        )}

        {/* Why verified matters */}
        <div style={{ background: 'white', borderRadius: 16, padding: '24px 28px', marginBottom: 48, border: '1px solid #eee', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
          {[
            { icon: '✓', title: 'Verified bookings only', text: 'Every review comes from a confirmed booking through Reeve Now. No accounts, no anonymous posts.' },
            { icon: '◯', title: 'No paid placement', text: 'Businesses cannot pay to appear higher or remove negative reviews. The ranking is purely based on real ratings.' },
            { icon: '★', title: 'Independent businesses', text: 'Every business on Reeve Now is independently owned. Your review helps a real person, not a corporation.' },
          ].map(item => (
            <div key={item.title}>
              <div style={{ fontSize: 22, color: AMBER, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: INDIGO, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{item.text}</div>
            </div>
          ))}
        </div>

        {/* Recent reviews */}
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: INDIGO, marginBottom: 8 }}>Latest reviews</h2>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>What real customers are saying this week.</p>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Loading reviews…</div>
          ) : recentReviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              <div style={{ fontSize: 16, marginBottom: 8 }}>No reviews yet — be the first.</div>
              <Link to="/search" style={{ color: AMBER, fontWeight: 700, fontSize: 14 }}>Find a business to review →</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {recentReviews.map((r, i) => <ReviewCard key={r._id || i} review={r} />)}
            </div>
          )}
        </div>

        {/* City review hubs */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: INDIGO, marginBottom: 20 }}>Reviews by city</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['Sheffield', 'Nottingham', 'Cardiff', 'London', 'Birmingham', 'Manchester'].map(city => (
              <Link key={city} to={`/reviews?city=${city.toLowerCase()}`}
                style={{ padding: '10px 20px', borderRadius: 50, background: 'white', border: '1.5px solid #e0e0e0', fontSize: 14, fontWeight: 700, color: INDIGO, textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = AMBER; e.currentTarget.style.color = AMBER }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = INDIGO }}
              >{city}</Link>
            ))}
          </div>
        </div>
      </div>

      <ReeveNowFooter />
    </div>
  )
}
