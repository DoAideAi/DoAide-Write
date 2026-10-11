import { Link } from 'react-router-dom'
import { tools } from '../data/tools'

export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper)' }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-semibold" style={{ color: 'var(--da-primary)' }}>DoAide</span>
              <span className="text-lg" style={{ color: 'var(--color-ink-400)' }}>|</span>
              <span className="text-lg font-medium" style={{ color: 'var(--color-ink-700)' }}>Write</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-500)' }}>
              Free writing tools for everyone. No login required, no data stored on servers.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-ink-400)' }}>
              Product
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/editor" className="text-sm no-underline" style={{ color: 'var(--color-ink-700)' }}>Markdown Editor</Link>
              <Link to="/blog" className="text-sm no-underline" style={{ color: 'var(--color-ink-700)' }}>Blog</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-ink-400)' }}>
              Free Tools
            </h4>
            <div className="flex flex-col gap-2">
              {tools.map(tool => (
                <Link key={tool.slug} to={`/tools/${tool.slug}`}
                  className="text-sm no-underline" style={{ color: 'var(--color-ink-700)' }}>
                  {tool.shortName}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-ink-400)' }}>
              DoAide Products
            </h4>
            <div className="flex flex-col gap-2">
              <a href="https://doaide.com" target="_blank" rel="noopener noreferrer"
                className="text-sm no-underline" style={{ color: 'var(--color-ink-700)' }}>DoAide</a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-xs" style={{ color: 'var(--color-ink-400)' }}>
            &copy; {new Date().getFullYear()} DoAide. All rights reserved.
          </p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: 'var(--color-gold-bg)', color: 'var(--da-primary)' }}>
            A DoAide Product
          </span>
        </div>
      </div>
    </footer>
  )
}
