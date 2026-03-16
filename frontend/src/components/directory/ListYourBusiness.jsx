const ListYourBusiness = () => (
  <div style={{
    background: '#111', borderRadius: 20, padding: '48px 32px', textAlign: 'center',
    position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: 99, background: 'rgba(201,168,76,0.06)' }} />
    <div style={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, borderRadius: 99, background: 'rgba(201,168,76,0.04)' }} />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: -0.5 }}>
        Own a business on the high street?
      </h2>
      <p style={{ fontSize: 15, color: '#9CA3AF', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
        Join Reeve and get bookings, EPOS, CRM and payments — zero commission, from £0/month.
      </p>
      <a href="https://reeveos.app/register" className="pill pill-gold pill-lg" style={{ textDecoration: 'none' }}>
        List your business — it's free
      </a>
    </div>
  </div>
)
export default ListYourBusiness
