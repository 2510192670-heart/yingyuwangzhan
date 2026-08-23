function normalizeVocabularyItem(item) {
  if (Array.isArray(item)) {
    const [word, phonetic, partOfSpeech, meaning, example, sentence] = item
    return { word, phonetic, partOfSpeech, meaning, example, sentence }
  }
  return item
}

export function createBook(metadata, chapterDefinitions) {
  let wordSequence = 0
  const words = []

  const chapters = chapterDefinitions.map((definition, chapterIndex) => {
    const chapterId = `${metadata.id}-ch${String(chapterIndex + 1).padStart(2, '0')}`
    const chapterWords = definition.vocabulary.map((rawItem) => {
      wordSequence += 1
      const item = normalizeVocabularyItem(rawItem)
      return {
        id: `${metadata.id}-w${String(wordSequence).padStart(3, '0')}`,
        bookId: metadata.id,
        chapterId,
        word: item.word,
        phonetic: item.phonetic,
        partOfSpeech: item.partOfSpeech,
        meaning: item.meaning,
        example: item.example || `The story uses ${item.word} at an important moment.`,
        sentence: item.sentence || `在本章语境中，${item.word} 表示“${item.meaning}”。`
      }
    })

    words.push(...chapterWords)

    return {
      id: chapterId,
      title: definition.title,
      summary: definition.summary,
      content: definition.content.trim(),
      wordCount: definition.content.replace(/\s/g, '').length,
      wordIds: chapterWords.map((word) => word.id)
    }
  })

  return {
    ...metadata,
    chapters,
    words
  }
}
