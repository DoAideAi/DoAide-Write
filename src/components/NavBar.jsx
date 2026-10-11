import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/editor', label: 'Editor' },
    { to: '/tools/article-outline-generator', label: 'Tools', match: '/tools' },
    { to: '/blog', label: 'Blog' },
  ]

  const isActive = (link) => {
    if (link.match) return location.pathname.startsWith(link.match)
    return location.pathname === link.to
  }

  return (
    <nav className="sticky top-0 z-50 border-b"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper)' }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 select-none no-underline">
          <span className="text-lg font-semibold tracking-tight" style={{ color: 'var(--da-primary)' }}>DoAide</span>
          <span className="text-lg" style={{ color: 'var(--color-ink-400)' }}>|</span>
          <span className="text-lg font-medium" style={{ color: 'var(--color-ink-700)' }}>Write</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <Link key={link.to} to={link.to}
              className="text-sm font-medium no-underline transition-colors"
              style={{ color: isActive(link) ? 'var(--color-gold)' : 'var(--color-ink-500)' }}>
              {link.label}
            </Link>
          ))}
          <Link to="/editor"
            className="px-4 py-1.5 rounded-lg text-sm font-medium no-underline transition-colors"
            style={{ background: 'var(--color-gold)', color: '#fff' }}>
            Open Editor
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-3"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper)' }}>
          {links.map(link => (
            <Link key={link.to} to={link.to}
              className="text-sm font-medium no-underline"
              style={{ color: isActive(link) ? 'var(--color-gold)' : 'var(--color-ink-700)' }}
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link to="/editor"
            className="px-4 py-2 rounded-lg text-sm font-medium no-underline text-center"
            style={{ background: 'var(--color-gold)', color: '#fff' }}
            onClick={() => setMenuOpen(false)}>
            Open Editor
          </Link>
        </div>
      )}
    </nav>
  )
}
