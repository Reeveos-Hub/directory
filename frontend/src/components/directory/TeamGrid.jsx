const TeamGrid = ({ staff = [] }) => {
  if (!staff.length) return null
  return (
    <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
      {staff.map(s => (
        <div key={s.id || s.name} style={{ textAlign: 'center', minWidth: 90, flexShrink: 0 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 99, margin: '0 auto 8px',
            background: s.avatar ? `url(${s.avatar}) center/cover` : '#111',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#C9A84C', fontSize: 22, fontWeight: 700, fontFamily: "'Figtree',sans-serif",
            border: '2px solid #E5E7EB',
          }}>
            {!s.avatar && (s.name?.[0] || '?')}
          </div>
          {s.rating && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, marginBottom: 2 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#C9A84C"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>{s.rating}</span>
            </div>
          )}
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{s.name}</div>
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>{s.role}</div>
        </div>
      ))}
    </div>
  )
}
export default TeamGrid
