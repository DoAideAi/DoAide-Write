import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blog'
import { tools } from '../data/tools'

const toolIcons = {
  'article-outline-generator': <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>,
  'paragraph-rewriter': <><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></>,
  'grammar-checker': <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>,
  'headline-analyzer': <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  'readability-scorer': <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: 'var(--color-ink-900)' }}>
            Free Writing Tools
            <br />
            <span style={{ color: 'var(--color-gold)' }}>No Login Required</span>
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--color-ink-500)' }}>
            AI-powered writing tools and a full Markdown editor. Generate outlines, rewrite paragraphs, check grammar, analyze headlines, and score readability — all free, all instant.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/editor"
              className="px-6 py-3 rounded-lg font-semibold no-underline text-white transition-colors"
              style={{ background: 'var(--color-gold)' }}>
              Open Markdown Editor
            </Link>
            <a href="#tools"
              className="px-6 py-3 rounded-lg font-semibold no-underline border transition-colors"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-700)' }}>
              Browse Tools
            </a>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-16 px-4" style={{ background: 'var(--color-paper)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: 'var(--color-ink-900)' }}>
            Free Writing Tools
          </h2>
          <p className="text-center mb-10" style={{ color: 'var(--color-ink-500)' }}>
            Powered by AI. No signup, no limits on basic use.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map(tool => (
              <Link key={tool.slug} to={`/tools/${tool.slug}`}
                className="group p-6 rounded-xl border no-underline transition-all hover:shadow-md"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-canvas)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: 'var(--color-gold-bg)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {toolIcons[tool.slug]}
                  </svg>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-ink-900)' }}>
                  {tool.name}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-500)' }}>
                  {tool.description}
                </p>
                {tool.isAI && (
                  <span className="inline-block mt-3 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded"
                    style={{ background: 'var(--color-gold-bg)', color: 'var(--color-gold)' }}>
                    AI Powered
                  </span>
                )}
              </Link>
            ))}

            {/* Editor card */}
            <Link to="/editor"
              className="group p-6 rounded-xl border no-underline transition-all hover:shadow-md"
              style={{ borderColor: 'var(--color-gold)', background: 'var(--color-gold-bg)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: 'var(--color-gold)', color: '#fff' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--color-ink-900)' }}>
                Markdown Editor
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-500)' }}>
                Full-featured editor with live preview, multiple themes, Mermaid diagrams, LaTeX math, export & sharing.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-ink-900)' }}>
              From the Blog
            </h2>
            <Link to="/blog" className="text-sm font-medium no-underline" style={{ color: 'var(--color-gold)' }}>
              View all posts
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map(post => (
              <Link key={post.slug} to={`/blog/${post.slug}`}
                className="group p-5 rounded-xl border no-underline transition-all hover:shadow-md"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-canvas)' }}>
                <div className="text-xs mb-2" style={{ color: 'var(--color-ink-400)' }}>
                  {post.date} &middot; {post.readTime}
                </div>
                <h3 className="font-semibold mb-2 leading-snug" style={{ color: 'var(--color-ink-900)' }}>
                  {post.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-500)' }}>
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center" style={{ background: 'var(--color-paper)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-ink-900)' }}>
            Start Writing — No Signup Needed
          </h2>
          <p className="mb-6" style={{ color: 'var(--color-ink-500)' }}>
            All tools work instantly in your browser. Your data stays on your device.
          </p>
          <Link to="/editor"
            className="inline-block px-8 py-3 rounded-lg font-semibold no-underline text-white"
            style={{ background: 'var(--color-gold)' }}>
            Open Markdown Editor
          </Link>
        </div>
      </section>
    </div>
  )
}
