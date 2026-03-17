import { useState, useEffect } from 'react'
import { getPlatformStats } from '../../utils/directoryApi'

const StatItem = ({ value, label }) => (
  <div style={{ textAlign: 'center', minWidth: 0 }}>
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
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      padding: '20px 16px', background: '#111', borderRadius: 16,
      gap: 8, ...style,
    }}>
      <StatItem value={stats.total_listings || stats.total_places || 0} label="Local businesses" />
      <StatItem value={11} label="Categories" />
      <StatItem value="£0" label="Booking fees" />
    </div>
  )
}
export default SocialProof
