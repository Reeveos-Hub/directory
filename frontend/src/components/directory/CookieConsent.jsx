import { useState, useEffect } from 'react'

const CookieConsent = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('reeve_cookies_accepted')) {
      setTimeout(() => setShow(true), 1500)
    }
  }, [])

  const accept = () => { localStorage.setItem('reeve_cookies_accepted', 'true'); setShow(false) }
  const decline = () => { localStorage.setItem('reeve_cookies_accepted', 'essential'); setShow(false) }

  if (!show) return null
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: '#111', borderTop: '2px solid #C9A84C',
      padding: '16px 24px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
    }}>
      <p style={{ fontSize: 13, color: '#D1D5DB', margin: 0, flex: 1, minWidth: 200 }}>
        We use essential cookies to keep Reeve running and optional cookies to improve your experience.
        See our <a href="/cookies" style={{ color: '#C9A84C', textDecoration: 'underline' }}>cookie policy</a>.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="pill pill-sm" onClick={decline} style={{ background: 'transparent', color: '#9CA3AF', borderColor: '#374151' }}>
          Essential only
        </button>
        <button className="pill pill-sm pill-gold" onClick={accept}>
          Accept all
        </button>
      </div>
    </div>
  )
}
export default CookieConsent
