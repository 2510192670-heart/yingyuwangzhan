import { chapters as legacyChapters, words as legacyWords } from '../mockData.js'

const chapterIdMap = Object.fromEntries(
  legacyChapters.map((chapter, index) => [chapter.id, `romance-ch${String(index + 1).padStart(2, '0')}`])
)

const words = legacyWords.map((word) => ({
  ...word,
  id: `romance-${word.id}`,
  bookId: 'romance',
  chapterId: chapterIdMap[word.chapterId]
}))

const chapters = legacyChapters.map((chapter) => {
  const chapterId = chapterIdMap[chapter.id]
  const chapterWords = words.filter((word) => word.chapterId === chapterId)
  const markerLine = chapterWords.map((word) => `【${word.word}】`).join('、')

  return {
    ...chapter,
    id: chapterId,
    summary: '爽文情节与四级核心词汇结合，适合轻松入门。',
    content: `${chapter.content}\n\n本章重点词汇：${markerLine}`,
    wordIds: chapterWords.map((word) => word.id)
  }
})

export default {
  id: 'romance',
  title: '知乎风女主爽文合集',
  subtitle: '熟悉的故事，轻松记住四级词汇',
  author: '翯翯学习版',
  level: '四级入门',
  description: '用节奏明快的中文故事串联英语四级词汇，保留现有三章和全部学习记录。',
  accent: '#F3B9D2',
  coverMark: '爽',
  chapters,
  words
}
