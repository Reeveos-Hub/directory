/**
 * Navbar — ReeveOS branded directory navigation
 * Rich Black #111111 + Gold #C9A84C + White
 * R. mark, Figtree, monochrome SVG icons only, pill buttons
 */
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const $ = {
  h: '#111111', acc: '#C9A84C', m: '#6B7280', l: '#9CA3AF',
  bdr: '#E5E7EB', f: "'Figtree',-apple-system,sans-serif",
}

export default function Navbar({ showBack = false, hideSearch = false }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setIsMobileOpen(false) }, [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: isScrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: isScrolled ? `1px solid ${$.bdr}` : '1px solid transparent',
        transition: 'all 0.3s', fontFamily: $.f,
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: 64, gap: 12 }}>
          {showBack && (
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={$.h} strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          )}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: $.h, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ fontFamily: $.f, fontWeight: 800, fontSize: 18, color: $.acc }}>R</span>
              <span style={{ fontFamily: $.f, fontWeight: 800, fontSize: 8, color: '#fff', position: 'absolute', bottom: 8, right: 7 }}>.</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: $.h, letterSpacing: -0.5 }}>Reeve</span>
          </Link>

          {!isHome && (
            <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 400, position: 'relative', margin: '0 12px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search treatments, venues..." data-nav-search="true"
                style={{ width: '100%', padding: '8px 12px 8px 36px', border: `1.5px solid ${$.bdr}`, borderRadius: 99, fontSize: 13, fontFamily: $.f, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = $.acc} onBlur={e => e.target.style.borderColor = $.bdr} />
            </form>
          )}

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hide-on-mobile">
            {[{ to: '/', label: 'Home' }, { to: '/search', label: 'Explore' }, { to: '/live', label: 'Live', live: true }].map(link => (
              <Link key={link.to} to={link.to} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                color: location.pathname === link.to ? $.h : $.m,
                background: location.pathname === link.to ? 'rgba(201,168,76,0.06)' : 'transparent',
                textDecoration: 'none', transition: 'all 0.2s',
              }}>
                {link.label}
                {link.live && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 99, background: '#22C55E', marginLeft: 4, verticalAlign: 'middle' }} />}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hide-on-mobile">
            <a href="/account" style={{ padding: '8px 20px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: $.h, textDecoration: 'none' }}>Log in</a>
            <a href="/list-your-business" className="pill pill-sm" style={{ fontSize: 13 }}>List your business</a>
          </div>

          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="show-mobile-only"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: $.h, display: 'none' }}>
            {isMobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
        </div>
      </nav>

      {isMobileOpen && (
        <div style={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, zIndex: 40, background: 'rgba(0,0,0,0.3)' }} onClick={() => setIsMobileOpen(false)}>
          <div style={{ background: '#fff', borderBottom: `1px solid ${$.bdr}`, padding: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
            {[{ to: '/', label: 'Home' }, { to: '/search', label: 'Explore' }, { to: '/live', label: 'Live' }, { to: '/account', label: 'My Account' }].map(link => (
              <Link key={link.to} to={link.to} onClick={() => setIsMobileOpen(false)}
                style={{ display: 'block', padding: '12px 16px', borderRadius: 12, fontSize: 15, fontWeight: 600, color: $.h, textDecoration: 'none' }}>{link.label}</Link>
            ))}
            <div style={{ height: 1, background: $.bdr, margin: '12px 0' }} />
            <a href="/list-your-business" className="pill pill-gold" style={{ display: 'block', textAlign: 'center', width: '100%' }}>List your business</a>
          </div>
        </div>
      )}

      <div style={{ height: 64 }} />
      <style>{`
        @media (max-width: 768px) { .hide-on-mobile { display: none !important; } .show-mobile-only { display: flex !important; } }
        @media (min-width: 769px) { .show-mobile-only { display: none !important; } }
      `}</style>
    </>
  )
}
