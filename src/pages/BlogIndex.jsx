import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blog'

export default function BlogIndex() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-ink-900)' }}>Blog</h1>
      <p className="mb-8" style={{ color: 'var(--color-ink-500)' }}>
        Tips, guides, and insights on writing, Markdown, and content creation.
      </p>

      <div className="space-y-6">
        {blogPosts.map(post => (
          <Link key={post.slug} to={`/blog/${post.slug}`}
            className="block p-6 rounded-xl border no-underline transition-all hover:shadow-md"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-canvas)' }}>
            <div className="flex items-center gap-3 text-xs mb-2" style={{ color: 'var(--color-ink-400)' }}>
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <span>&middot;</span>
              <span>{post.readTime}</span>
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-ink-900)' }}>
              {post.title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-500)' }}>
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
