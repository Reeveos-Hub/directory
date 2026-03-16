import { Link, useNavigate } from 'react-router-dom'

const Stars = ({ rating, size = 12 }) => (
  <div style={{ display: 'inline-flex', gap: 1 }}>
    {[1,2,3,4,5].map(s => (
      <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s <= Math.round(rating) ? '#C9A84C' : '#E5E7EB'}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
      </svg>
    ))}
  </div>
)

const BusinessCard = ({ business, onSlotClick }) => {
  const navigate = useNavigate()
  const b = business
  const isRestaurant = b.type === 'restaurant' || b.category === 'restaurant' || b.category === 'cafe'
  const slots = b.available_slots || []
  const services = b.top_services || []
  const totalServices = b.total_services || services.length

  const handleSlotClick = (time) => {
    if (onSlotClick) onSlotClick(b, time)
    else navigate(`/book/${b.slug}`)
  }

  return (
    <div style={{
      background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16,
      overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
      e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.08)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = '#E5E7EB'
      e.currentTarget.style.boxShadow = ''
      e.currentTarget.style.transform = ''
    }}
    >
      {/* Photo */}
      <Link to={`/${b.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ height: 180, background: '#F5F5F3', position: 'relative' }}>
          {b.photos?.[0] && <img src={b.photos[0]} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />}
          {/* Badges */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 4 }}>
            {b.promoted && <span className="badge-pill badge-pill-gold" style={{ fontSize: 10 }}>Featured</span>}
            {b.is_open && <span className="badge-pill badge-pill-green" style={{ fontSize: 10 }}>Open now</span>}
          </div>
          {/* Rating overlay */}
          {b.rating && (
            <span className="badge-pill badge-pill-dark" style={{ position: 'absolute', bottom: 10, right: 10 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#C9A84C"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
              {b.rating} ({b.review_count?.toLocaleString()})
            </span>
          )}
          {!b.claimed && (
            <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
              <span className="badge-pill" style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', backdropFilter: 'blur(8px)', fontSize: 10 }}>Claim this business</span>
            </div>
          )}
        </div>
      </Link>

      <div style={{ padding: '14px 16px' }}>
        {/* Title + location */}
        <Link to={`/${b.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 2 }}>{b.name}</div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 10 }}>
            {b.category?.charAt(0).toUpperCase() + b.category?.slice(1)} · {b.address}
            {b.distance_km !== undefined && <span> · {b.distance_km}km</span>}
          </div>
        </Link>

        {/* Services with prices (Gap #3) */}
        {services.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            {services.map(s => (
              <div key={s.id || s.name} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderTop: '1px solid #F3F4F6',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{s.duration} min</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>
                  {s.price > 0 ? `£${s.price.toFixed(2)}` : 'Free'}
                </span>
              </div>
            ))}
            {totalServices > 3 && (
              <Link to={`/${b.slug}`} style={{ fontSize: 12, color: '#C9A84C', fontWeight: 600, textDecoration: 'none' }}>
                See all {totalServices} services
              </Link>
            )}
          </div>
        )}

        {/* Time slot pills (Gap #2 — THE KEY DIFFERENTIATOR) */}
        {slots.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {slots.slice(0, 4).map(s => (
              <button
                key={s.time}
                className="pill-time"
                onClick={(e) => { e.preventDefault(); handleSlotClick(s.time) }}
              >
                {s.time}
              </button>
            ))}
            {slots.length > 4 && (
              <button className="pill-time" style={{ color: '#9CA3AF', borderStyle: 'dashed' }} onClick={() => navigate(`/${b.slug}`)}>
                +{slots.length - 4}
              </button>
            )}
          </div>
        )}

        {/* No availability message for claimed businesses */}
        {b.claimed && slots.length === 0 && (
          <div style={{ fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' }}>No slots today — check other dates</div>
        )}
      </div>
    </div>
  )
}
export default BusinessCard
