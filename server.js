import express from 'express'
import { existsSync, readFileSync } from 'fs'
import { join, normalize, sep } from 'path'

const PORT = parseInt(process.env.PORT || '3057', 10)
const HOST = process.env.HOST || '172.18.0.1'
const GEMINI_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash'

const DIST = join(import.meta.dirname, 'dist')
const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf-8')

const app = express()
app.use(express.json({ limit: '32kb' }))

const rateLimit = new Map()
const WINDOW_MS = 60_000
const MAX_REQUESTS = 10

function checkRate(ip) {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now - entry.start > WINDOW_MS) {
    rateLimit.set(ip, { start: now, count: 1 })
    return true
  }
  if (entry.count >= MAX_REQUESTS) return false
  entry.count++
  return true
}

setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimit) {
    if (now - entry.start > WINDOW_MS) rateLimit.delete(ip)
  }
}, 60_000)

app.post('/api/ai', async (req, res) => {
  if (!GEMINI_KEY) {
    return res.status(503).json({ error: 'AI service not configured' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip
  if (!checkRate(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' })
  }

  const { prompt } = req.body
  if (!prompt || typeof prompt !== 'string' || prompt.length > 10000) {
    return res.status(400).json({ error: 'Invalid prompt' })
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Gemini API error:', response.status, err)
      return res.status(502).json({ error: 'AI service error. Please try again.' })
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      return res.status(502).json({ error: 'Empty response from AI service' })
    }

    res.json({ text })
  } catch (err) {
    console.error('AI proxy error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.use(express.static(DIST, { maxAge: '1d', index: false, redirect: false }))

app.get('/{*path}', (req, res) => {
  // Prerendered routes (scripts/prerender-routes.mjs) have their own
  // index.html with that page's meta; everything else gets the SPA shell.
  const page = join(DIST, normalize(req.path), 'index.html')
  if (page.startsWith(DIST + sep) && existsSync(page)) return res.sendFile(page)
  res.setHeader('Content-Type', 'text/html')
  res.send(indexHtml)
})

app.listen(PORT, HOST, () => {
  console.log(`DoAide Write server running at http://${HOST}:${PORT}`)
})
