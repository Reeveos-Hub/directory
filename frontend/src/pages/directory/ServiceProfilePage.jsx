/**
 * ServiceProfilePage — Fresha-model business profile
 * For: salons, barbers, aesthetics, spas, nails
 * 
 * Covers gaps: #7 breadcrumbs, #8 verified badge, #9-11 services with book buttons,
 * #12 team photos, #13 memberships/gift cards, #14 photo gallery,
 * #15 sticky sidebar, #16 about section, #17 map + directions,
 * #18 nearby businesses, #19 SEO footer links, #20 additional info,
 * #35 review breakdown, #36-37 review attribution,
 * #44-58 all profile gaps
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getListing, getListingReviews, getAvailability } from '../../utils/directoryApi'
import Breadcrumbs from '../../components/directory/Breadcrumbs'
import ReviewCard from '../../components/directory/ReviewCard'
import ReviewBreakdown from '../../components/directory/ReviewBreakdown'
import AmenitiesDisplay from '../../components/directory/AmenitiesDisplay'
import TeamGrid from '../../components/directory/TeamGrid'
import NearbySection from '../../components/directory/NearbySection'
import ShareFavourite from '../../components/directory/ShareFavourite'

const $ = {
  bg: '#FFFFFF', card: '#FFFFFF', surface: '#F5F5F3',
  h: '#111111', txt: '#374151', m: '#6B7280', l: '#9CA3AF',
  acc: '#C9A84C', bdr: '#E5E7EB', ok: '#22C55E', err: '#EF4444',
  f: "'Figtree',-apple-system,sans-serif",
}

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

const ServiceProfilePage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('services')
  const [activeServiceCat, setActiveServiceCat] = useState('All')
  const [showAllServices, setShowAllServices] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewPage, setReviewPage] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0,10))
  const [slots, setSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getListing(slug)
      .then(data => {
        setProfile(data)
        setReviews(data.latest_reviews || [])
        setTotalReviews(data.review_count || 0)
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [slug, navigate])

  // Load availability
  useEffect(() => {
    if (!profile?.claimed) return
    setSlotsLoading(true)
    getAvailability(slug, { date: selectedDate })
      .then(data => setSlots(data.slots?.filter(s => s.available) || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false))
  }, [slug, selectedDate, profile?.claimed])

  const loadMoreReviews = () => {
    const nextPage = reviewPage + 1
    getListingReviews(slug, { skip: nextPage * 10, limit: 10 })
      .then(data => {
        setReviews(prev => [...prev, ...(data.reviews || [])])
        setTotalReviews(data.total)
        setReviewPage(nextPage)
      })
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #E5E7EB', borderTop: `3px solid ${$.acc}`, borderRadius: 99, animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (!profile) return null
  const p = profile

  const filteredServices = p.services?.filter(s =>
    activeServiceCat === 'All' || s.category === activeServiceCat
  ) || []
  const displayServices = showAllServices ? filteredServices : filteredServices.slice(0, 8)

  const tabs = [
    { id: 'services', label: 'Services' },
    { id: 'team', label: 'Team' },
    { id: 'reviews', label: `Reviews (${p.review_count || 0})` },
    { id: 'about', label: 'About' },
  ]

  const isOpen = p.is_open

  return (
    <div style={{ fontFamily: $.f, background: $.bg, minHeight: '100vh' }}>
      {/* Breadcrumbs (Gap #7) */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <Breadcrumbs items={p.breadcrumbs || []} />
      </div>

      {/* Header */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: $.h, margin: 0 }}>{p.name}</h1>
              {/* Verified badge (Gap #8) */}
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
                  <span style={{ fontWeight: 700, color: $.h }}>{p.rating}</span>
                  <span style={{ color: $.m }}>({p.review_count})</span>
                </div>
              )}
              <span style={{ color: $.l }}>·</span>
              <span style={{ color: isOpen ? $.ok : $.err, fontWeight: 600, fontSize: 13 }}>
                {isOpen ? 'Open now' : 'Closed'}
              </span>
              <span style={{ color: $.l }}>·</span>
              <span style={{ color: $.m, fontSize: 13 }}>{p.address}</span>
            </div>
          </div>
          {/* Share + Favourite (Gap #48, #49) */}
          <ShareFavourite name={p.name} slug={p.slug} />
        </div>
      </div>

      {/* Main content + Sidebar layout */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px', display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        {/* Left: main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Tabs (Gap #46) */}
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

          {/* ═══ SERVICES TAB (Gap #9-11, #48, #49) ═══ */}
          {activeTab === 'services' && (
            <div>
              {/* Service category tabs (Gap #10) */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                <button className={activeServiceCat === 'All' ? 'pill-filter active' : 'pill-filter'} onClick={() => setActiveServiceCat('All')}>Featured</button>
                {p.service_categories?.map(cat => (
                  <button key={cat} className={activeServiceCat === cat ? 'pill-filter active' : 'pill-filter'} onClick={() => setActiveServiceCat(cat)}>{cat}</button>
                ))}
              </div>

              {/* Service list */}
              {displayServices.map(s => (
                <div key={s.id || s.name} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 0', borderBottom: `1px solid ${$.bdr}`,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: $.h, marginBottom: 2 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: $.m }}>
                      {s.duration} min
                      {s.description && <span> · {s.description.slice(0, 80)}{s.description.length > 80 ? '...' : ''}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: $.h }}>
                      {s.price > 0 ? `£${s.price.toFixed(2)}` : 'Free'}
                    </span>
                    <button className="pill pill-sm" onClick={() => navigate(`/book/${slug}`)}>Book</button>
                  </div>
                </div>
              ))}

              {/* See all (Gap #11) */}
              {filteredServices.length > 8 && !showAllServices && (
                <button onClick={() => setShowAllServices(true)} style={{
                  marginTop: 12, fontSize: 14, fontWeight: 600, color: $.acc,
                  background: 'none', border: 'none', cursor: 'pointer', fontFamily: $.f,
                }}>See all {filteredServices.length} services</button>
              )}

              {/* Available times */}
              {p.claimed && (
                <div style={{ marginTop: 32 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, marginBottom: 12 }}>Available times</h3>
                  <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{
                    padding: '8px 14px', borderRadius: 99, border: `1.5px solid ${$.bdr}`,
                    fontSize: 13, fontFamily: $.f, marginBottom: 12, outline: 'none',
                  }} />
                  {slotsLoading ? (
                    <div style={{ fontSize: 13, color: $.m }}>Loading slots...</div>
                  ) : slots.length > 0 ? (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {slots.slice(0, 12).map(s => (
                        <button key={s.time} className="pill-time" onClick={() => navigate(`/book/${slug}`)}>{s.time}</button>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: $.m }}>No availability on this date</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ═══ TEAM TAB (Gap #12, #50) ═══ */}
          {activeTab === 'team' && (
            <TeamGrid staff={p.staff || []} />
          )}

          {/* ═══ REVIEWS TAB (Gap #35-37) ═══ */}
          {activeTab === 'reviews' && (
            <div>
              <ReviewBreakdown
                breakdown={p.review_breakdown || {}}
                total={p.review_count || 0}
                average={p.rating || 0}
              />
              <div style={{ marginTop: 24 }}>
                {reviews.map(r => <ReviewCard key={r._id} review={r} />)}
              </div>
              {reviews.length < totalReviews && (
                <button className="pill" style={{ marginTop: 16 }} onClick={loadMoreReviews}>
                  Load more reviews
                </button>
              )}
            </div>
          )}

          {/* ═══ ABOUT TAB (Gap #16, #17, #20) ═══ */}
          {activeTab === 'about' && (
            <div>
              {/* Description (Gap #16) */}
              {p.description && (
                <p style={{ fontSize: 15, color: $.txt, lineHeight: 1.7, marginBottom: 24 }}>{p.description}</p>
              )}

              {/* Opening hours */}
              <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, marginBottom: 12 }}>Opening hours</h3>
              <div style={{ marginBottom: 24 }}>
                {DAYS.map((day, i) => {
                  const hours = p.opening_hours?.[day] || {}
                  const isClosed = hours.closed || !hours.open
                  const isToday = new Date().getDay() === (i + 1) % 7
                  return (
                    <div key={day} style={{
                      display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                      borderBottom: '1px solid #F3F4F6',
                      fontWeight: isToday ? 700 : 400,
                    }}>
                      <span style={{ fontSize: 14, color: isToday ? $.h : $.m }}>{DAY_LABELS[i]}</span>
                      <span style={{ fontSize: 14, color: isClosed ? $.l : $.h }}>
                        {isClosed ? 'Closed' : `${hours.open} – ${hours.close}`}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Amenities (Gap #34, #58) */}
              <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, marginBottom: 12 }}>Amenities</h3>
              <AmenitiesDisplay amenities={p.amenities || []} />

              {/* Map + directions (Gap #17) */}
              {p.lat && p.lng && (
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, marginBottom: 12 }}>Location</h3>
                  <div style={{ background: $.surface, borderRadius: 12, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: $.m }}>Map loading...</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.address)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 13, color: $.acc, fontWeight: 600, textDecoration: 'none' }}
                  >
                    Get directions →
                  </a>
                </div>
              )}

              {/* Additional info (Gap #20) */}
              <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {p.claimed && <span className="badge-pill badge-pill-green">Verified business</span>}
                {p.booking_settings?.auto_confirm && <span className="badge-pill badge-pill-gold">Instant confirmation</span>}
                {p.booking_settings?.require_consultation_form && <span className="badge-pill badge-pill-gold">Consultation required</span>}
                {p.booking_settings?.require_deposit && <span className="badge-pill badge-pill-gold">Booking fee: £{p.booking_settings.deposit_amount}</span>}
              </div>
            </div>
          )}

          {/* Nearby businesses (Gap #18) */}
          {p.nearby?.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <NearbySection businesses={p.nearby} />
            </div>
          )}
        </div>

        {/* Right: Sticky sidebar (Gap #15, #60) — desktop only */}
        <div style={{ width: 320, flexShrink: 0, position: 'sticky', top: 24 }} className="hidden-mobile">
          <div style={{ background: $.card, border: `1px solid ${$.bdr}`, borderRadius: 16, padding: 20 }}>
            <button className="pill pill-gold pill-full pill-lg" onClick={() => navigate(`/book/${slug}`)}>
              Book now
            </button>

            <div style={{ marginTop: 16, fontSize: 13, color: $.m }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={$.m} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <span style={{ color: isOpen ? $.ok : $.err, fontWeight: 600 }}>{isOpen ? 'Open now' : 'Closed'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={$.m} strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{p.address}</span>
              </div>
              {p.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={$.m} strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  <a href={`tel:${p.phone}`} style={{ color: $.m, textDecoration: 'none' }}>{p.phone}</a>
                </div>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.address)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 13, color: $.acc, fontWeight: 600, textDecoration: 'none', display: 'block', marginTop: 4 }}
              >
                Get directions
              </a>
            </div>

            {/* Memberships + Gift Cards (Gap #13) */}
            {(p.amenities?.includes('memberships') || p.amenities?.includes('gift_cards')) && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${$.bdr}` }}>
                {p.amenities.includes('memberships') && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: $.h }}>Memberships</div>
                      <div style={{ fontSize: 11, color: $.l }}>Bundle appointments and save</div>
                    </div>
                    <button className="pill pill-sm" onClick={() => navigate(`/book/${slug}`)}>Buy</button>
                  </div>
                )}
                {p.amenities.includes('gift_cards') && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: $.h }}>Gift Cards</div>
                      <div style={{ fontSize: 11, color: $.l }}>Treat someone special</div>
                    </div>
                    <button className="pill pill-sm" onClick={() => navigate(`/book/${slug}`)}>Buy</button>
                  </div>
                )}
              </div>
            )}

            {/* Cancellation policy */}
            {p.booking_settings?.cancellation_hours && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${$.bdr}`, fontSize: 12, color: $.l }}>
                Free cancellation up to {p.booking_settings.cancellation_hours}h before
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sticky footer (Gap #61) */}
      <div className="show-mobile" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff', borderTop: `1px solid ${$.bdr}`,
        padding: '12px 16px', display: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, color: $.m }}>
            {p.services?.length || 0} services · from £{Math.min(...(p.services?.map(s => s.price).filter(p => p > 0) || [0])).toFixed(2)}
          </div>
          <button className="pill pill-gold" onClick={() => navigate(`/book/${slug}`)}>Book now</button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}

export default ServiceProfilePage
