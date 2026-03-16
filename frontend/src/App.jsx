/**
 * Reeve Consumer Directory — reevenow.com
 * Complete consumer-facing app: search, discover, book local businesses
 * Cross-vertical: salons, barbers, restaurants, aesthetics, spas, nails, cafes
 * 
 * KILLER FEATURE: /live — real-time cancellation marketplace
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import ChatWidget from './components/ChatWidget'
import BottomNav from './components/directory/BottomNav'
import CookieConsent from './components/directory/CookieConsent'

import PublicLayout from './components/layout/PublicLayout'

/* External redirect helper — sends to reeveos.app for auth */
const ExternalRedirect = ({ to }) => {
  window.location.href = to
  return null
}

/* ═══ DIRECTORY PAGES (v2 — all wired to portal.rezvo.app/api) ═══ */
import DirectoryLandingV2 from './pages/directory/DirectoryLandingV2'
import SearchPageV2 from './pages/directory/SearchPageV2'
import ServiceProfilePage from './pages/directory/ServiceProfilePage'
import RestaurantProfilePage from './pages/directory/RestaurantProfilePage'
import CategoryCityPage from './pages/directory/CategoryCityPage'
import LiveFeed from './pages/directory/LiveFeed'
import FaqsPage from './pages/directory/FaqsPage'
import ListBusinessPage from './pages/directory/ListBusinessPage'

/* Legacy pages (kept for backwards compat) */
import ListingPage from './pages/directory/ListingPage'

/* Public SEO pages */
import HomePage from './pages/public/HomePage'
import SearchResults from './pages/public/SearchResults'
import BusinessListing from './pages/public/BusinessListing'
import CategoryHub from './pages/public/CategoryHub'

/* Static pages */
import NotFoundPage from './pages/static/NotFoundPage'

/* Booking flow */
import BookingFlow from './pages/booking/BookingFlow'
import BookingConfirmation from './pages/booking/BookingConfirmation'
import BookingManage from './pages/booking/BookingManage'

import SmartProfile from './pages/directory/SmartProfile'

const App = () => {
  return (
    <>
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* ═══ CORE DIRECTORY (v2 — wired to real API) ═══ */}
          <Route path="/" element={<DirectoryLandingV2 />} />
          <Route path="/search" element={<SearchPageV2 />} />

          {/* THE KILLER FEATURE — cancellation marketplace */}
          <Route path="/live" element={<LiveFeed />} />

          {/* List your business — free listing registration */}
          <Route path="/list-your-business" element={<ListBusinessPage />} />

          {/* Smart profile routing — auto-detects restaurant vs service */}
          <Route path="/:slug" element={<SmartProfile />} />

          {/* Legacy routes (kept for backwards compat) */}
          <Route path="/restaurant/:slug" element={<RestaurantProfilePage />} />
          <Route path="/venue/:slug" element={<SmartProfile />} />

          {/* SEO category + city pages (Gap #39 — /barbers/sheffield) */}
          <Route path="/categories/:category/:city" element={<CategoryCityPage />} />
          <Route path="/categories/:category" element={<CategoryCityPage />} />

          {/* Auth — redirect to reeveos.app */}
          <Route path="/login" element={<ExternalRedirect to="https://portal.rezvo.app/login" />} />
          <Route path="/signup" element={<ExternalRedirect to="/list-your-business" />} />
          <Route path="/faqs" element={<FaqsPage />} />

          {/* Static page redirects */}
          <Route path="/about" element={<ExternalRedirect to="https://reeveos.app/about.html" />} />
          <Route path="/for-business" element={<ExternalRedirect to="https://reeveos.app/for-business" />} />
          <Route path="/contact" element={<ExternalRedirect to="https://reeveos.app/contact.html" />} />
          <Route path="/privacy" element={<ExternalRedirect to="https://reeveos.app/privacy.html" />} />
          <Route path="/terms" element={<ExternalRedirect to="https://reeveos.app/terms.html" />} />
          <Route path="/cookies" element={<ExternalRedirect to="https://reeveos.app/cookies.html" />} />

          {/* Public SEO pages (original layout) */}
          <Route element={<PublicLayout />}>
            <Route path="/discover" element={<HomePage />} />
            <Route path="/results" element={<SearchResults />} />
          </Route>

          {/* Consumer booking flow (existing — already wired) */}
          <Route path="/book/:businessSlug" element={<BookingFlow />} />
          <Route path="/book/:businessSlug/confirm/:bookingId" element={<BookingConfirmation />} />
          <Route path="/book/:businessSlug/manage/:bookingId" element={<BookingManage />} />

          {/* Placeholder routes for bottom nav */}
          <Route path="/bookings" element={<div style={{ padding: 48, textAlign: 'center', fontFamily: "'Figtree',sans-serif" }}><h2>My Bookings</h2><p style={{ color: '#6B7280' }}>Sign in to see your bookings</p></div>} />
          <Route path="/profile" element={<div style={{ padding: 48, textAlign: 'center', fontFamily: "'Figtree',sans-serif" }}><h2>Profile</h2><p style={{ color: '#6B7280' }}>Sign in to manage your profile</p></div>} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {/* Mobile bottom nav — appears on all pages (Gap #87) */}
        <BottomNav />
      </AuthProvider>
    </Router>
    {/* Cookie consent (Gap #55 — ICO/GDPR) */}
    <CookieConsent />
    <ChatWidget />
    </>
  )
}

export default App
