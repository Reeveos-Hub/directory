/**
 * Reeve Consumer Directory API
 * Connects to portal.rezvo.app/api/directory/*
 * All endpoints for the consumer directory at reevenow.com
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://portal.rezvo.app/api'

async function _get(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
  })
  const r = await fetch(url.toString())
  if (!r.ok) {
    const err = await r.json().catch(() => ({}))
    throw new Error(err.detail || `Request failed: ${r.status}`)
  }
  return r.json()
}

async function _post(path, body = {}) {
  const r = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) {
    const err = await r.json().catch(() => ({}))
    throw new Error(err.detail || `Request failed: ${r.status}`)
  }
  return r.json()
}

// ═══ SEARCH ═══

export async function searchBusinesses(params = {}) {
  return _get('/directory/search', params)
}

export async function searchWithAvailability(params = {}) {
  return _get('/directory/search-with-availability', params)
}

// ═══ HOMEPAGE ═══

export async function getHomePage() {
  return _get('/directory/home')
}

export async function getPlatformStats() {
  return _get('/directory/stats')
}

// ═══ LISTINGS / PROFILES ═══

export async function getListing(slug) {
  return _get(`/directory/listings/${slug}`)
}

export async function getListingReviews(slug, params = {}) {
  return _get(`/directory/listings/${slug}/reviews`, params)
}

export async function getListingMenu(slug) {
  return _get(`/directory/listings/${slug}/menu`)
}

// ═══ CATEGORIES ═══

export async function getCategoryBusinesses(category, params = {}) {
  return _get(`/directory/categories/${category}`, params)
}

export async function getCategoryCity(category, city, params = {}) {
  return _get(`/directory/categories/${category}/${city}`, params)
}

export async function getFeatured(params = {}) {
  return _get('/directory/featured', params)
}

// ═══ LIVE FEED (THE KILLER) ═══

export async function getLiveFeed(params = {}) {
  return _get('/directory/feed/live', params)
}

export async function subscribeToFeed(payload) {
  return _post('/directory/feed/subscribe', payload)
}

// ═══ REVIEWS ═══

export async function submitReview(slug, payload) {
  return _post(`/directory/reviews/${slug}`, payload)
}

// ═══ TRENDING ═══

export async function getTrendingDishes(params = {}) {
  return _get('/directory/trending-dishes', params)
}

// ═══ WARM LEADS ═══

export async function notifyBusiness(businessId) {
  return _post(`/directory/notify/${businessId}`)
}

// ═══ LOCATIONS ═══

export async function getLocations() {
  return _get('/directory/locations')
}

// ═══ BOOKING (re-exports from bookingApi for convenience) ═══

export async function getBookingPage(slug) {
  return _get(`/book/${slug}`)
}

export async function getAvailability(slug, params = {}) {
  return _get(`/book/${slug}/availability`, params)
}

export async function getAvailableDates(slug, params = {}) {
  return _get(`/book/${slug}/dates`, params)
}

export async function createBooking(slug, payload) {
  return _post(`/book/${slug}/create`, payload)
}

export async function getBooking(slug, bookingId) {
  return _get(`/book/${slug}/booking/${bookingId}`)
}

export async function cancelBooking(slug, bookingId, email) {
  const r = await fetch(`${API_BASE}/book/${slug}/booking/${bookingId}?email=${encodeURIComponent(email)}`, { method: 'DELETE' })
  if (!r.ok) throw new Error('Cancellation failed')
  return r.json()
}
