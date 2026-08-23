import { describe, expect, it } from 'vitest'
import { getBookProgress, tokenizeReadingContent } from './reading'

describe('reading content tokenizer', () => {
  it('turns marked vocabulary into interactive word tokens', () => {
    const tokens = tokenizeReadingContent('她感到【curious】，然后继续走。', new Set(['curious']))
    expect(tokens).toEqual([
      { type: 'text', value: '她感到' },
      { type: 'word', value: 'curious' },
      { type: 'text', value: '，然后继续走。' },
    ])
  })

  it('calculates book progress from completed chapters', () => {
    expect(getBookProgress({ chapters: [{ id: 'one' }, { id: 'two' }, { id: 'three' }] }, ['one', 'three'])).toBe(67)
    expect(getBookProgress({ chapters: [] }, [])).toBe(0)
  })
})
