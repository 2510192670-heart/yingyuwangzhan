import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WordbookView from './WordbookView.vue'

const words = [
  { id: 'w1', bookId: 'book', chapterId: 'ch1', word: 'abuse', phonetic: '/əˈbjuːs/', partOfSpeech: 'v.', meaning: '滥用；虐待' },
  { id: 'w2', bookId: 'book', chapterId: 'ch1', word: 'board', phonetic: '/bɔːrd/', partOfSpeech: 'n.', meaning: '木板；董事会' },
]

describe('WordbookView', () => {
  it('filters visible words by search text', async () => {
    const wrapper = mount(WordbookView, { props: { words, masteredWordIds: [], reviewRecords: {} } })
    await wrapper.get('input[placeholder="搜索单词或释义"]').setValue('abuse')
    expect(wrapper.text()).toContain('abuse')
    expect(wrapper.text()).not.toContain('board')
  })

  it('enters review mode and emits mastery for the current word', async () => {
    const wrapper = mount(WordbookView, { props: { words, masteredWordIds: [], reviewRecords: {} } })
    await wrapper.get('button.review-button').trigger('click')
    expect(wrapper.text()).toContain('复习模式')
    await wrapper.get('button.review-master').trigger('click')
    expect(wrapper.emitted('mastery')?.[0]).toEqual([words[0]])
    expect(wrapper.text()).toContain('2 / 2')
    expect(wrapper.text()).toContain('board')
  })

  it('opens a word detail panel from the word row', async () => {
    const wrapper = mount(WordbookView, { props: { words, masteredWordIds: [], reviewRecords: {} } })
    await wrapper.get('.word-cell strong').trigger('click')
    expect(wrapper.text()).toContain('WORD DETAIL')
    expect(wrapper.text()).toContain('滥用；虐待')
  })
})
