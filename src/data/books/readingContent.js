function normalizeWord(value) {
  return String(value || '').trim().toLowerCase()
}

/**
 * 把正文中的【word】标记解析为可点击词卡片段。
 * 同一拼写在一章内出现多次时按 chapterWords 顺序逐个消费，确保每个标记绑定唯一 ID。
 */
export function parseMarkedContent(content, chapterWords = []) {
  if (typeof content !== 'string' || !content.trim()) return []

  const wordQueues = new Map()
  for (const word of chapterWords) {
    const key = normalizeWord(word?.word)
    if (!key) continue
    if (!wordQueues.has(key)) wordQueues.set(key, [])
    wordQueues.get(key).push(word)
  }

  return content.split('\n\n').map((paragraph) => {
    const segments = []
    const markerPattern = /【([^】]+)】/g
    let lastIndex = 0
    let match

    while ((match = markerPattern.exec(paragraph)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', text: paragraph.slice(lastIndex, match.index) })
      }

      const queue = wordQueues.get(normalizeWord(match[1]))
      const wordData = queue?.shift()
      if (wordData) {
        segments.push({
          type: 'word',
          text: wordData.word,
          wordId: wordData.id,
          meaning: wordData.meaning
        })
      } else {
        segments.push({ type: 'text', text: match[0] })
      }
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < paragraph.length) {
      segments.push({ type: 'text', text: paragraph.slice(lastIndex) })
    }
    if (!segments.length) segments.push({ type: 'text', text: paragraph })
    return segments
  })
}
