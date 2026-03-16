const ReviewBreakdown = ({ breakdown = {}, total = 0, average = 0 }) => {
  const max = Math.max(...Object.values(breakdown), 1)
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <div style={{ textAlign: 'center', minWidth: 80 }}>
        <div style={{ fontSize: 44, fontWeight: 800, color: '#111', lineHeight: 1 }}>{average}</div>
        <div style={{ display: 'flex', gap: 2, justifyContent: 'center', margin: '6px 0' }}>
          {[1,2,3,4,5].map(s => (
            <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= Math.round(average) ? '#C9A84C' : '#E5E7EB'}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
            </svg>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#9CA3AF' }}>{total} reviews</div>
      </div>
      <div style={{ flex: 1 }}>
        {[5,4,3,2,1].map(star => {
          const count = breakdown[String(star)] || 0
          const pct = total > 0 ? (count / total) * 100 : 0
          return (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', width: 12, textAlign: 'right' }}>{star}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#C9A84C"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
              <div style={{ flex: 1, height: 8, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#C9A84C', borderRadius: 99, transition: 'width 0.5s ease' }} />
              </div>
              <span style={{ fontSize: 11, color: '#9CA3AF', width: 24, textAlign: 'right' }}>{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default ReviewBreakdown
