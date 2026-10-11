import { useState } from 'react'

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const MonitorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
)

export default function Header({ theme, setTheme, previewTheme, setPreviewTheme, onToggleSidebar, sidebarOpen, onToggleToc, tocOpen }) {
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [previewMenuOpen, setPreviewMenuOpen] = useState(false)

  const themeIcons = { light: <SunIcon />, dark: <MoonIcon />, system: <MonitorIcon /> }
  const previewThemes = [
    { id: 'github', name: 'GitHub' },
    { id: 'academic', name: 'Academic' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'night', name: 'Night' },
  ]

  return (
    <header className="flex items-center justify-between h-11 px-3 border-b no-print flex-shrink-0"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper)' }}>
      <div className="flex items-center gap-2">
        <button onClick={onToggleSidebar}
          className="p-1.5 rounded hover:bg-[var(--color-surface-hover)] transition-colors"
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="flex items-center gap-1.5 select-none">
          <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--da-primary)' }}>DoAide</span>
          <span className="text-sm" style={{ color: 'var(--color-ink-400)' }}>|</span>
          <span className="text-sm font-medium" style={{ color: 'var(--color-ink-700)' }}>Write</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={onToggleToc}
          className={`p-1.5 rounded transition-colors ${tocOpen ? 'bg-[var(--color-gold-bg)]' : 'hover:bg-[var(--color-surface-hover)]'}`}
          title="Table of Contents">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </button>

        {/* Preview theme picker */}
        <div className="relative">
          <button onClick={() => { setPreviewMenuOpen(!previewMenuOpen); setThemeMenuOpen(false) }}
            className="p-1.5 rounded hover:bg-[var(--color-surface-hover)] transition-colors text-xs font-medium"
            style={{ color: 'var(--color-ink-500)' }}
            title="Preview theme">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
          {previewMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setPreviewMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-50 py-1 rounded-lg shadow-lg min-w-[140px]"
                style={{ background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-ink-400)' }}>
                  Preview Theme
                </div>
                {previewThemes.map(t => (
                  <button key={t.id}
                    onClick={() => { setPreviewTheme(t.id); setPreviewMenuOpen(false) }}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--color-surface-hover)] transition-colors flex items-center gap-2
                      ${previewTheme === t.id ? 'font-medium' : ''}`}
                    style={{ color: previewTheme === t.id ? 'var(--color-gold)' : 'var(--color-ink-700)' }}>
                    {previewTheme === t.id && <span>●</span>}
                    {t.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Theme toggle */}
        <div className="relative">
          <button onClick={() => { setThemeMenuOpen(!themeMenuOpen); setPreviewMenuOpen(false) }}
            className="p-1.5 rounded hover:bg-[var(--color-surface-hover)] transition-colors"
            title="Toggle theme">
            {themeIcons[theme]}
          </button>
          {themeMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setThemeMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-50 py-1 rounded-lg shadow-lg min-w-[120px]"
                style={{ background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
                {['light', 'dark', 'system'].map(t => (
                  <button key={t}
                    onClick={() => { setTheme(t); setThemeMenuOpen(false) }}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--color-surface-hover)] transition-colors flex items-center gap-2
                      ${theme === t ? 'font-medium' : ''}`}
                    style={{ color: theme === t ? 'var(--color-gold)' : 'var(--color-ink-700)' }}>
                    {themeIcons[t]}
                    <span className="capitalize">{t}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
