/**
 * BusinessPortal — Reeve Now Business Portal
 * Free listing management: analytics, reviews, listing editor, upgrade CTA
 * Yell.com model — manage your free directory listing
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/directory/Navbar'
import DirectoryFooter from '../../components/directory/DirectoryFooter'

const $ = { h: '#111111', acc: '#C9A84C', m: '#6B7280', l: '#9CA3AF', bdr: '#E5E7EB', f: "'Figtree',-apple-system,sans-serif" }

const TAB_LIST = [
  { id: 'overview', label: 'Overview' },
  { id: 'listing', label: 'My Listing' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'notifications', label: 'Notifications' },
]

const StatCard = ({ label, value, change, icon }) => (
  <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${$.bdr}`, padding: 20, flex: '1 1 140px', minWidth: 140 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
      <span style={{ fontSize: 12, color: $.m, fontWeight: 500 }}>{label}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2">{icon}</svg>
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: $.h }}>{value}</div>
    {change && <div style={{ fontSize: 12, color: change.startsWith('+') ? '#16a34a' : $.m, marginTop: 4 }}>{change} vs last month</div>}
  </div>
)

const ReviewCard = ({ name, rating, date, text, service }) => (
  <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${$.bdr}`, padding: 20, marginBottom: 12 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <div>
        <span style={{ fontWeight: 700, fontSize: 14, color: $.h }}>{name}</span>
        {service && <span style={{ fontSize: 12, color: $.m, marginLeft: 8 }}>{service}</span>}
      </div>
      <span style={{ fontSize: 12, color: $.l }}>{date}</span>
    </div>
    <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= rating ? $.acc : '#E5E7EB'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
      ))}
    </div>
    <p style={{ fontSize: 14, color: $.m, lineHeight: 1.6, margin: 0 }}>{text}</p>
    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
      <button className="pill pill-sm" style={{ fontSize: 12 }}>Reply publicly</button>
      <button className="pill pill-sm" style={{ fontSize: 12, background: 'transparent', border: `1px solid ${$.bdr}` }}>Reply privately</button>
    </div>
  </div>
)

const BusinessPortal = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')

  return (
    <div style={{ fontFamily: $.f, minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFAF7' }}>
      <Navbar showBack />

      {/* Header */}
      <div style={{ background: $.h, padding: 'clamp(24px, 4vw, 40px) 16px 16px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={$.acc} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#fff', margin: 0 }}>Your Business</h1>
              <p style={{ fontSize: 13, color: $.l, margin: 0 }}>Free listing on Reeve Now</p>
            </div>
            <span style={{ padding: '4px 12px', borderRadius: 99, background: 'rgba(201,168,76,0.15)', color: $.acc, fontSize: 12, fontWeight: 600 }}>Free plan</span>
            <button onClick={() => navigate('/')} style={{
              padding: '8px 16px', borderRadius: 99, background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 13,
              fontWeight: 600, cursor: 'pointer', fontFamily: $.f, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = $.acc; e.currentTarget.style.color = $.acc }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Log out
            </button>
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
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px', flex: 1, width: '100%', boxSizing: 'border-box' }}>

        {tab === 'overview' && (
          <>
            {/* Stats */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
              <StatCard label="Page views" value="247" change="+18%" icon={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>} />
              <StatCard label="Phone taps" value="34" change="+6%" icon={<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72"/>} />
              <StatCard label="Direction requests" value="19" change="+12%" icon={<><polygon points="3 11 22 2 13 21 11 13 3 11"/></>} />
              <StatCard label="Tried to book" value="52" change="+31%" icon={<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></>} />
            </div>

            {/* Upgrade CTA */}
            <div style={{ background: $.h, borderRadius: 16, padding: 'clamp(20px, 3vw, 32px)', marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>52 people tried to book you this month</h3>
              <p style={{ fontSize: 14, color: $.l, marginBottom: 16, lineHeight: 1.6 }}>
                They visited your page but couldn't book because you don't have online booking enabled. Upgrade to ReeveOS Starter (£8.99/mo) to accept bookings and never miss a customer again.
              </p>
              <a href="https://portal.rezvo.app/register" className="pill pill-gold">Enable online booking</a>
            </div>

            {/* Recent reviews */}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, marginBottom: 12 }}>Recent reviews</h3>
            <ReviewCard name="Sarah M." rating={5} date="2 days ago" text="Absolutely loved it. The staff were so welcoming and professional. Will definitely be back!" service="Microneedling" />
            <ReviewCard name="James K." rating={4} date="1 week ago" text="Great experience overall. Only docking one star because I had to wait 10 minutes past my appointment time." service="Haircut" />
          </>
        )}

        {tab === 'listing' && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, marginBottom: 16 }}>Edit your listing</h3>
            <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${$.bdr}`, padding: 'clamp(16px, 3vw, 24px)' }}>
              {[
                { label: 'Business name', value: 'Your Business Name', type: 'text' },
                { label: 'Category', value: 'Salon', type: 'select' },
                { label: 'Address', value: '123 High Street', type: 'text' },
                { label: 'City', value: 'Sheffield', type: 'text' },
                { label: 'Postcode', value: 'S1 1AA', type: 'text' },
                { label: 'Phone', value: '07xxx xxx xxx', type: 'tel' },
                { label: 'Email', value: 'hello@yourbusiness.co.uk', type: 'email' },
                { label: 'Website', value: 'https://yourbusiness.co.uk', type: 'url' },
                { label: 'Description', value: 'Tell customers about your business...', type: 'textarea' },
              ].map((field, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, color: $.m, fontWeight: 500, marginBottom: 6 }}>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea rows={3} placeholder={field.value} style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${$.bdr}`, borderRadius: 10, fontSize: 14, fontFamily: $.f, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                  ) : (
                    <input type={field.type} placeholder={field.value} style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${$.bdr}`, borderRadius: 10, fontSize: 14, fontFamily: $.f, outline: 'none', boxSizing: 'border-box' }} />
                  )}
                </div>
              ))}
              <h4 style={{ fontSize: 14, fontWeight: 700, color: $.h, marginBottom: 12 }}>Photos</h4>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ width: 80, height: 80, borderRadius: 10, background: '#F3F4F6', border: `1.5px dashed ${$.bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={$.l} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                ))}
                <div style={{ width: 80, height: 80, borderRadius: 10, background: '#fff', border: `1.5px dashed ${$.acc}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={$.acc} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
              </div>

              <h4 style={{ fontSize: 14, fontWeight: 700, color: $.h, marginBottom: 12 }}>Opening hours</h4>
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
                <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ width: 90, fontSize: 13, fontWeight: 500, color: $.h }}>{day}</span>
                  <input type="time" defaultValue="09:00" style={{ padding: '6px 10px', border: `1.5px solid ${$.bdr}`, borderRadius: 8, fontSize: 13, fontFamily: $.f }} />
                  <span style={{ color: $.l, fontSize: 13 }}>to</span>
                  <input type="time" defaultValue="17:00" style={{ padding: '6px 10px', border: `1.5px solid ${$.bdr}`, borderRadius: 8, fontSize: 13, fontFamily: $.f }} />
                </div>
              ))}
              <button className="pill pill-gold" style={{ marginTop: 16, width: '100%', padding: '14px 28px' }}>Save changes</button>
            </div>
          </>
        )}

        {tab === 'analytics' && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, marginBottom: 16 }}>Analytics — last 30 days</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
              <StatCard label="Unique visitors" value="189" change="+22%" icon={<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></>} />
              <StatCard label="Website clicks" value="28" change="+9%" icon={<><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>} />
              <StatCard label="Tried to book" value="52" change="+31%" icon={<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/></>} />
            </div>
            {/* Placeholder chart */}
            <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${$.bdr}`, padding: 24, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: $.l, fontSize: 14 }}>Chart will appear when your listing has more data</p>
            </div>
          </>
        )}

        {tab === 'reviews' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, margin: 0 }}>Reviews (6)</h3>
              <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {[1,2,3,4,5].map(i => <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= 4 ? $.acc : '#E5E7EB'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>)}
                <span style={{ fontSize: 14, fontWeight: 700, color: $.h, marginLeft: 6 }}>4.7</span>
              </div>
            </div>
            <ReviewCard name="Sarah M." rating={5} date="2 days ago" text="Absolutely loved it. The staff were so welcoming and professional." service="Microneedling" />
            <ReviewCard name="James K." rating={4} date="1 week ago" text="Great experience overall. Slight wait but excellent service." service="Haircut" />
            <ReviewCard name="Emma L." rating={5} date="2 weeks ago" text="Best salon in Sheffield! Always leave feeling amazing." service="Blow Dry" />
          </>
        )}

        {tab === 'notifications' && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: $.h, marginBottom: 16 }}>Notifications</h3>
            {[
              { type: 'booking', text: '52 people tried to book you this month but couldn\'t. Enable online booking to convert them.', time: 'Today', cta: 'Enable booking' },
              { type: 'review', text: 'Sarah M. left you a 5-star review. Reply to keep customers engaged.', time: '2 days ago', cta: 'Reply' },
              { type: 'views', text: 'Your page views are up 18% this month. Keep your listing updated to maintain momentum.', time: '1 week ago', cta: null },
            ].map((n, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, border: `1px solid ${$.bdr}`, padding: 16, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontSize: 14, color: $.h, margin: 0, lineHeight: 1.5 }}>{n.text}</p>
                  <span style={{ fontSize: 12, color: $.l }}>{n.time}</span>
                </div>
                {n.cta && <button className="pill pill-sm pill-gold" style={{ fontSize: 12 }}>{n.cta}</button>}
              </div>
            ))}
          </>
        )}
      </div>

      <DirectoryFooter />
    </div>
  )
}

export default BusinessPortal
