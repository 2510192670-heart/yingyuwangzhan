import { describe, expect, it } from 'vitest'
import { getVoiceForAccent, type PronunciationAccent } from './pronunciation'

const voices = [
  { name: 'Google US English', lang: 'en-US' },
  { name: 'Google UK English Female', lang: 'en-GB' },
  { name: 'English', lang: 'en' },
] as SpeechSynthesisVoice[]

describe('pronunciation', () => {
  it.each<[PronunciationAccent, string]>([
    ['us', 'Google US English'],
    ['uk', 'Google UK English Female'],
  ])('selects the preferred %s voice', (accent, name) => {
    expect(getVoiceForAccent(voices, accent)?.name).toBe(name)
  })

  it('falls back to a generic English voice when the preferred accent is unavailable', () => {
    expect(getVoiceForAccent([{ name: 'English', lang: 'en' } as SpeechSynthesisVoice], 'us')?.lang).toBe('en')
  })

  it('returns no voice when there is no English voice', () => {
    expect(getVoiceForAccent([{ name: '中文', lang: 'zh-CN' } as SpeechSynthesisVoice], 'uk')).toBeUndefined()
  })
})
