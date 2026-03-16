import { Link } from 'react-router-dom'

const $ = { h: '#111', m: '#6B7280', l: '#9CA3AF', acc: '#C9A84C', f: "'Figtree',sans-serif" }

const FooterLink = ({ to, children }) => (
  <Link to={to} style={{ color: $.l, textDecoration: 'none', fontSize: 13, display: 'block', marginBottom: 8, transition: 'color 0.2s' }}
    onMouseEnter={e => e.target.style.color = $.acc} onMouseLeave={e => e.target.style.color = $.l}>
    {children}
  </Link>
)
const ExtLink = ({ href, children }) => (
  <a href={href} style={{ color: $.l, textDecoration: 'none', fontSize: 13, display: 'block', marginBottom: 8, transition: 'color 0.2s' }}
    onMouseEnter={e => e.target.style.color = $.acc} onMouseLeave={e => e.target.style.color = $.l} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
)

const DirectoryFooter = () => (
  <footer style={{ background: '#111', padding: '48px 24px 24px', fontFamily: $.f }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginBottom: 40 }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: $.acc, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#111' }}>R.</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Reeve</span>
          </div>
          <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, maxWidth: 200 }}>
            Book & reserve locally. Zero commission booking for UK high street businesses.
          </p>
        </div>

        {/* Discover */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: $.acc, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Discover</h4>
          <FooterLink to="/search?category=restaurant">Restaurants</FooterLink>
          <FooterLink to="/search?category=salon">Hair Salons</FooterLink>
          <FooterLink to="/search?category=barber">Barbers</FooterLink>
          <FooterLink to="/search?category=aesthetics">Aesthetics</FooterLink>
          <FooterLink to="/search?category=spa">Spas</FooterLink>
          <FooterLink to="/search?category=nails">Nails</FooterLink>
          <FooterLink to="/search">Browse All</FooterLink>
        </div>

        {/* Features */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: $.acc, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Features</h4>
          <FooterLink to="/live">Live Availability</FooterLink>
          <ExtLink href="https://reeveos.app/features/bookings.html">Smart Booking</ExtLink>
          <ExtLink href="https://reeveos.app/features/epos.html">EPOS</ExtLink>
          <ExtLink href="https://reeveos.app/features/crm.html">CRM</ExtLink>
          <ExtLink href="https://reeveos.app/features/payments.html">Payments</ExtLink>
        </div>

        {/* For Business */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: $.acc, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>For Business</h4>
          <ExtLink href="https://portal.rezvo.app/register">List Your Business</ExtLink>
          <ExtLink href="https://reeveos.app/industries/">Industries</ExtLink>
          <ExtLink href="https://reeveos.app#pricing">Pricing</ExtLink>
          <ExtLink href="https://portal.rezvo.app/login">Partner Login</ExtLink>
        </div>

        {/* Company */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: $.acc, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Company</h4>
          <ExtLink href="https://reeveos.app/about.html">About</ExtLink>
          <FooterLink to="/faqs">FAQs</FooterLink>
          <ExtLink href="https://reeveos.app/contact.html">Contact</ExtLink>
          <ExtLink href="https://reeveos.app/privacy.html">Privacy Policy</ExtLink>
          <ExtLink href="https://reeveos.app/terms.html">Terms of Service</ExtLink>
          <ExtLink href="https://reeveos.app/cookies.html">Cookie Policy</ExtLink>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #222', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 12, color: '#4B5563' }}>
          &copy; {new Date().getFullYear()} Reeve Ltd. All rights reserved. Powered by <a href="https://reeveos.app" style={{ color: $.acc, textDecoration: 'none' }}>ReeveOS</a>
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          {/* Social icons - monochrome SVGs */}
          {[
            { label: 'Instagram', path: 'M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5A4.25 4.25 0 0020.5 16.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm5.25-2.5a1 1 0 110 2 1 1 0 010-2z' },
            { label: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
            { label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z' },
          ].map(s => (
            <a key={s.label} href="#" style={{ width: 32, height: 32, borderRadius: 99, border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = $.acc; e.currentTarget.querySelector('svg').style.fill = $.acc }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.querySelector('svg').style.fill = '#6B7280' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#6B7280" style={{ transition: 'fill 0.2s' }}><path d={s.path}/></svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
)

export default DirectoryFooter
