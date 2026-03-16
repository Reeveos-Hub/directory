import { useState } from 'react'

const ShareFavourite = ({ name, slug }) => {
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = `https://reevenow.com/${slug}`
    if (navigator.share) {
      try { await navigator.share({ title: name, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSave = () => {
    setSaved(!saved)
    const favs = JSON.parse(localStorage.getItem('reeve_favourites') || '[]')
    if (!saved) { favs.push(slug); localStorage.setItem('reeve_favourites', JSON.stringify([...new Set(favs)])) }
    else { localStorage.setItem('reeve_favourites', JSON.stringify(favs.filter(f => f !== slug))) }
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={handleShare} style={{
        width: 40, height: 40, borderRadius: 99, border: '1.5px solid #E5E7EB',
        background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }} title={copied ? 'Link copied!' : 'Share'}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={copied ? '#22C55E' : '#6B7280'} strokeWidth="2" strokeLinecap="round">
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
        </svg>
      </button>
      <button onClick={handleSave} style={{
        width: 40, height: 40, borderRadius: 99, border: '1.5px solid #E5E7EB',
        background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }} title={saved ? 'Saved' : 'Save'}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? '#C9A84C' : 'none'} stroke={saved ? '#C9A84C' : '#6B7280'} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </button>
    </div>
  )
}
export default ShareFavourite
