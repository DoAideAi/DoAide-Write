import { describe, it, expect } from 'vitest'
import { tools } from '../data/tools'
import { blogPosts } from '../data/blog'
import { jsonLdFor, metaForPath, routes } from '../routeMeta'

describe('routeMeta', () => {
  it('has unique paths, titles and descriptions', () => {
    for (const key of ['path', 'title', 'description']) {
      const values = routes.map((r) => r[key])
      expect(new Set(values).size).toBe(values.length)
    }
  })

  it('covers every tool and post with the h1 the page renders', () => {
    for (const t of tools) expect(metaForPath(`/tools/${t.slug}`).h1).toBe(t.name)
    for (const p of blogPosts) expect(metaForPath(`/blog/${p.slug}`).h1).toBe(p.title)
  })

  it('dates every post and emits complete FAQs', () => {
    for (const p of blogPosts) {
      const graph = jsonLdFor(metaForPath(`/blog/${p.slug}`))['@graph']
      expect(graph[0].datePublished).toBe(p.date)
      for (const q of graph.find((n) => n['@type'] === 'FAQPage')?.mainEntity ?? []) {
        expect(q.name && q.acceptedAnswer.text).toBeTruthy()
      }
    }
  })

  it('keeps titles within 70 chars', () => {
    for (const r of routes) expect(r.title.length, r.path).toBeLessThanOrEqual(70)
  })
})
