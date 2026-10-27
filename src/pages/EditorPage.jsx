import { useCallback, useEffect, useRef, useState } from 'react'
import Editor from '../components/Editor'
import Header from '../components/Header'
import Preview from '../components/Preview'
import SharedView from '../components/SharedView'
import Sidebar from '../components/Sidebar'
import StatusBar from '../components/StatusBar'
import TableOfContents from '../components/TableOfContents'
import Toolbar from '../components/Toolbar'
import { useDocuments } from '../hooks/useDocuments'
import { useTheme } from '../hooks/useTheme'
import { getSharedContent } from '../utils/sharing'

export default function EditorPage() {
  const { theme, setTheme, isDark, previewTheme, setPreviewTheme } = useTheme()
  const {
    documents, activeDoc, activeId, setActiveId,
    updateContent, addDocument, removeDocument, renameDocument,
  } = useDocuments()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [tocOpen, setTocOpen] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [typewriterMode, setTypewriterMode] = useState(false)
  const [fullscreenEditor, setFullscreenEditor] = useState(false)
  const [fullscreenPreview, setFullscreenPreview] = useState(false)
  const [splitRatio, setSplitRatio] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [sharedContent] = useState(() => getSharedContent())

  const editorRef = useRef(null)
  const previewRef = useRef(null)
  const splitContainerRef = useRef(null)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const handleInsert = useCallback((before, after, defaultText) => {
    editorRef.current?.insert(before, after, defaultText)
  }, [])

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  useEffect(() => {
    if (!isDragging) return
    const handleMouseMove = (e) => {
      const container = splitContainerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      if (isMobile) {
        const ratio = ((e.clientY - rect.top) / rect.height) * 100
        setSplitRatio(Math.max(20, Math.min(80, ratio)))
      } else {
        const ratio = ((e.clientX - rect.left) / rect.width) * 100
        setSplitRatio(Math.max(20, Math.min(80, ratio)))
      }
    }
    const handleMouseUp = () => setIsDragging(false)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isMobile])

  if (sharedContent) {
    return <SharedView content={sharedContent} isDark={isDark} />
  }

  const content = activeDoc?.content || ''
  const showEditor = !fullscreenPreview
  const showPreview = !fullscreenEditor

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--color-canvas)', color: 'var(--color-ink-900)' }}>
      <h1 className="sr-only">Markdown Editor</h1>
      <Header
        theme={theme}
        setTheme={setTheme}
        previewTheme={previewTheme}
        setPreviewTheme={setPreviewTheme}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        onToggleToc={() => setTocOpen(!tocOpen)}
        tocOpen={tocOpen}
      />

      <Toolbar
        onInsert={handleInsert}
        content={content}
        activeDoc={activeDoc}
        previewRef={previewRef}
        focusMode={focusMode}
        onToggleFocus={() => setFocusMode(!focusMode)}
        typewriterMode={typewriterMode}
        onToggleTypewriter={() => setTypewriterMode(!typewriterMode)}
        fullscreenEditor={fullscreenEditor}
        onToggleFullscreenEditor={() => { setFullscreenEditor(!fullscreenEditor); setFullscreenPreview(false) }}
        fullscreenPreview={fullscreenPreview}
        onToggleFullscreenPreview={() => { setFullscreenPreview(!fullscreenPreview); setFullscreenEditor(false) }}
        onUndo={() => editorRef.current?.undo()}
        onRedo={() => editorRef.current?.redo()}
      />

      <div className="flex flex-1 overflow-hidden min-h-0">
        {sidebarOpen && !isMobile && (
          <Sidebar
            documents={documents}
            activeId={activeId}
            onSelect={setActiveId}
            onAdd={addDocument}
            onRemove={removeDocument}
            onRename={renameDocument}
          />
        )}

        <div ref={splitContainerRef}
          className={`flex-1 flex overflow-hidden min-w-0 ${isMobile ? 'flex-col' : 'flex-row'}`}
          style={{ cursor: isDragging ? (isMobile ? 'row-resize' : 'col-resize') : undefined }}>
          {showEditor && (
            <div style={showPreview ? { [isMobile ? 'height' : 'width']: `${splitRatio}%` } : { flex: 1 }}
              className="overflow-hidden min-w-0 min-h-0">
              <Editor
                ref={editorRef}
                content={content}
                onChange={updateContent}
                focusMode={focusMode}
                typewriterMode={typewriterMode}
              />
            </div>
          )}

          {showEditor && showPreview && (
            <div className={`split-handle ${isDragging ? 'active' : ''}`}
              onMouseDown={handleMouseDown} />
          )}

          {showPreview && (
            <div style={showEditor ? { flex: 1 } : { flex: 1 }}
              className="overflow-hidden min-w-0 min-h-0">
              <Preview
                ref={previewRef}
                content={content}
                previewTheme={previewTheme}
              />
            </div>
          )}
        </div>

        {tocOpen && !isMobile && (
          <TableOfContents
            content={content}
            onClose={() => setTocOpen(false)}
          />
        )}
      </div>

      <StatusBar content={content} />
    </div>
  )
}
