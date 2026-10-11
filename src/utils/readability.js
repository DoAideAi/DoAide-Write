function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!word) return 0
  if (word.length <= 3) return 1

  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  const vowelGroups = word.match(/[aeiouy]{1,2}/g)
  return vowelGroups ? vowelGroups.length : 1
}

function getSentences(text) {
  return text.split(/[.!?]+/).filter(s => s.trim().length > 0)
}

function getWords(text) {
  return text.split(/\s+/).filter(w => w.replace(/[^a-zA-Z]/g, '').length > 0)
}

export function analyzeReadability(text) {
  if (!text || !text.trim()) return null

  const sentences = getSentences(text)
  const words = getWords(text)
  const sentenceCount = sentences.length
  const wordCount = words.length

  if (wordCount < 10 || sentenceCount === 0) return null

  let totalSyllables = 0
  let complexWords = 0
  let totalChars = 0

  for (const word of words) {
    const clean = word.replace(/[^a-zA-Z]/g, '')
    totalChars += clean.length
    const syllables = countSyllables(clean)
    totalSyllables += syllables
    if (syllables >= 3) complexWords++
  }

  const avgWordsPerSentence = wordCount / sentenceCount
  const avgSyllablesPerWord = totalSyllables / wordCount

  const fleschEase = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord
  const fleschGrade = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59
  const gunningFog = 0.4 * (avgWordsPerSentence + 100 * (complexWords / wordCount))

  const L = (totalChars / wordCount) * 100
  const S = (sentenceCount / wordCount) * 100
  const colemanLiau = 0.0588 * L - 0.296 * S - 15.8

  const ari = 4.71 * (totalChars / wordCount) + 0.5 * avgWordsPerSentence - 21.43

  const clampedEase = Math.max(0, Math.min(100, fleschEase))
  let level, color
  if (clampedEase >= 80) { level = 'Very Easy'; color = '#22c55e' }
  else if (clampedEase >= 70) { level = 'Easy'; color = '#4ade80' }
  else if (clampedEase >= 60) { level = 'Standard'; color = '#0D9488' }
  else if (clampedEase >= 50) { level = 'Fairly Difficult'; color = '#f97316' }
  else if (clampedEase >= 30) { level = 'Difficult'; color = '#ef4444' }
  else { level = 'Very Difficult'; color = '#dc2626' }

  return {
    wordCount,
    sentenceCount,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 10) / 10,
    fleschEase: Math.round(fleschEase * 10) / 10,
    fleschGrade: Math.round(fleschGrade * 10) / 10,
    gunningFog: Math.round(gunningFog * 10) / 10,
    colemanLiau: Math.round(colemanLiau * 10) / 10,
    ari: Math.round(ari * 10) / 10,
    complexWordPercentage: Math.round((complexWords / wordCount) * 1000) / 10,
    level,
    color,
  }
}
