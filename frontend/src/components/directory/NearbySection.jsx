import { Link } from 'react-router-dom'

const NearbyCard = ({ biz }) => (
  <Link to={`/${biz.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div style={{
      background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12,
      overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer', minWidth: 220,
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)' }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      <div style={{ height: 120, background: '#F5F5F3', position: 'relative' }}>
        {biz.photos?.[0] && <img src={biz.photos[0]} alt={biz.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        {biz.rating && (
          <span className="badge-pill badge-pill-dark" style={{ position: 'absolute', top: 8, right: 8 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#C9A84C"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            {biz.rating}
          </span>
        )}
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 2 }}>{biz.name}</div>
        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{biz.category?.charAt(0).toUpperCase() + biz.category?.slice(1)}</div>
      </div>
    </div>
  </Link>
)

const NearbySection = ({ businesses = [], title = 'Venues nearby' }) => {
  if (!businesses.length) return null
  return (
    <div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 16 }}>{title}</h3>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
        {businesses.map(b => <NearbyCard key={b.id || b.slug} biz={b} />)}
      </div>
    </div>
  )
}
export default NearbySection
