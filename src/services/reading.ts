export interface ReadingToken {
  type: 'text' | 'word'
  value: string
}

export function tokenizeReadingContent(content: string, vocabulary: Set<string>): ReadingToken[] {
  const tokens: ReadingToken[] = []
  const pattern = /【([^】]+)】/g
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(content))) {
    if (match.index > cursor) tokens.push({ type: 'text', value: content.slice(cursor, match.index) })
    const word = match[1]
    tokens.push(vocabulary.has(word) ? { type: 'word', value: word } : { type: 'text', value: word })
    cursor = pattern.lastIndex
  }

  if (cursor < content.length) tokens.push({ type: 'text', value: content.slice(cursor) })
  return tokens
}
