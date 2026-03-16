/**
 * BlogArticlePage — /blog/:slug on reevenow.com
 * Fetches article from CMS via API and renders it
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/directory/Navbar'
import ReeveNowFooter from '../../components/directory/ReeveNowFooter'

const API = import.meta.env.VITE_API_URL || 'https://api.reevenow.com'
const INDIGO = '#111111'
const AMBER = '#C9A84C'
const f = "'Figtree',-apple-system,sans-serif"

function renderMarkdown(md) {
  if (!md) return ''
  // Simple markdown → HTML (headings, bold, lists, paragraphs)
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>(\n|$))+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul])(.+)$/gm, (line) => line.trim() ? `<p>${line}</p>` : '')
    .replace(/<p><\/p>/g, '')
}

export default function BlogArticlePage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/content/posts/${slug}?site=reevenow`)
      .then(r => { if (!r.ok) { setNotFound(true); return null } return r.json() })
      .then(d => { if (d) setPost(d.post || d) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div style={{ fontFamily: f }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '80px 24px', color: '#999' }}>Loading…</div>
        <ReeveNowFooter />
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div style={{ fontFamily: f }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: INDIGO, marginBottom: 12 }}>Article not found</h1>
          <Link to="/blog" style={{ color: AMBER, fontWeight: 700 }}>← Back to the blog</Link>
        </div>
        <ReeveNowFooter />
      </div>
    )
  }

  const pubDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
  const htmlContent = renderMarkdown(post.content || '')
  const faqItems = post.schema?.faqItems || []

  return (
    <div style={{ fontFamily: f, background: '#ffffff', minHeight: '100vh' }}>
      <Navbar />

      {/* Breadcrumbs */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '16px 24px 0', display: 'flex', gap: 8, fontSize: 13, color: '#999' }}>
        <Link to="/" style={{ color: '#999', textDecoration: 'none' }}>Home</Link>
        <span>›</span>
        <Link to="/blog" style={{ color: '#999', textDecoration: 'none' }}>Blog</Link>
        <span>›</span>
        <span style={{ color: '#555' }}>{post.title?.substring(0, 50)}…</span>
      </div>

      {/* Article hero */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          {post.category_slug && (
            <Link to={`/blog?category=${post.category_slug}`} style={{ fontSize: 11, fontWeight: 700, color: AMBER, background: `${AMBER}18`, padding: '3px 10px', borderRadius: 20, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              {post.category_name || post.category_slug}
            </Link>
          )}
          {pubDate && <span style={{ fontSize: 13, color: '#999' }}>{pubDate}</span>}
          {post.readTime && <span style={{ fontSize: 13, color: '#999' }}>{post.readTime} min read</span>}
        </div>

        <h1 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: INDIGO, lineHeight: 1.2, marginBottom: 16, letterSpacing: -0.5 }}>{post.title}</h1>
        <p style={{ fontSize: 18, color: '#666', lineHeight: 1.6, marginBottom: 28 }}>{post.excerpt}</p>

        {post.featuredImageUrl && (
          <figure style={{ margin: '0 0 32px', borderRadius: 16, overflow: 'hidden', aspectRatio: '16/7' }}>
            <img src={post.featuredImageUrl} alt={post.featuredImageAlt || post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            {post.featuredImageCaption && <figcaption style={{ padding: '8px 0', fontSize: 12, color: '#999', textAlign: 'center', fontStyle: 'italic' }}>{post.featuredImageCaption}</figcaption>}
          </figure>
        )}
      </div>

      {/* Article body + sidebar */}
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 48, alignItems: 'start' }}>

        <main>
          <div
            style={{ fontSize: 17, lineHeight: 1.8, color: '#333' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* FAQ */}
          {faqItems.length > 0 && (
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: `3px solid ${AMBER}` }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: INDIGO, marginBottom: 24 }}>Frequently asked questions</h2>
              {faqItems.map((item, i) => (
                <details key={i} style={{ marginBottom: 12, border: '1px solid #e8e8e8', borderRadius: 12 }}>
                  <summary style={{ padding: '16px 18px', fontWeight: 700, fontSize: 16, color: INDIGO, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                    {item.question} <span>+</span>
                  </summary>
                  <div style={{ padding: '0 18px 16px', fontSize: 15, color: '#555', lineHeight: 1.7 }}>{item.answer}</div>
                </details>
              ))}
            </div>
          )}

          {/* CTA */}
          <div style={{ marginTop: 40, background: INDIGO, borderRadius: 16, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>Find and book near you</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Discover independent businesses in your city — book direct, no commission.</div>
            </div>
            <Link to="/search" style={{ background: AMBER, color: INDIGO, padding: '12px 24px', borderRadius: 50, fontWeight: 800, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>Search now</Link>
          </div>

          {/* Author */}
          <div style={{ marginTop: 32, background: '#f8f8f8', borderRadius: 14, padding: '20px', display: 'flex', gap: 14, alignItems: 'flex-start', border: '1px solid #e8e8e8' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: INDIGO, color: AMBER, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
              {(post.eeat?.authorName || 'R')[0]}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: INDIGO }}>{post.eeat?.authorName || 'Reeve Now Team'}</div>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>{post.eeat?.authorTitle || ''}</div>
              {post.eeat?.lastUpdatedNote && <div style={{ fontSize: 11, color: '#aaa' }}>{post.eeat.lastUpdatedNote}</div>}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 80 }}>
          <div style={{ background: INDIGO, borderRadius: 16, padding: '24px', marginBottom: 20 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 8 }}>Book an independent business</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 18 }}>Search independent restaurants, salons, barbers, and more near you.</p>
            <Link to="/search" style={{ display: 'block', background: AMBER, color: INDIGO, padding: '11px', borderRadius: 50, fontWeight: 800, textAlign: 'center', textDecoration: 'none', fontSize: 14 }}>Find businesses →</Link>
          </div>

          <div style={{ background: 'white', borderRadius: 14, padding: '18px', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: INDIGO, marginBottom: 14 }}>More from the blog</h3>
            {[
              { slug: 'date-night-sheffield-independent-restaurants', title: 'Date night in Sheffield' },
              { slug: 'bottomless-brunch-sheffield-guide', title: 'Bottomless brunch Sheffield' },
              { slug: 'spa-day-near-cardiff-independent', title: 'Spa days near Cardiff' },
              { slug: 'why-book-independent-not-chain', title: 'Why book independent?' },
            ].filter(l => l.slug !== slug).slice(0, 3).map(link => (
              <Link key={link.slug} to={`/blog/${link.slug}`} style={{ display: 'block', fontSize: 13, color: '#555', textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}
                onMouseEnter={e => e.currentTarget.style.color = AMBER}
                onMouseLeave={e => e.currentTarget.style.color = '#555'}
              >{link.title}</Link>
            ))}
          </div>
        </aside>
      </div>

      <style>{`
        main h2 { font-size: 26px; font-weight: 800; color: ${INDIGO}; margin: 36px 0 14px; padding-bottom: 10px; border-bottom: 3px solid ${AMBER}; }
        main h3 { font-size: 20px; font-weight: 700; color: #333; margin: 28px 0 10px; }
        main p { margin-bottom: 16px; }
        main ul { margin: 0 0 16px 24px; }
        main li { margin-bottom: 6px; }
        main table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px; border-radius: 10px; overflow: hidden; }
        main th { background: ${INDIGO}; color: white; padding: 10px 14px; text-align: left; font-size: 13px; }
        main td { padding: 10px 14px; border-bottom: 1px solid #eee; }
        main tr:nth-child(even) td { background: #f9f9f7; }
        main strong { font-weight: 700; }
        @media (max-width: 860px) { .article-grid { grid-template-columns: 1fr !important; } aside { display: none; } }
      `}</style>

      <ReeveNowFooter />
    </div>
  )
}
