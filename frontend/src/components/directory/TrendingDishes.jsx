import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTrendingDishes } from '../../utils/directoryApi'

const DishCard = ({ dish }) => (
  <Link to={`/${dish.business_slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div style={{
      background: '#111', borderRadius: 12, padding: 16, minWidth: 200,
      transition: 'all 0.3s', cursor: 'pointer', position: 'relative',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)' }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{dish.name}</div>
      <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 8 }}>{dish.business_name}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#C9A84C' }}>£{dish.price?.toFixed(2)}</span>
        {dish.calories && <span style={{ fontSize: 11, color: '#6B7280' }}>{dish.calories} kcal</span>}
      </div>
      {dish.order_count > 50 && (
        <span className="badge-pill badge-pill-gold" style={{ position: 'absolute', top: 10, right: 10, fontSize: 10 }}>
          Ordered {dish.order_count}x
        </span>
      )}
    </div>
  </Link>
)

const TrendingDishes = ({ city }) => {
  const [dishes, setDishes] = useState([])
  useEffect(() => {
    getTrendingDishes({ city }).then(d => setDishes(d.dishes || [])).catch(() => {})
  }, [city])
  if (!dishes.length) return null

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 40, height: 3, background: '#C9A84C', borderRadius: 2 }} />
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: 0 }}>
          Trending {city ? `in ${city}` : 'dishes'}
        </h2>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
        {dishes.map(d => <DishCard key={d.id} dish={d} />)}
      </div>
    </div>
  )
}
export default TrendingDishes
