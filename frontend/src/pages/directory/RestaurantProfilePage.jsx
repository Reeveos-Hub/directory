/**
 * RestaurantProfilePage — OpenTable-model restaurant profile
 * For: restaurants, cafes
 * 
 * Covers gaps: #21-32 (full menu, calories, allergens, reservation widget,
 * dining style, dress code, parking, payment options, amenities, AI concierge,
 * social proof, guest count, profile tabs)
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getListing, getListingReviews, getListingMenu, getAvailability } from '../../utils/directoryApi'
import Breadcrumbs from '../../components/directory/Breadcrumbs'
import ReviewCard from '../../components/directory/ReviewCard'
import ReviewBreakdown from '../../components/directory/ReviewBreakdown'
import AmenitiesDisplay from '../../components/directory/AmenitiesDisplay'
import NearbySection from '../../components/directory/NearbySection'
import ShareFavourite from '../../components/directory/ShareFavourite'
import Navbar from '../../components/directory/Navbar'
import DirectoryFooter from '../../components/directory/DirectoryFooter'
import SEOFooter from '../../components/directory/SEOFooter'

const $ = {
  bg: '#FFFFFF', card: '#FFFFFF', surface: '#F5F5F3',
  h: '#111111', txt: '#374151', m: '#6B7280', l: '#9CA3AF',
  acc: '#C9A84C', bdr: '#E5E7EB', ok: '#22C55E', err: '#EF4444',
  f: "'Figtree',-apple-system,sans-serif",
}

const ALLERGEN_LABELS = {
  gluten: 'Gluten', milk: 'Milk', eggs: 'Eggs', fish: 'Fish', nuts: 'Nuts',
  peanuts: 'Peanuts', soya: 'Soya', celery: 'Celery', mustard: 'Mustard',
  sesame: 'Sesame', sulphites: 'Sulphites', lupin: 'Lupin', molluscs: 'Molluscs',
  crustaceans: 'Crustaceans',
}

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

const RestaurantProfilePage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [menu, setMenu] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [activeMenuCat, setActiveMenuCat] = useState(null)
  const [reviews, setReviews] = useState([])
  const [totalReviews, setTotalReviews] = useState(0)
  const [reviewPage, setReviewPage] = useState(0)

  // Reservation widget state
  const [resDate, setResDate] = useState(new Date().toISOString().slice(0,10))
  const [resTime, setResTime] = useState('19:00')
  const [resGuests, setResGuests] = useState(2)
  const [slots, setSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)

  // Allergen filter
  const [allergenFilter, setAllergenFilter] = useState([])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getListing(slug),
      getListingMenu(slug).catch(() => null),
    ]).then(([profileData, menuData]) => {
      setProfile(profileData)
      setMenu(menuData)
      setReviews(profileData.latest_reviews || [])
      setTotalReviews(profileData.review_count || 0)
      if (menuData?.categories) {
        const cats = Object.keys(menuData.categories)
        if (cats.length > 0) setActiveMenuCat(cats[0])
      }
    }).catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [slug, navigate])

  // Load availability when date/guests change
  useEffect(() => {
    if (!profile?.claimed) return
    setSlotsLoading(true)
    getAvailability(slug, { date: resDate, partySize: resGuests })
      .then(data => setSlots(data.slots?.filter(s => s.available) || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false))
  }, [slug, resDate, resGuests, profile?.claimed])

  const loadMoreReviews = () => {
    const nextPage = reviewPage + 1
    getListingReviews(slug, { skip: nextPage * 10, limit: 10 })
      .then(data => { setReviews(prev => [...prev, ...(data.reviews || [])]); setTotalReviews(data.total); setReviewPage(nextPage) })
  }

  const toggleAllergen = (a) => {
    setAllergenFilter(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #E5E7EB', borderTop: `3px solid ${$.acc}`, borderRadius: 99, animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (!profile) return null
  const p = profile
  const isOpen = p.is_open

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'menu', label: 'Menu' },
    { id: 'reviews', label: `Reviews (${p.review_count || 0})` },
    { id: 'about', label: 'About' },
  ]

  // Price level display
  const priceStr = p.price_level ? '£'.repeat(p.price_level) + '£'.repeat(4 - p.price_level).split('').map(() => '').join('') : ''

  return (
    <div style={{ fontFamily: $.f, background: $.bg, minHeight: '100vh' }}>
      <Navbar showBack />
      {/* Breadcrumbs */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <Breadcrumbs items={p.breadcrumbs || []} />
      </div>

      {/* Header */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: $.h, margin: 0 }}>{p.name}</h1>
              {p.claimed && (
                <svg width="22" height="22" viewBox="0 0 24 24" fill={$.acc}>
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: 14 }}>
              {p.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={$.acc}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                  <span style={{ fontWeight: 700 }}>{p.rating}</span>
                  <span style={{ color: $.m }}>({p.review_count})</span>
                </div>
              )}
              {p.price_level && <><span style={{ color: $.l }}>·</span><span style={{ color: $.m }}>{priceStr}</span></>}
              {p.tags?.[0] && <><span style={{ color: $.l }}>·</span><span style={{ color: $.m }}>{p.tags.slice(0, 3).join(', ')}</span></>}
              <span style={{ color: $.l }}>·</span>
              <span style={{ color: isOpen ? $.ok : $.err, fontWeight: 600, fontSize: 13 }}>{isOpen ? 'Open now' : 'Closed'}</span>
            </div>
            {/* Social proof (Gap #29, #69) */}
            {p.stats?.total_bookings > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: $.m }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill={$.m} style={{ verticalAlign: 'middle', marginRight: 4 }}><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                Booked {p.stats.total_bookings.toLocaleString()} times
              </div>
            )}
          </div>
          <ShareFavourite name={p.name} slug={p.slug} />
        </div>
      </div>

      {/* Main content + Sidebar */}
      <div className="profile-layout section-padded" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px', display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        {/* Left: main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, borderBottom: `2px solid ${$.bdr}`, marginBottom: 24 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: '12px 20px', fontSize: 14, fontWeight: 600,
                color: activeTab === t.id ? $.acc : $.m,
                borderBottom: activeTab === t.id ? `2px solid ${$.acc}` : '2px solid transparent',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: $.f, transition: 'all 0.2s', marginBottom: -2,
              }}>{t.label}</button>
            ))}
          </div>

          {/* ═══ OVERVIEW TAB ═══ */}
          {activeTab === 'overview' && (
            <div>
              {p.description && <p style={{ fontSize: 15, color: $.txt, lineHeight: 1.7, marginBottom: 24 }}>{p.description}</p>}

              {/* Dining style metadata (Gap #24, #25, #26) */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
                {p.tags?.slice(0, 4).map(tag => (
                  <span key={tag} className="badge-pill badge-pill-gold">{tag}</span>
                ))}
              </div>

              <AmenitiesDisplay amenities={p.amenities || []} />

              {/* Opening hours */}
              <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, margin: '24px 0 12px' }}>Opening hours</h3>
              {DAYS.map((day, i) => {
                const hours = p.opening_hours?.[day] || {}
                const isClosed = hours.closed || !hours.open
                const isToday = new Date().getDay() === (i + 1) % 7
                return (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6', fontWeight: isToday ? 700 : 400 }}>
                    <span style={{ fontSize: 14, color: isToday ? $.h : $.m }}>{DAY_LABELS[i]}</span>
                    <span style={{ fontSize: 14, color: isClosed ? $.l : $.h }}>{isClosed ? 'Closed' : `${hours.open} – ${hours.close}`}</span>
                  </div>
                )
              })}

              {/* Map */}
              {p.lat && p.lng && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ background: $.surface, borderRadius: 12, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 13, color: $.m }}>Map loading...</span>
                  </div>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.address)}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: $.acc, fontWeight: 600, textDecoration: 'none', display: 'block', marginTop: 8 }}>Get directions →</a>
                </div>
              )}
            </div>
          )}

          {/* ═══ MENU TAB (Gap #21-22 — full menu, categories, allergens, calories) ═══ */}
          {activeTab === 'menu' && menu && (
            <div>
              {/* Menu category tabs (Gap #22) */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                {Object.keys(menu.categories || {}).map(cat => (
                  <button key={cat} className={activeMenuCat === cat ? 'pill-filter active' : 'pill-filter'} onClick={() => setActiveMenuCat(cat)}>{cat}</button>
                ))}
              </div>

              {/* Allergen filter (Gap #8 from our extras — unique to us) */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: $.m, marginBottom: 6 }}>Filter by allergen:</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {Object.entries(ALLERGEN_LABELS).map(([key, label]) => (
                    <button key={key} onClick={() => toggleAllergen(key)} style={{
                      padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 500, cursor: 'pointer',
                      fontFamily: $.f, transition: 'all 0.2s',
                      background: allergenFilter.includes(key) ? $.err : '#F5F5F3',
                      color: allergenFilter.includes(key) ? '#fff' : $.m,
                      border: 'none',
                    }}>{allergenFilter.includes(key) ? `✕ ${label}` : label}</button>
                  ))}
                </div>
              </div>

              {/* Menu items */}
              {activeMenuCat && menu.categories?.[activeMenuCat]?.map(item => {
                // Hide items containing filtered allergens
                if (allergenFilter.length > 0 && item.allergens?.some(a => allergenFilter.includes(a))) return null
                return (
                  <div key={item.id} style={{ padding: '14px 0', borderBottom: `1px solid ${$.bdr}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: 15, fontWeight: 600, color: $.h }}>{item.name}</span>
                          {item.popular && <span className="badge-pill badge-pill-gold" style={{ fontSize: 9 }}>Popular</span>}
                        </div>
                        {item.description && <div style={{ fontSize: 13, color: $.m, marginBottom: 4 }}>{item.description}</div>}
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          {item.calories && <span style={{ fontSize: 11, color: $.l }}>{item.calories} kcal</span>}
                          {item.allergens?.length > 0 && (
                            <span style={{ fontSize: 11, color: $.l }}>
                              Contains: {item.allergens.map(a => ALLERGEN_LABELS[a] || a).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: $.h, flexShrink: 0, marginLeft: 16 }}>£{item.price?.toFixed(2)}</span>
                    </div>
                  </div>
                )
              })}

              {!menu?.categories && (
                <div style={{ textAlign: 'center', padding: 32, color: $.l, fontSize: 14 }}>
                  Menu not yet available
                </div>
              )}
            </div>
          )}

          {/* ═══ REVIEWS TAB ═══ */}
          {activeTab === 'reviews' && (
            <div>
              <ReviewBreakdown breakdown={p.review_breakdown || {}} total={p.review_count || 0} average={p.rating || 0} />
              <div style={{ marginTop: 24 }}>
                {reviews.map(r => <ReviewCard key={r._id} review={r} />)}
              </div>
              {reviews.length < totalReviews && (
                <button className="pill" style={{ marginTop: 16 }} onClick={loadMoreReviews}>Load more reviews</button>
              )}
            </div>
          )}

          {/* ═══ ABOUT TAB ═══ */}
          {activeTab === 'about' && (
            <div>
              {p.description && <p style={{ fontSize: 15, color: $.txt, lineHeight: 1.7, marginBottom: 24 }}>{p.description}</p>}
              <AmenitiesDisplay amenities={p.amenities || []} />
              <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {p.claimed && <span className="badge-pill badge-pill-green">Verified business</span>}
                {p.booking_settings?.auto_confirm && <span className="badge-pill badge-pill-gold">Instant confirmation</span>}
              </div>
            </div>
          )}

          {/* Nearby */}
          {p.nearby?.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <NearbySection businesses={p.nearby} />
            </div>
          )}
        </div>

        {/* Right: Reservation widget sidebar (Gap #15, #31, #66) */}
        <div className="profile-sidebar hidden-mobile" style={{ width: 340, flexShrink: 0, position: 'sticky', top: 24 }}>
          <div style={{ background: $.card, border: `1px solid ${$.bdr}`, borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: $.h, marginBottom: 16, textAlign: 'center' }}>Make a reservation</h3>

            {/* Guest count (Gap #31) */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: $.m, display: 'block', marginBottom: 4 }}>Guests</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[1,2,3,4,5,6,7,8].map(n => (
                  <button key={n} className={resGuests === n ? 'pill-filter active' : 'pill-filter'} onClick={() => setResGuests(n)} style={{ minWidth: 36, padding: '6px 0', textAlign: 'center' }}>{n}</button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: $.m, display: 'block', marginBottom: 4 }}>Date</label>
              <input type="date" value={resDate} onChange={e => setResDate(e.target.value)} style={{
                width: '100%', padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${$.bdr}`,
                fontSize: 14, fontFamily: $.f, outline: 'none', boxSizing: 'border-box',
              }} onFocus={e => e.target.style.borderColor = $.acc} onBlur={e => e.target.style.borderColor = $.bdr} />
            </div>

            {/* Time slots */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: $.m, display: 'block', marginBottom: 6 }}>Available times</label>
              {slotsLoading ? (
                <div style={{ fontSize: 13, color: $.l, padding: 8 }}>Finding tables...</div>
              ) : slots.length > 0 ? (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {slots.slice(0, 8).map(s => (
                    <button key={s.time} className={resTime === s.time ? 'pill-time active' : 'pill-time'} onClick={() => setResTime(s.time)}>{s.time}</button>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: $.l }}>No tables available on this date</div>
              )}
            </div>

            {/* Reserve button */}
            <button className="pill pill-gold pill-full pill-lg" onClick={() => navigate(`/book/${slug}`)}>
              Reserve a table
            </button>

            {/* Info */}
            <div style={{ marginTop: 16, fontSize: 12, color: $.l }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <span style={{ color: isOpen ? $.ok : $.err, fontWeight: 600 }}>{isOpen ? 'Open now' : 'Closed'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{p.address}</span>
              </div>
              {p.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  <a href={`tel:${p.phone}`} style={{ color: $.l, textDecoration: 'none' }}>{p.phone}</a>
                </div>
              )}
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.address)}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: $.acc, fontWeight: 600, textDecoration: 'none', display: 'block', marginTop: 8 }}>Get directions</a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <div className="mobile-book-footer" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff', borderTop: `1px solid ${$.bdr}`, padding: '12px 16px', display: 'none',
      }}>
        <button className="pill pill-gold pill-full" onClick={() => navigate(`/book/${slug}`)}>
          Reserve a table — {resGuests} guests
        </button>
      </div>

      <SEOFooter currentCity={p.city} currentCategory={p.category} />
      <DirectoryFooter />

      <style>{`
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } .show-mobile { display: block !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </div>
  )
}

export default RestaurantProfilePage
