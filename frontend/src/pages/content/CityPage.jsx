/**
 * CityPage — /city/[city] on reevenow.com
 * SEO city hub — like TripAdvisor's city pages
 * Shows categories, top businesses, blog guides, experiences
 */
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/directory/Navbar'
import ReeveNowFooter from '../../components/directory/ReeveNowFooter'

const API = import.meta.env.VITE_API_URL || 'https://api.reevenow.com'
const INDIGO = '#111111'
const AMBER = '#C9A84C'
const f = "'Figtree',-apple-system,sans-serif"

const CITY_DATA = {
  sheffield: {
    name: 'Sheffield',
    tagline: 'The Steel City\'s independent high street',
    description: 'Sheffield has one of the best independent business scenes in the North. From Kelham Island\'s restaurants to the city centre\'s barbershops — discover and book directly.',
    hero: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&h=600&fit=crop',
    highlights: ['Kelham Island dining', 'Turkish restaurants', 'Independent barbershops', 'Aesthetics clinics'],
    blogSlugs: [
      { slug: 'best-restaurants-sheffield-2026', title: 'Best independent restaurants in Sheffield', cat: 'City Guide' },
      { slug: 'date-night-sheffield-independent-restaurants', title: 'Date night in Sheffield', cat: 'Date Night' },
      { slug: 'bottomless-brunch-sheffield-guide', title: 'Bottomless brunch Sheffield guide', cat: 'Experiences' },
      { slug: 'hen-do-sheffield-ideas-2026', title: 'Hen do ideas in Sheffield', cat: 'Occasions' },
      { slug: 'turkish-food-sheffield-guide', title: 'Turkish food in Sheffield', cat: 'Food & Drink' },
    ],
  },
  nottingham: {
    name: 'Nottingham',
    tagline: 'Hockley, the Lace Market, and beyond',
    description: 'Nottingham\'s Hockley and Lace Market areas have some of the best independent restaurants and experiences in the Midlands. Skip the chains and discover what locals actually love.',
    hero: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&h=600&fit=crop',
    highlights: ['Hockley independent dining', 'Lace Market experiences', 'Independent gyms', 'Burger culture'],
    blogSlugs: [
      { slug: 'best-restaurants-nottingham-2026', title: 'Best independent restaurants in Nottingham', cat: 'City Guide' },
      { slug: 'first-date-ideas-nottingham', title: 'First date ideas in Nottingham', cat: 'Date Night' },
      { slug: 'private-dining-nottingham-special-occasions', title: 'Private dining for special occasions', cat: 'Experiences' },
      { slug: 'best-gyms-nottingham-2026', title: 'Best independent gyms in Nottingham', cat: 'Best Of' },
    ],
  },
  cardiff: {
    name: 'Cardiff',
    tagline: 'Pontcanna, Canton, and the Vale of Glamorgan',
    description: 'Cardiff\'s independent business scene stretches from Pontcanna\'s neighbourhood restaurants to the Vale of Glamorgan\'s aesthetics clinics. Discover South Wales\' best.',
    hero: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1400&h=600&fit=crop',
    highlights: ['Pontcanna restaurants', 'Vale of Glamorgan aesthetics', 'Canton dining', 'Independent salons'],
    blogSlugs: [
      { slug: 'best-things-to-do-cardiff-2026', title: 'Best independent restaurants in Cardiff', cat: 'City Guide' },
      { slug: 'spa-day-near-cardiff-independent', title: 'Spa days near Cardiff', cat: 'Experiences' },
      { slug: 'best-salons-cardiff-2026', title: 'Best salons in Cardiff and South Wales', cat: 'Best Of' },
    ],
  },
}

const CATEGORIES = [
  { id: 'restaurant', label: 'Restaurants', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop' },
  { id: 'salon', label: 'Hair Salons', img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=200&fit=crop' },
  { id: 'barber', label: 'Barbers', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=200&fit=crop' },
  { id: 'aesthetics', label: 'Aesthetics', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&h=200&fit=crop' },
  { id: 'gym', label: 'Gyms', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop' },
  { id: 'spa', label: 'Spas', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop' },
]

export default function CityPage() {
  const { city } = useParams()
  const navigate = useNavigate()
  const cityKey = city?.toLowerCase()
  const data = CITY_DATA[cityKey]
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cityKey) return
    fetch(`${API}/api/directory/businesses?city=${cityKey}&limit=6&status=active`)
      .then(r => r.ok ? r.json() : { businesses: [] })
      .then(d => setBusinesses(d.businesses || d.results || []))
      .catch(() => setBusinesses([]))
      .finally(() => setLoading(false))
  }, [cityKey])

  if (!data) {
    return (
      <div style={{ fontFamily: f }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: INDIGO, marginBottom: 12 }}>City not found</h1>
          <p style={{ color: '#888', marginBottom: 24 }}>We don't have a guide for {city} yet — but we're growing.</p>
          <Link to="/search" style={{ color: AMBER, fontWeight: 700 }}>Search all businesses →</Link>
        </div>
        <ReeveNowFooter />
      </div>
    )
  }

  return (
    <div style={{ fontFamily: f, background: '#ffffff', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
        <img src={data.hero} alt={data.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,39,68,0.92) 0%, rgba(26,39,68,0.5) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', padding: '0 clamp(16px,5vw,80px)', maxWidth: 600 }}>
          <div style={{ fontSize: 12, color: AMBER, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Independent businesses</div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: -1, lineHeight: 1.1 }}>{data.name}</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', marginBottom: 20, lineHeight: 1.5 }}>{data.tagline}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {data.highlights.map(h => (
              <span key={h} style={{ background: 'rgba(255,182,39,0.15)', color: AMBER, fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(255,182,39,0.3)' }}>{h}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 16px' }}>

        {/* Quick search in this city */}
        <div style={{ background: 'white', borderRadius: 16, padding: '24px', marginBottom: 40, border: '1px solid #eee', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: INDIGO, marginBottom: 4 }}>Find businesses in {data.name}</div>
            <div style={{ fontSize: 13, color: '#888' }}>Search {data.name}'s independent restaurants, salons, and more</div>
          </div>
          <button onClick={() => navigate(`/search?city=${cityKey}`)}
            style={{ background: AMBER, color: INDIGO, padding: '12px 28px', borderRadius: 50, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: f, whiteSpace: 'nowrap' }}>
            Search {data.name}
          </button>
        </div>

        {/* Browse by category */}
        <h2 style={{ fontSize: 22, fontWeight: 800, color: INDIGO, marginBottom: 20 }}>Browse by category in {data.name}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 48 }}>
          {CATEGORIES.map(cat => (
            <Link key={cat.id} to={`/search?city=${cityKey}&category=${cat.id}`} style={{ textDecoration: 'none', borderRadius: 12, overflow: 'hidden', position: 'relative', aspectRatio: '4/3', display: 'block' }}>
              <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,39,68,0.85) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 13, fontWeight: 800, color: 'white' }}>{cat.label}</div>
            </Link>
          ))}
        </div>

        {/* About this city */}
        <div style={{ background: 'white', borderRadius: 16, padding: '28px', marginBottom: 48, border: '1px solid #eee' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: INDIGO, marginBottom: 10 }}>About {data.name}'s independent scene</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>{data.description}</p>
        </div>

        {/* City guides from the blog */}
        <h2 style={{ fontSize: 22, fontWeight: 800, color: INDIGO, marginBottom: 8 }}>{data.name} guides</h2>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>Local knowledge, not tourist traps.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 48 }}>
          {data.blogSlugs.map(guide => (
            <Link key={guide.slug} to={`/blog/${guide.slug}`} style={{ textDecoration: 'none', background: 'white', borderRadius: 14, padding: '20px', border: '1px solid #eee', display: 'block',
              transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: AMBER, textTransform: 'uppercase', letterSpacing: '0.4px', background: `${AMBER}18`, padding: '2px 8px', borderRadius: 20 }}>{guide.cat}</span>
              <div style={{ fontSize: 15, fontWeight: 700, color: INDIGO, marginTop: 10, lineHeight: 1.35 }}>{guide.title}</div>
              <div style={{ fontSize: 12, color: AMBER, fontWeight: 700, marginTop: 10 }}>Read guide →</div>
            </Link>
          ))}
        </div>
      </div>

      <ReeveNowFooter />
    </div>
  )
}
