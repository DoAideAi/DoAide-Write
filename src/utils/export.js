export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
}

export function getStandaloneHtml(htmlContent, title = 'Document') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown-light.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
  <style>
    body {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    }
    .markdown-body { font-size: 16px; }
    @media print {
      body { max-width: none; padding: 0; }
    }
    .doaide-watermark {
      text-align: center;
      padding: 2rem 0 1rem;
      color: #9ca3af;
      font-size: 0.75rem;
      border-top: 1px solid #e5e7eb;
      margin-top: 3rem;
    }
    .doaide-watermark a { color: #0D9488; text-decoration: none; }
  </style>
</head>
<body>
  <article class="markdown-body">
    ${htmlContent}
  </article>
  <div class="doaide-watermark">
    Written with <a href="https://write.doaide.com">DoAide Write</a> — Free Markdown Editor
  </div>
</body>
</html>`
}

export function printDocument() {
  window.print()
}
