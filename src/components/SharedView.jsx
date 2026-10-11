import { useRef } from 'react'
import { copyToClipboard, downloadFile, getStandaloneHtml } from '../utils/export'
import Preview from './Preview'

export default function SharedView({ content, isDark }) {
  const previewRef = useRef(null)

  const handleCopy = () => copyToClipboard(content)
  const handleDownload = () => downloadFile(content, 'document.md', 'text/markdown')
  const handleEdit = () => {
    window.location.hash = ''
    window.location.reload()
  }

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--color-canvas)' }}>
      <header className="flex items-center justify-between h-11 px-4 border-b flex-shrink-0"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper)' }}>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold" style={{ color: 'var(--da-primary)' }}>DoAide</span>
          <span className="text-sm" style={{ color: 'var(--color-ink-400)' }}>|</span>
          <span className="text-sm font-medium" style={{ color: 'var(--color-ink-700)' }}>Write</span>
          <span className="text-xs ml-2 px-2 py-0.5 rounded-full" style={{ background: 'var(--color-surface)', color: 'var(--color-ink-500)' }}>
            Shared Document
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy}
            className="px-3 py-1 text-xs rounded border hover:bg-[var(--color-surface-hover)] transition-colors"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-700)' }}>
            Copy
          </button>
          <button onClick={handleDownload}
            className="px-3 py-1 text-xs rounded border hover:bg-[var(--color-surface-hover)] transition-colors"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-700)' }}>
            Download
          </button>
          <button onClick={handleEdit}
            className="px-3 py-1 text-xs rounded font-medium transition-colors"
            style={{ background: 'var(--color-gold)', color: '#fff' }}>
            Open Editor
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-8 px-4">
          <Preview ref={previewRef} content={content} previewTheme="github" />
        </div>
      </div>

      <footer className="text-center py-3 border-t text-xs" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-400)' }}>
        Written with <a href="https://write.doaide.com" className="hover:underline" style={{ color: 'var(--color-gold)' }}>DoAide Write</a> — Free Markdown Editor
      </footer>
    </div>
  )
}
