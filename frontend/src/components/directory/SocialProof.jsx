import { useState, useEffect } from 'react'
import { getPlatformStats } from '../../utils/directoryApi'

const StatItem = ({ value, label }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 28, fontWeight: 800, color: '#C9A84C', letterSpacing: -0.5 }}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
    <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{label}</div>
  </div>
)

const SocialProof = ({ style = {} }) => {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    getPlatformStats().then(setStats).catch(() => {})
  }, [])
  if (!stats) return null

  return (
    <div className="social-proof-bar" style={{
      display: 'flex', justifyContent: 'center', gap: 48,
      padding: '28px 24px', background: '#111', borderRadius: 16,
      ...style,
    }}>
      <StatItem value={stats.total_bookings} label="Bookings made" />
      <StatItem value={stats.total_businesses} label="Businesses" />
      <StatItem value={stats.avg_rating} label="Avg rating" />
      <StatItem value={`£${stats.booking_fee}`} label="Booking fees" />
    </div>
  )
}
export default SocialProof
