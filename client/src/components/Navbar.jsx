import { useState } from 'react'
import { Compass, Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import api from '../services/api'

const links = [
  { to: '/', label: 'Home' },
  { to: '/domestic', label: 'Domestic' },
  { to: '/international', label: 'International' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [signOutError, setSignOutError] = useState('')
  const [isSigningOut, setIsSigningOut] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  async function signOut() {
    setSignOutError('')
    setIsSigningOut(true)
    try {
      await api.post('/auth/logout')
      window.location.assign('/login')
    } catch (requestError) {
      setSignOutError(requestError.response?.data?.error || 'Unable to sign out. Please try again.')
      setIsSigningOut(false)
    }
  }

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" to="/" aria-label="YatraHub home" onClick={closeMenu}>
          <span className="brand-mark"><Compass size={22} strokeWidth={1.8} /></span>
          <span>YatraHub</span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
        <nav id="site-navigation" className={`primary-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
          <Link className="nav-cta" to="/custom-trip" onClick={closeMenu}>Plan My Trip</Link>
          <button className="nav-link nav-signout" type="button" onClick={signOut} disabled={isSigningOut}>
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </button>
          {signOutError && <span className="nav-signout-error" role="alert">{signOutError}</span>}
        </nav>
      </div>
    </header>
  )
}

export default Navbar