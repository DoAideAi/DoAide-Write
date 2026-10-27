import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import { tools } from '../data/tools'
import { callGemini } from '../utils/gemini'
import { analyzeReadability } from '../utils/readability'

function ReadabilityResult({ result }) {
  if (!result) return null

  const metrics = [
    { label: 'Flesch-Kincaid Ease', value: result.fleschEase, desc: 'Higher = easier (0-100)' },
    { label: 'Flesch-Kincaid Grade', value: result.fleschGrade, desc: 'U.S. grade level' },
    { label: 'Gunning Fog Index', value: result.gunningFog, desc: 'Years of education needed' },
    { label: 'Coleman-Liau Index', value: result.colemanLiau, desc: 'Grade level (character-based)' },
    { label: 'Automated Readability', value: result.ari, desc: 'Grade level (ARI)' },
  ]

  return (
    <div className="space-y-6">
      {/* Overall score */}
      <div className="text-center py-6 rounded-xl" style={{ background: 'var(--color-surface)' }}>
        <div className="text-5xl font-bold mb-1" style={{ color: result.color }}>
          {result.fleschEase}
        </div>
        <div className="text-sm font-semibold" style={{ color: result.color }}>
          {result.level}
        </div>
        <div className="text-xs mt-1" style={{ color: 'var(--color-ink-400)' }}>
          Flesch-Kincaid Reading Ease
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Words', value: result.wordCount },
          { label: 'Sentences', value: result.sentenceCount },
          { label: 'Avg Words/Sentence', value: result.avgWordsPerSentence },
          { label: 'Complex Words', value: `${result.complexWordPercentage}%` },
        ].map(s => (
          <div key={s.label} className="text-center p-3 rounded-lg" style={{ background: 'var(--color-surface)' }}>
            <div className="text-xl font-bold" style={{ color: 'var(--color-ink-900)' }}>{s.value}</div>
            <div className="text-[11px]" style={{ color: 'var(--color-ink-400)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Detailed metrics */}
      <div className="space-y-3">
        {metrics.map(m => (
          <div key={m.label} className="flex items-center justify-between p-3 rounded-lg"
            style={{ background: 'var(--color-surface)' }}>
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--color-ink-900)' }}>{m.label}</div>
              <div className="text-xs" style={{ color: 'var(--color-ink-400)' }}>{m.desc}</div>
            </div>
            <div className="text-lg font-bold" style={{ color: 'var(--color-gold)' }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ToolPage() {
  const { slug } = useParams()
  const tool = tools.find(t => t.slug === slug)

  const [input, setInput] = useState('')
  const [tone, setTone] = useState('Professional')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!tool) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Tool Not Found</h1>
        <Link to="/" className="text-sm" style={{ color: 'var(--color-gold)' }}>Back to Home</Link>
      </div>
    )
  }

  const handleSubmit = async () => {
    if (!input.trim()) return
    setError(null)
    setResult(null)
    setLoading(true)

    try {
      if (!tool.isAI) {
        const analysis = analyzeReadability(input)
        if (!analysis) {
          setError('Please enter at least 10 words for meaningful analysis.')
          return
        }
        setResult({ type: 'readability', data: analysis })
      } else {
        const prompt = tool.buildPrompt(input, tone)
        const text = await callGemini(prompt)
        setResult({ type: 'markdown', data: text })
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const otherTools = tools.filter(t => t.slug !== slug)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--color-ink-400)' }}>
        <Link to="/" className="no-underline" style={{ color: 'var(--color-ink-400)' }}>Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-ink-700)' }}>Tools</span>
        <span>/</span>
        <span style={{ color: 'var(--color-gold)' }}>{tool.shortName}</span>
      </div>

      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-ink-900)' }}>
        {tool.name}
      </h1>
      <p className="text-lg mb-8" style={{ color: 'var(--color-ink-500)' }}>
        {tool.description}
      </p>

      {/* Input */}
      <div className="space-y-4 mb-6">
        <label className="block text-sm font-medium" style={{ color: 'var(--color-ink-700)' }}>
          {tool.inputLabel}
        </label>

        {tool.hasToneSelect && (
          <div className="flex flex-wrap gap-2">
            {tool.tones.map(t => (
              <button key={t} onClick={() => setTone(t)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border"
                style={{
                  borderColor: tone === t ? 'var(--color-gold)' : 'var(--color-border)',
                  background: tone === t ? 'var(--color-gold-bg)' : 'transparent',
                  color: tone === t ? 'var(--color-gold)' : 'var(--color-ink-500)',
                }}>
                {t}
              </button>
            ))}
          </div>
        )}

        <textarea
          value={input}
          onChange={e => setInput(e.target.value.slice(0, tool.maxLength))}
          placeholder={tool.inputPlaceholder}
          rows={tool.maxLength > 1000 ? 8 : 4}
          className="w-full px-4 py-3 rounded-xl border text-sm resize-none outline-none transition-colors"
          style={{
            borderColor: 'var(--color-border)',
            background: 'var(--color-canvas)',
            color: 'var(--color-ink-900)',
            fontFamily: 'inherit',
          }}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'var(--color-ink-400)' }}>
            {input.length}/{tool.maxLength}
          </span>
          <button onClick={handleSubmit}
            disabled={!input.trim() || loading}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition-colors disabled:opacity-50"
            style={{ background: loading ? 'var(--color-ink-400)' : 'var(--color-gold)' }}>
            {loading ? 'Processing...' : tool.buttonLabel}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl mb-6 text-sm" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink-900)' }}>
            {tool.resultLabel}
          </h2>
          <div className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
            {result.type === 'readability' ? (
              <ReadabilityResult result={result.data} />
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{result.data}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Other tools */}
      <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink-900)' }}>
          Other Free Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {otherTools.map(t => (
            <Link key={t.slug} to={`/tools/${t.slug}`}
              className="p-4 rounded-lg border no-underline transition-all hover:shadow-sm"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-canvas)' }}>
              <div className="text-sm font-medium" style={{ color: 'var(--color-ink-900)' }}>{t.name}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-ink-500)' }}>{t.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
