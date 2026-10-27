import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import { blogPosts, getBlogBySlug } from '../data/blog'


export default function BlogPost() {
  const { slug } = useParams()
  const post = getBlogBySlug(slug)

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Post Not Found</h1>
        <Link to="/blog" className="text-sm" style={{ color: 'var(--color-gold)' }}>Back to Blog</Link>
      </div>
    )
  }

  const otherPosts = blogPosts.filter(p => p.slug !== slug)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--color-ink-400)' }}>
        <Link to="/" className="no-underline" style={{ color: 'var(--color-ink-400)' }}>Home</Link>
        <span>/</span>
        <Link to="/blog" className="no-underline" style={{ color: 'var(--color-ink-400)' }}>Blog</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-gold)' }} className="truncate">{post.title}</span>
      </div>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight" style={{ color: 'var(--color-ink-900)' }}>
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-ink-400)' }}>
            <span>{post.author}</span>
            <span>&middot;</span>
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            <span>&middot;</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div className="prose prose-sm dark:prose-invert max-w-none
          prose-headings:font-semibold
          prose-h2:text-xl prose-h3:text-lg
          prose-p:leading-relaxed
          prose-a:no-underline hover:prose-a:underline
          prose-pre:bg-gray-50 dark:prose-pre:bg-gray-900
          prose-code:before:content-none prose-code:after:content-none
          prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-blockquote:border-l-4 prose-blockquote:not-italic"
          style={{ '--tw-prose-quote-borders': 'var(--color-gold)' }}>
          <ReactMarkdown
            components={{
              a: ({ node, href, children, ...props }) => {
                if (href && href.startsWith('/')) {
                  return <Link to={href} {...props}>{children}</Link>
                }
                return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
              },
            }}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* CTA */}
      <div className="mt-12 p-6 rounded-xl text-center" style={{ background: 'var(--color-gold-bg)' }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--color-ink-900)' }}>
          Try DoAide Write
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--color-ink-500)' }}>
          Free Markdown editor with AI writing tools. No signup required.
        </p>
        <Link to="/editor"
          className="inline-block px-6 py-2.5 rounded-lg font-semibold text-sm no-underline text-white"
          style={{ background: 'var(--color-gold)' }}>
          Open Editor
        </Link>
      </div>

      {/* Related posts */}
      {otherPosts.length > 0 && (
        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink-900)' }}>
            More Articles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherPosts.map(p => (
              <Link key={p.slug} to={`/blog/${p.slug}`}
                className="p-4 rounded-lg border no-underline transition-all hover:shadow-sm"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-canvas)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--color-ink-400)' }}>{p.date}</div>
                <div className="text-sm font-medium" style={{ color: 'var(--color-ink-900)' }}>{p.title}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
