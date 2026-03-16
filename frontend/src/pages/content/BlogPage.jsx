/**
 * BlogPage — /blog on reevenow.com
 * Pulls published articles from the reeveos_cms (site=reevenow)
 * via the FastAPI blog renderer endpoint
 */
import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/directory/Navbar'
import ReeveNowFooter from '../../components/directory/ReeveNowFooter'

const API = import.meta.env.VITE_API_URL || 'https://api.reevenow.com'
const INDIGO = '#1A2744'
const AMBER = '#FFB627'
const f = "'Figtree',-apple-system,sans-serif"

const CATEGORIES = [
  { slug: 'city-guides',    name: 'City Guides' },
  { slug: 'experiences',    name: 'Experiences' },
  { slug: 'best-of',        name: 'Best Of' },
  { slug: 'date-night',     name: 'Date Night' },
  { slug: 'occasions',      name: 'Special Occasions' },
  { slug: 'food-drink',     name: 'Food & Drink' },
  { slug: 'beauty-wellness',name: 'Beauty & Wellness' },
  { slug: 'independent',    name: 'Why Independent' },
  { slug: 'booking-guides', name: 'Booking Guides' },
]

function PostCard({ post }) {
  const catName = CATEGORIES.find(c => c.slug === post.category_slug)?.name || ''
  const pubDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
  return (
    <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', border: '1px solid #e8e8e8', borderRadius: 16, overflow: 'hidden', background: 'white', transition: 'box-shadow 0.2s, transform 0.2s', fontFamily: f }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {post.featuredImageUrl && (
        <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
          <img src={post.featuredImageUrl} alt={post.featuredImageAlt || post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
        </div>
      )}
      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          {catName && <span style={{ fontSize: 10, fontWeight: 700, color: AMBER, background: `${AMBER}18`, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{catName}</span>}
          {pubDate && <span style={{ fontSize: 11, color: '#999' }}>{pubDate}</span>}
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: INDIGO, lineHeight: 1.35, marginBottom: 8 }}>{post.title}</h3>
        <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, flex: 1 }}>{(post.excerpt || '').substring(0, 110)}{post.excerpt?.length > 110 ? '…' : ''}</p>
        <div style={{ marginTop: 12, fontSize: 12, color: AMBER, fontWeight: 700 }}>{post.readTime ? `${post.readTime} min read →` : 'Read more →'}</div>
      </div>
    </Link>
  )
}

export default function BlogPage() {
  const [params] = useSearchParams()
  const catFilter = params.get('category') || ''
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch from CMS via FastAPI blog API
    const url = `${API}/api/content/posts?site=reevenow&status=published${catFilter ? `&category=${catFilter}` : ''}&limit=24`
    fetch(url)
      .then(r => r.ok ? r.json() : { posts: [] })
      .then(d => setPosts(d.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [catFilter])

  return (
    <div style={{ fontFamily: f, background: '#ffffff', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: INDIGO, padding: '48px 24px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: -0.5 }}>
          Discover. Book. <span style={{ color: AMBER }}>Remember.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 17, maxWidth: 560, margin: '0 auto' }}>
          City guides, experience ideas, date nights, and honest reviews from the UK's independent high street.
        </p>
      </div>

      {/* Category bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #eee', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 0, maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
          <Link to="/blog" style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: !catFilter ? AMBER : '#888', borderBottom: `3px solid ${!catFilter ? AMBER : 'transparent'}`, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.2s' }}>All</Link>
          {CATEGORIES.map(c => (
            <Link key={c.slug} to={`/blog?category=${c.slug}`} style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: catFilter === c.slug ? AMBER : '#888', borderBottom: `3px solid ${catFilter === c.slug ? AMBER : 'transparent'}`, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.2s' }}>
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>Loading…</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 18, color: '#555', marginBottom: 8 }}>No articles yet in this category.</div>
            <Link to="/blog" style={{ color: AMBER, fontWeight: 700, fontSize: 14 }}>View all articles</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {posts.map(post => <PostCard key={post._id} post={post} />)}
          </div>
        )}
      </div>

      <ReeveNowFooter />
    </div>
  )
}
