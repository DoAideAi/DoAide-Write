/**
 * SEO metadata for every indexable route. Shared by the useSEO hook (wired in
 * App) and scripts/prerender-routes.mjs (static HTML, sitemap), so keep it
 * plain JS with no JSX or browser-only imports. server.js serves each
 * prerendered dist/<route>/index.html.
 */

import { tools } from './data/tools.js'
import { blogPosts } from './data/blog.js'

export const SITE = {
  name: 'DoAide Write',
  baseUrl: 'https://write.doaide.com',
  ogImage: 'https://write.doaide.com/og-write.png',
}

const ORG = { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' }

// Fit "<title> | DoAide Write" into ~70 chars; long titles go without it.
const withSuffix = (title) => (`${title} | DoAide Write`.length <= 70 ? `${title} | DoAide Write` : title)

export const routes = [
  {
    path: '/',
    kind: 'home',
    h1: 'Free Writing Tools — No Login Required',
    title: 'DoAide Write — Free AI Writing Tools & Markdown Editor',
    description:
      'Free AI writing tools: article outline generator, paragraph rewriter, grammar checker and headline analyzer, plus a markdown editor. No login.',
  },
  {
    path: '/editor',
    kind: 'tool',
    h1: 'Markdown Editor',
    title: withSuffix('Online Markdown Editor with Live Preview'),
    description:
      'Write in markdown with a live preview, table of contents and Mermaid diagrams, then export your document. Free, saved in your browser.',
  },
  ...tools.map((t) => ({
    path: `/tools/${t.slug}`,
    kind: 'tool',
    h1: t.name,
    title: withSuffix(`Free ${t.name}`),
    description: t.metaDescription,
  })),
  {
    path: '/blog',
    kind: 'blog',
    h1: 'Blog',
    title: withSuffix('Writing Blog — Tips, Guides & AI Writing Tools'),
    description: 'Guides on clear writing, email and business letters, readability, markdown and using AI writing tools well.',
  },
  ...blogPosts.map((p) => ({
    path: `/blog/${p.slug}`,
    kind: 'post',
    h1: p.title,
    title: withSuffix(p.title),
    description: p.description,
    published: p.date,
    faqs: p.faqs,
  })),
]

export const canonicalFor = (path) => `${SITE.baseUrl}${path}`

export const metaForPath = (path) => routes.find((r) => r.path === path)

export function jsonLdFor(route) {
  const url = canonicalFor(route.path)
  let main
  switch (route.kind) {
    case 'home':
    case 'tool':
      main = {
        '@type': 'WebApplication',
        name: route.kind === 'home' ? SITE.name : route.h1,
        url,
        description: route.description,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        author: ORG,
      }
      break
    case 'post':
      main = {
        '@type': 'BlogPosting',
        headline: route.h1,
        description: route.description,
        url,
        mainEntityOfPage: url,
        datePublished: route.published,
        author: ORG,
        publisher: ORG,
      }
      break
    default:
      main = { '@type': 'Blog', name: `${SITE.name} Blog`, url, description: route.description, publisher: ORG }
  }
  const graph = [main]
  if (route.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: route.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}
