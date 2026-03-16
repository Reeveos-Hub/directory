/**
 * ExperiencesPage — /experiences on reevenow.com
 * Curated experience discovery — like DesignMyNight's "Inspire Me"
 * City, occasion, type filters → business listings
 */
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/directory/Navbar'
import ReeveNowFooter from '../../components/directory/ReeveNowFooter'

const API = import.meta.env.VITE_API_URL || 'https://api.reevenow.com'
const INDIGO = '#1A2744'
const AMBER = '#FFB627'
const f = "'Figtree',-apple-system,sans-serif"

const CITIES = ['Sheffield', 'Nottingham', 'Cardiff', 'London', 'Birmingham', 'Manchester', 'Leeds', 'Bristol']

const EXPERIENCE_TYPES = [
  { id: 'date-night',      label: 'Date Night',         icon: '♡', desc: 'Romantic restaurants and intimate venues', img: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400&h=300&fit=crop' },
  { id: 'bottomless',      label: 'Bottomless Brunch',  icon: '🥂', desc: 'Unlimited drinks and brunch', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
  { id: 'group-dining',    label: 'Group Dining',        icon: '⬡', desc: 'Private dining and large tables', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop' },
  { id: 'spa-beauty',      label: 'Spa & Beauty Day',   icon: '◈', desc: 'Treatments, facials, and relaxation', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop' },
  { id: 'hen-do',          label: 'Hen Do',              icon: '◆', desc: 'Group celebrations and parties', img: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=400&h=300&fit=crop' },
  { id: 'birthday',        label: 'Birthday Dining',    icon: '★', desc: 'Special occasion restaurants', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop' },
  { id: 'work-lunch',      label: 'Business Lunch',     icon: '◇', desc: 'Professional dining and meetings', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop' },
  { id: 'sunday-lunch',    label: 'Sunday Lunch',        icon: '○', desc: 'Traditional Sunday roasts', img: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=300&fit=crop' },
]

const OCCASIONS = [
  { id: 'date',        label: 'Date night' },
  { id: 'birthday',   label: 'Birthday' },
  { id: 'anniversary',label: 'Anniversary' },
  { id: 'hen-do',     label: 'Hen do' },
  { id: 'work',       label: 'Work lunch' },
  { id: 'family',     label: 'Family meal' },
]

export default function ExperiencesPage() {
  const navigate = useNavigate()
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedOccasion, setSelectedOccasion] = useState('')
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(false)

  const handleExperienceClick = (type) => {
    const params = new URLSearchParams()
    params.set('experience', type.id)
    if (selectedCity) params.set('city', selectedCity)
    navigate(`/search?${params.toString()}`)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedCity) params.set('city', selectedCity)
    if (selectedOccasion) params.set('occasion', selectedOccasion)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div style={{ fontFamily: f, background: '#ffffff', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: INDIGO, padding: 'clamp(48px,8vw,80px) 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${AMBER}10 0%, transparent 70%)` }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: `${AMBER}20`, color: AMBER, fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 20, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Independent only</div>
          <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: 'white', letterSpacing: -1, marginBottom: 14, lineHeight: 1.1 }}>
            What experience are<br />you looking for?
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, maxWidth: 520, margin: '0 auto 32px' }}>
            Discover independent restaurants, salons, and venues curated for every occasion.
          </p>

          {/* Filter bar */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 640, margin: '0 auto' }}>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              style={{ padding: '12px 18px', borderRadius: 50, border: 'none', fontSize: 14, fontFamily: f, fontWeight: 600, background: 'white', color: INDIGO, cursor: 'pointer', minWidth: 160 }}
            >
              <option value="">Any city</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={selectedOccasion}
              onChange={e => setSelectedOccasion(e.target.value)}
              style={{ padding: '12px 18px', borderRadius: 50, border: 'none', fontSize: 14, fontFamily: f, fontWeight: 600, background: 'white', color: INDIGO, cursor: 'pointer', minWidth: 180 }}
            >
              <option value="">Any occasion</option>
              {OCCASIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
            <button
              onClick={handleSearch}
              style={{ padding: '12px 28px', borderRadius: 50, border: 'none', background: AMBER, color: INDIGO, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: f }}
            >
              Find experiences
            </button>
          </div>
        </div>
      </div>

      {/* Experience type cards */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 16px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: INDIGO, marginBottom: 8 }}>Browse by experience</h2>
        <p style={{ fontSize: 15, color: '#888', marginBottom: 32 }}>Every venue listed on Reeve Now is independently owned and operated.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {EXPERIENCE_TYPES.map(type => (
            <div
              key={type.id}
              onClick={() => handleExperienceClick(type)}
              style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer', position: 'relative', aspectRatio: '4/3', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img src={type.img} alt={type.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,39,68,0.9) 0%, rgba(26,39,68,0.1) 60%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 18px' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'white', marginBottom: 4 }}>{type.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{type.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* City experience guides (blog links) */}
      <div style={{ background: 'white', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: INDIGO, marginBottom: 8 }}>City experience guides</h2>
          <p style={{ fontSize: 15, color: '#888', marginBottom: 32 }}>Local knowledge from people who actually live there.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { city: 'Sheffield', slug: 'date-night-sheffield-independent-restaurants', img: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&h=400&fit=crop', label: 'Date night in Sheffield' },
              { city: 'Nottingham', slug: 'first-date-ideas-nottingham', img: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=600&h=400&fit=crop', label: 'First date ideas in Nottingham' },
              { city: 'Cardiff', slug: 'spa-day-near-cardiff-independent', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop', label: 'Spa days near Cardiff' },
              { city: 'Sheffield', slug: 'hen-do-sheffield-ideas-2026', img: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&h=400&fit=crop', label: 'Hen do ideas in Sheffield' },
            ].map(guide => (
              <Link key={guide.slug} to={`/blog/${guide.slug}`} style={{ textDecoration: 'none', borderRadius: 14, overflow: 'hidden', position: 'relative', display: 'block', aspectRatio: '16/9' }}>
                <img src={guide.img} alt={guide.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,39,68,0.85) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '16px' }}>
                  <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>{guide.city}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>{guide.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Why independent CTA */}
      <div style={{ background: INDIGO, padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 12 }}>Why we only list independent businesses</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
            Every business on Reeve Now is independently owned. No chains. No franchises. When you book here, the money stays local.
          </p>
          <Link to="/blog/why-book-independent-not-chain" style={{ display: 'inline-block', background: AMBER, color: INDIGO, padding: '12px 28px', borderRadius: 50, fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
            Read why it matters
          </Link>
        </div>
      </div>

      <ReeveNowFooter />
    </div>
  )
}
