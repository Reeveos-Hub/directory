import { Link } from 'react-router-dom'

const S = { nav: { padding: '12px 0', fontSize: 13, color: '#6B7280', fontFamily: "'Figtree',sans-serif" },
  sep: { margin: '0 6px', color: '#D1D5DB' },
  link: { color: '#6B7280', textDecoration: 'none', transition: 'color 0.2s' },
  current: { color: '#111', fontWeight: 600 } }

const Breadcrumbs = ({ items = [] }) => (
  <nav style={S.nav} aria-label="Breadcrumb">
    {items.map((item, i) => (
      <span key={i}>
        {i > 0 && <span style={S.sep}>›</span>}
        {i === items.length - 1
          ? <span style={S.current}>{item.label}</span>
          : <Link to={item.path} style={S.link} onMouseEnter={e => e.target.style.color = '#C9A84C'} onMouseLeave={e => e.target.style.color = '#6B7280'}>{item.label}</Link>
        }
      </span>
    ))}
  </nav>
)
export default Breadcrumbs
