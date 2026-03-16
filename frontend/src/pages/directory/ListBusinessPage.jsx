/**
 * ListBusinessPage — "List your business" registration of interest
 * Temporary until full Reeve Now Business Portal is built
 * Simple form: name, email, phone, business name, category
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/directory/Navbar'
import DirectoryFooter from '../../components/directory/DirectoryFooter'

const $ = {
  h: '#111111', acc: '#C9A84C', m: '#6B7280', l: '#9CA3AF',
  bdr: '#E5E7EB', f: "'Figtree',-apple-system,sans-serif",
}

const CATEGORIES = [
  'Restaurant', 'Salon', 'Barber', 'Aesthetics', 'Spa', 'Nails', 'Café', 'Gym', 'Other'
]

const ListBusinessPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', business: '', category: '', city: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: POST to /api/directory/register-interest when backend endpoint exists
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ fontFamily: $.f, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar showBack />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={$.acc} strokeWidth="2" style={{ marginBottom: 16 }}>
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: $.h, marginBottom: 8 }}>You're on the list</h1>
            <p style={{ fontSize: 15, color: $.m, marginBottom: 24, lineHeight: 1.6 }}>
              We'll be in touch shortly to get your business listed on Reeve. In the meantime, your free listing will appear in search results within 24 hours.
            </p>
            <button className="pill pill-gold" onClick={() => navigate('/')}>Back to Reeve</button>
          </div>
        </div>
        <DirectoryFooter />
      </div>
    )
  }

  return (
    <div style={{ fontFamily: $.f, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar showBack />

      {/* Hero */}
      <div style={{ background: $.h, padding: '48px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>
          List your business on Reeve
        </h1>
        <p style={{ fontSize: 16, color: $.l, maxWidth: 500, margin: '0 auto' }}>
          Get found by local customers. Free listing, zero commission, takes 2 minutes.
        </p>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 560, margin: '-32px auto 0', padding: '0 24px 48px', position: 'relative', zIndex: 1, flex: 1 }}>
        <div style={{
          background: '#fff', borderRadius: 16, border: `1px solid ${$.bdr}`,
          padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: $.m, fontWeight: 500, marginBottom: 6 }}>Your name</label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="e.g. Natalie Smith"
                style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${$.bdr}`, borderRadius: 10, fontSize: 14, fontFamily: $.f, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = $.acc} onBlur={e => e.target.style.borderColor = $.bdr} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: $.m, fontWeight: 500, marginBottom: 6 }}>Email</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="you@yourbusiness.co.uk"
                style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${$.bdr}`, borderRadius: 10, fontSize: 14, fontFamily: $.f, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = $.acc} onBlur={e => e.target.style.borderColor = $.bdr} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: $.m, fontWeight: 500, marginBottom: 6 }}>Phone</label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                placeholder="07xxx xxx xxx"
                style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${$.bdr}`, borderRadius: 10, fontSize: 14, fontFamily: $.f, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = $.acc} onBlur={e => e.target.style.borderColor = $.bdr} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: $.m, fontWeight: 500, marginBottom: 6 }}>Business name</label>
              <input type="text" required value={form.business} onChange={e => setForm({...form, business: e.target.value})}
                placeholder="e.g. Rejuvenate Skin Experts"
                style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${$.bdr}`, borderRadius: 10, fontSize: 14, fontFamily: $.f, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = $.acc} onBlur={e => e.target.style.borderColor = $.bdr} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: $.m, fontWeight: 500, marginBottom: 6 }}>Category</label>
                <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${$.bdr}`, borderRadius: 10, fontSize: 14, fontFamily: $.f, outline: 'none', boxSizing: 'border-box', background: '#fff' }}>
                  <option value="">Select...</option>
                  {CATEGORIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: $.m, fontWeight: 500, marginBottom: 6 }}>City</label>
                <input type="text" required value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                  placeholder="e.g. Sheffield"
                  style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${$.bdr}`, borderRadius: 10, fontSize: 14, fontFamily: $.f, outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = $.acc} onBlur={e => e.target.style.borderColor = $.bdr} />
              </div>
            </div>

            <button type="submit" className="pill pill-gold" style={{ width: '100%', padding: '14px 28px', fontSize: 16 }}>
              List my business — it's free
            </button>
          </form>

          <p style={{ fontSize: 12, color: $.l, textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
            By listing your business you agree to our Terms of Service and Privacy Policy. We'll never share your details with third parties.
          </p>
        </div>

        {/* Benefits */}
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { title: 'Free forever', desc: 'Your basic listing is always free. No hidden fees.' },
            { title: 'Zero commission', desc: 'We never take a cut of your bookings or sales.' },
            { title: 'Found on Google', desc: 'Your listing is SEO optimised to help customers find you.' },
            { title: 'Upgrade when you\'re ready', desc: 'Add online bookings, CRM, EPOS and more with ReeveOS.' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={$.acc} strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: $.h, marginBottom: 2 }}>{b.title}</div>
                <div style={{ fontSize: 13, color: $.m }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DirectoryFooter />
    </div>
  )
}

export default ListBusinessPage
