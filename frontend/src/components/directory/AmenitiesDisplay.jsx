const AMENITY_MAP = {
  wifi: { label: 'Free Wi-Fi', icon: 'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zM9 17l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zM5 13l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z' },
  wheelchair_accessible: { label: 'Wheelchair accessible', icon: 'M12 2a2 2 0 100 4 2 2 0 000-4zm-2 7v6l-3.35 3.35a1 1 0 001.41 1.42L12 16l4 4h3v-2h-2.17l-3.46-3.46A3 3 0 0010 12V9z' },
  card_payments: { label: 'Card payments', icon: 'M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z' },
  child_friendly: { label: 'Child friendly', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
  parking_nearby: { label: 'Parking nearby', icon: 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z' },
  outdoor_seating: { label: 'Outdoor seating', icon: 'M2 21h20v-2H2v2zM20 8h-2V5h-2v3H8V5H6v3H4c-1.1 0-2 .9-2 2v5h20v-5c0-1.1-.9-2-2-2z' },
  byob: { label: 'BYOB welcome', icon: 'M7.5 7l-2-2h13l-2 2h-9zM6 21.5l1-4.5h10l1 4.5H6zM17 8H7l1 8h8l1-8z' },
  walk_ins_welcome: { label: 'Walk-ins welcome', icon: 'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z' },
  instant_confirmation: { label: 'Instant confirmation', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' },
  consultation_required: { label: 'Consultation required', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z' },
  aftercare_provided: { label: 'Aftercare instructions', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z' },
  loyalty_programme: { label: 'Loyalty programme', icon: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z' },
  gift_cards: { label: 'Gift cards available', icon: 'M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z' },
  memberships: { label: 'Memberships available', icon: 'M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z' },
  halal: { label: 'Halal', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
  vegan_options: { label: 'Vegan options', icon: 'M17.21 9l-4.38-6.56c-.19-.28-.51-.42-.83-.42-.32 0-.64.14-.83.43L6.79 9C4.6 9 3 10.6 3 12.79V18c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3v-5.21C21 10.6 19.4 9 17.21 9z' },
  takeaway: { label: 'Takeaway', icon: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z' },
  delivery: { label: 'Delivery available', icon: 'M19.15 8a2 2 0 00-1.72-1H15V5a1 1 0 00-1-1H4a2 2 0 00-2 2v9.5A2.5 2.5 0 004.5 18a2.5 2.5 0 002.45-2h6.1a2.5 2.5 0 002.45 2 2.5 2.5 0 002.45-2H20a1 1 0 001-1v-3.5l-1.85-3.5zM4.5 17a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm10-7h3.15l1.42 2.68H14.5V10zm1 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z' },
  laptop_friendly: { label: 'Laptop friendly', icon: 'M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z' },
  patch_test_required: { label: 'Patch test required', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM12 6c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6z' },
  couples_treatments: { label: 'Couples treatments', icon: 'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z' },
}

const AmenitiesDisplay = ({ amenities = [], compact = false }) => {
  if (!amenities.length) return null
  const items = amenities.map(a => AMENITY_MAP[a]).filter(Boolean)
  if (!items.length) return null

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: compact ? 6 : 10 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: compact ? '4px 10px' : '6px 12px',
          background: '#F5F5F3', borderRadius: 99,
          fontSize: compact ? 11 : 12, color: '#374151', fontWeight: 500,
        }}>
          <svg width={compact ? 12 : 14} height={compact ? 12 : 14} viewBox="0 0 24 24" fill="#6B7280"><path d={item.icon}/></svg>
          {item.label}
        </div>
      ))}
    </div>
  )
}
export default AmenitiesDisplay
