import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { id: '/', label: 'Home', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
  { id: '/search', label: 'Explore', icon: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' },
  { id: '/live', label: 'Live', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', live: true },
  { id: '/bookings', label: 'Bookings', icon: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z' },
  { id: '/profile', label: 'Profile', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
]

const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const current = location.pathname

  return (
    <>
      {/* Spacer so content doesn't hide behind nav */}
      <div style={{ height: 72 }} className="show-mobile-only" />
      <nav className="show-mobile-only" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
        background: '#fff', borderTop: '1px solid #E5E7EB',
        display: 'none', justifyContent: 'space-around', padding: '6px 0 env(safe-area-inset-bottom, 8px)',
      }}>
        {tabs.map(t => {
          const active = current === t.id || (t.id !== '/' && current.startsWith(t.id))
          return (
            <button key={t.id} onClick={() => navigate(t.id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px',
              position: 'relative',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#C9A84C' : '#9CA3AF'}>
                <path d={t.icon} />
              </svg>
              {t.live && (
                <div style={{
                  position: 'absolute', top: 4, right: 8, width: 7, height: 7,
                  borderRadius: 99, background: '#22C55E',
                  animation: 'urgentPulse 2s infinite',
                }} />
              )}
              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 500,
                color: active ? '#C9A84C' : '#9CA3AF',
                fontFamily: "'Figtree',sans-serif",
              }}>{t.label}</span>
            </button>
          )
        })}
        <style>{`
          @media (max-width: 768px) { .show-mobile-only { display: flex !important; } }
          @media (min-width: 769px) { .show-mobile-only { display: none !important; } }
          @keyframes urgentPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.3); } 50% { box-shadow: 0 0 8px 3px rgba(34,197,94,0.2); } }
        `}</style>
      </nav>
    </>
  )
}
export default BottomNav
