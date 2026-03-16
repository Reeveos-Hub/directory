const ReviewCard = ({ review }) => {
  const { user_name, user_initials, rating, text, service_name, staff_name, verified, created_at } = review
  const date = created_at ? new Date(created_at) : new Date()
  const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div style={{ padding: '16px 0', borderBottom: '1px solid #F3F4F6' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 99, background: '#111', color: '#C9A84C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, fontFamily: "'Figtree',sans-serif", flexShrink: 0,
        }}>{user_initials || '?'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{user_name}</span>
            {verified && <span className="badge-pill badge-pill-green" style={{ fontSize: 10 }}>Confirmed</span>}
          </div>
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>{dateStr}</div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {[1,2,3,4,5].map(s => (
            <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= rating ? '#C9A84C' : '#E5E7EB'}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
            </svg>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.55, margin: '0 0 8px 0' }}>{text}</p>
      {(service_name || staff_name) && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {service_name && <span className="badge-pill badge-pill-gold">{service_name}</span>}
          {staff_name && <span className="badge-pill" style={{ background: '#F5F5F3', color: '#374151', border: '1px solid #E5E7EB', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>with {staff_name}</span>}
        </div>
      )}
    </div>
  )
}
export default ReviewCard
