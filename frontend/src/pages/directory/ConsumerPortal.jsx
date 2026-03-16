/**
 * ConsumerPortal — Reeve Now Consumer Account
 * Bookings, favourites, reviews, payments, profile
 * Booksy/Fresha client account model
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/directory/Navbar'
import DirectoryFooter from '../../components/directory/DirectoryFooter'

const $ = { h: '#111111', acc: '#C9A84C', m: '#6B7280', l: '#9CA3AF', bdr: '#E5E7EB', f: "'Figtree',-apple-system,sans-serif", g: '#16a34a', r: '#dc2626' }

const TAB_LIST = [
  { id: 'bookings', label: 'Bookings' },
  { id: 'favourites', label: 'Favourites' },
  { id: 'reviews', label: 'My Reviews' },
  { id: 'payments', label: 'Payments' },
  { id: 'profile', label: 'Profile' },
]

const BookingCard = ({ name, service, date, time, status, past }) => (
  <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${$.bdr}`, padding: 16, marginBottom: 12 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
      <div>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: $.h, margin: 0 }}>{name}</h4>
        <p style={{ fontSize: 13, color: $.m, margin: '2px 0 0' }}>{service}</p>
      </div>
      <span style={{
        padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
        background: status === 'confirmed' ? 'rgba(22,163,74,0.1)' : status === 'cancelled' ? 'rgba(220,38,38,0.1)' : 'rgba(201,168,76,0.1)',
        color: status === 'confirmed' ? $.g : status === 'cancelled' ? $.r : $.acc,
      }}>{status === 'confirmed' ? 'Confirmed' : status === 'cancelled' ? 'Cancelled' : 'Completed'}</span>
    </div>
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
        <span style={{ fontSize: 13, color: $.m }}>{date}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span style={{ fontSize: 13, color: $.m }}>{time}</span>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {!past && status === 'confirmed' && (
        <>
          <button className="pill pill-sm" style={{ fontSize: 12 }}>Reschedule</button>
          <button className="pill pill-sm" style={{ fontSize: 12, background: 'transparent', border: `1px solid ${$.r}`, color: $.r }}>Cancel</button>
        </>
      )}
      {past && status !== 'cancelled' && (
        <>
          <button className="pill pill-sm pill-gold" style={{ fontSize: 12 }}>Rebook</button>
          <button className="pill pill-sm" style={{ fontSize: 12 }}>Leave review</button>
        </>
      )}
    </div>
  </div>
)

const FavCard = ({ name, category, rating, reviewCount }) => (
  <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${$.bdr}`, padding: 16, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
    <div style={{ width: 56, height: 56, borderRadius: 12, background: '#F3F4F6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <h4 style={{ fontSize: 14, fontWeight: 700, color: $.h, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</h4>
      <p style={{ fontSize: 12, color: $.m, margin: '2px 0' }}>{category}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill={$.acc}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
        <span style={{ fontSize: 12, fontWeight: 600, color: $.h }}>{rating}</span>
        <span style={{ fontSize: 12, color: $.l }}>({reviewCount})</span>
      </div>
    </div>
    <button className="pill pill-sm pill-gold" style={{ fontSize: 12, flexShrink: 0 }}>Book</button>
  </div>
)

const ConsumerPortal = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState('bookings')
  const [bookingTab, setBookingTab] = useState('upcoming')

  return (
    <div style={{ fontFamily: $.f, minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFAF7' }}>
      <Navbar showBack />

      {/* Header */}
      <div style={{ background: $.h, padding: 'clamp(24px, 4vw, 40px) 16px 16px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 99, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={$.acc} strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#fff', margin: 0 }}>My Account</h1>
              <p style={{ fontSize: 13, color: $.l, margin: 0 }}>Manage your bookings and favourites</p>
            </div>
          </div>
          {/* Tabs */}
          <div className="filter-pills-scroll" style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
            {TAB_LIST.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '10px 16px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                color: tab === t.id ? $.acc : 'rgba(255,255,255,0.5)',
                borderBottom: tab === t.id ? `2px solid ${$.acc}` : '2px solid transparent',
                background: 'none', border: 'none', borderRadius: 0, cursor: 'pointer',
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px', flex: 1, width: '100%', boxSizing: 'border-box' }}>

        {tab === 'bookings' && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['upcoming', 'past', 'cancelled'].map(bt => (
                <button key={bt} className={bookingTab === bt ? 'pill-filter active' : 'pill-filter'} onClick={() => setBookingTab(bt)} style={{ textTransform: 'capitalize' }}>{bt}</button>
              ))}
            </div>

            {bookingTab === 'upcoming' && (
              <>
                <BookingCard name="Rejuvenate Skin Experts" service="Microneedling — 60 min" date="Tue 18 Mar" time="10:00" status="confirmed" />
                <BookingCard name="Todd & Barlow Barbers" service="Skin Fade — 30 min" date="Fri 21 Mar" time="14:30" status="confirmed" />
              </>
            )}
            {bookingTab === 'past' && (
              <>
                <BookingCard name="Gracie B Hair Studio" service="Cut & Blow Dry — 45 min" date="Mon 10 Mar" time="11:00" status="completed" past />
                <BookingCard name="Pure Bliss Spa" service="Hot Stone Massage — 90 min" date="Sat 1 Mar" time="15:00" status="completed" past />
              </>
            )}
            {bookingTab === 'cancelled' && (
              <BookingCard name="Nailed It Studio" service="Gel Manicure — 45 min" date="Wed 5 Mar" time="09:30" status="cancelled" past />
            )}
          </>
        )}

        {tab === 'favourites' && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, marginBottom: 12 }}>Saved businesses</h3>
            <FavCard name="Rejuvenate Skin Experts" category="Aesthetics — Cardiff" rating="4.9" reviewCount="127" />
            <FavCard name="Micho Turkish Bar & Grill" category="Restaurant — Sheffield" rating="4.6" reviewCount="35" />
            <FavCard name="Todd & Barlow Barbers" category="Barber — Sheffield" rating="4.8" reviewCount="89" />
            <FavCard name="Gracie B Hair Studio" category="Salon — Nottingham" rating="4.7" reviewCount="64" />
          </>
        )}

        {tab === 'reviews' && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, marginBottom: 12 }}>Reviews you've left</h3>
            {[
              { biz: 'Rejuvenate Skin Experts', rating: 5, text: 'Incredible results from my microneedling session. Natalie is so professional and makes you feel completely at ease.', date: '10 Mar 2026' },
              { biz: 'Micho Turkish Bar & Grill', rating: 4, text: 'Great food and atmosphere. The lamb shish was perfectly cooked. Service was a bit slow but friendly.', date: '1 Mar 2026' },
            ].map((r, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, border: `1px solid ${$.bdr}`, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: $.h }}>{r.biz}</span>
                  <span style={{ fontSize: 12, color: $.l }}>{r.date}</span>
                </div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                  {[1,2,3,4,5].map(s => <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= r.rating ? $.acc : '#E5E7EB'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>)}
                </div>
                <p style={{ fontSize: 14, color: $.m, lineHeight: 1.6, margin: 0 }}>{r.text}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button className="pill pill-sm" style={{ fontSize: 12 }}>Edit</button>
                  <button className="pill pill-sm" style={{ fontSize: 12, background: 'transparent', border: `1px solid ${$.r}`, color: $.r }}>Delete</button>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'payments' && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, marginBottom: 12 }}>Saved cards</h3>
            <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${$.bdr}`, padding: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 28, borderRadius: 6, background: '#1a1f36', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>VISA</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: $.h }}>**** **** **** 4242</span>
                <span style={{ fontSize: 12, color: $.l, marginLeft: 8 }}>Expires 12/27</span>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(22,163,74,0.1)', color: $.g, fontSize: 11, fontWeight: 600 }}>Default</span>
            </div>
            <button className="pill pill-sm" style={{ fontSize: 13, marginBottom: 24 }}>Add new card</button>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, marginBottom: 12 }}>Transaction history</h3>
            {[
              { biz: 'Rejuvenate Skin Experts', amount: '£15.00', type: 'Booking fee', date: '16 Mar 2026' },
              { biz: 'Pure Bliss Spa', amount: '£25.00', type: 'Booking fee', date: '1 Mar 2026' },
              { biz: 'Rejuvenate Skin Experts', amount: '£15.00', type: 'Refund', date: '28 Feb 2026' },
            ].map((tx, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${$.bdr}`, padding: 14, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: $.h }}>{tx.biz}</span>
                  <div style={{ fontSize: 12, color: $.l }}>{tx.type} — {tx.date}</div>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: tx.type === 'Refund' ? $.g : $.h }}>{tx.type === 'Refund' ? '+' : ''}{tx.amount}</span>
              </div>
            ))}
          </>
        )}

        {tab === 'profile' && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, marginBottom: 16 }}>Personal details</h3>
            <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${$.bdr}`, padding: 'clamp(16px, 3vw, 24px)' }}>
              {[
                { label: 'First name', value: '', placeholder: 'Your first name' },
                { label: 'Last name', value: '', placeholder: 'Your last name' },
                { label: 'Email', value: '', placeholder: 'you@email.com', type: 'email' },
                { label: 'Phone', value: '', placeholder: '07xxx xxx xxx', type: 'tel' },
                { label: 'Date of birth', value: '', placeholder: '', type: 'date' },
              ].map((field, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, color: $.m, fontWeight: 500, marginBottom: 6 }}>{field.label}</label>
                  <input type={field.type || 'text'} placeholder={field.placeholder} style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${$.bdr}`, borderRadius: 10, fontSize: 14, fontFamily: $.f, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}

              <h4 style={{ fontSize: 14, fontWeight: 700, color: $.h, margin: '20px 0 12px' }}>Notification preferences</h4>
              {['Booking confirmations', 'Reminder notifications', 'Promotions & offers', 'Review requests'].map((pref, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked={i < 2} style={{ accentColor: $.acc, width: 18, height: 18 }} />
                  <span style={{ fontSize: 14, color: $.h }}>{pref}</span>
                </label>
              ))}

              <button className="pill pill-gold" style={{ marginTop: 16, width: '100%', padding: '14px 28px' }}>Save profile</button>
            </div>

            <button style={{ marginTop: 24, display: 'block', width: '100%', padding: 14, background: 'transparent', border: `1px solid ${$.r}`, borderRadius: 12, color: $.r, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: $.f }}>Delete my account</button>
          </>
        )}
      </div>

      <DirectoryFooter />
    </div>
  )
}

export default ConsumerPortal
