/**
 * SEOFooter — Fresha/Booksy-style location + treatment link grids
 * Generates internal links for every category × city combo
 * Critical for Google organic ranking
 * Monochrome SVG icons only. Zero emojis.
 */
import { Link } from 'react-router-dom'

const $ = {
  h: '#111111', acc: '#C9A84C', m: '#6B7280', l: '#9CA3AF',
  bdr: '#E5E7EB', f: "'Figtree',-apple-system,sans-serif",
}

const CITIES = [
  'Sheffield', 'Nottingham', 'Cardiff', 'Barry', 'Leicester', 'Derby',
  'Birmingham', 'Manchester', 'Leeds', 'Liverpool', 'Bristol', 'London',
  'Edinburgh', 'Glasgow', 'Newcastle', 'Coventry', 'Wolverhampton',
  'Stoke-on-Trent', 'Bradford', 'Hull',
]

const TREATMENTS = {
  'Hair & Beauty': [
    'Haircuts', 'Hair Colouring', 'Blow Dries', 'Hair Extensions',
    'Hair Styling', 'Balayage', 'Highlights', 'Keratin Treatment',
  ],
  'Barbers': [
    'Mens Haircut', 'Beard Trim', 'Hot Towel Shave', 'Skin Fade',
    'Hair & Beard Combo', 'Turkish Barber',
  ],
  'Aesthetics': [
    'Microneedling', 'Chemical Peels', 'Dermaplaning', 'RF Needling',
    'Polynucleotides', 'Lip Fillers', 'Anti-Wrinkle', 'Mesotherapy',
  ],
  'Nails': [
    'Gel Manicure', 'Gel Pedicure', 'Acrylic Nails', 'Nail Art',
    'Shellac Nails', 'Nail Extensions',
  ],
  'Wellness': [
    'Massage', 'Facial', 'Body Wrap', 'Reflexology',
    'Aromatherapy', 'Hot Stone Massage',
  ],
}

const CATEGORIES = [
  { slug: 'salon', label: 'Hair Salons' },
  { slug: 'barber', label: 'Barbers' },
  { slug: 'aesthetics', label: 'Aesthetics' },
  { slug: 'spa', label: 'Spas' },
  { slug: 'nails', label: 'Nail Salons' },
  { slug: 'restaurant', label: 'Restaurants' },
  { slug: 'cafe', label: 'Cafés' },
]

const SEOFooter = ({ currentCity, currentCategory }) => {
  return (
    <div style={{ fontFamily: $.f, borderTop: `1px solid ${$.bdr}`, background: '#FAFAFA' }}>
      {/* Treatment type links (like Fresha's "Treat yourself anytime, anywhere") */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 32px' }}>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: $.h, marginBottom: 24 }}>
          Treat yourself anytime, anywhere
        </h3>
        
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          <button className="pill-filter active" style={{ fontSize: 13 }}>
            Popular treatments
          </button>
          <button className="pill-filter" style={{ fontSize: 13 }}>
            Nearby locations
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
          {Object.entries(TREATMENTS).map(([group, items]) => (
            items.map(treatment => (
              <Link key={treatment} to={`/search?q=${encodeURIComponent(treatment)}`}
                style={{ fontSize: 13, color: $.m, textDecoration: 'none', padding: '4px 0', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = $.acc}
                onMouseLeave={e => e.target.style.color = $.m}>
                {treatment}
              </Link>
            ))
          ))}
        </div>
      </div>

      {/* Browse by location (like Fresha's "Browse Locations in Nottingham") */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 40px' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: $.h, marginBottom: 16 }}>
          Browse locations {currentCity ? `near ${currentCity}` : 'across the UK'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 6 }}>
          {CATEGORIES.map(cat => (
            CITIES.slice(0, 10).map(city => (
              <Link key={`${cat.slug}-${city}`}
                to={`/categories/${cat.slug}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                style={{ fontSize: 13, color: $.m, textDecoration: 'none', padding: '3px 0', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = $.acc}
                onMouseLeave={e => e.target.style.color = $.m}>
                {cat.label} in {city}
              </Link>
            ))
          ))}
        </div>
      </div>

      {/* Nearby locations (like Booksy's neighbourhood links) */}
      {currentCity && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 40px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: $.h, marginBottom: 16 }}>
            Nearby locations
          </h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {CITIES.filter(c => c !== currentCity).slice(0, 12).map(city => (
              <Link key={city} to={`/search?city=${city}`} style={{
                fontSize: 13, color: $.acc, textDecoration: 'none', fontWeight: 600,
              }}>
                {city}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
export default SEOFooter
