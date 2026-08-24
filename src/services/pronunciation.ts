export type PronunciationAccent = 'us' | 'uk'

export const pronunciationAccentLabels: Record<PronunciationAccent, string> = {
  us: '美音',
  uk: '英音',
}

function languageMatches(voice: SpeechSynthesisVoice, accent: PronunciationAccent) {
  const lang = voice.lang.toLowerCase()
  return accent === 'us' ? lang === 'en-us' || lang.startsWith('en-us-') : lang === 'en-gb' || lang.startsWith('en-gb-')
}

export function getVoiceForAccent(voices: SpeechSynthesisVoice[], accent: PronunciationAccent) {
  return voices.find((voice) => languageMatches(voice, accent)) ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('en'))
}

export function speakWord(word: string, accent: PronunciationAccent, speech: SpeechSynthesis | undefined = typeof window !== 'undefined' ? window.speechSynthesis : undefined) {
  if (!speech || !word.trim()) return false
  const utterance = new SpeechSynthesisUtterance(word.trim())
  utterance.lang = accent === 'us' ? 'en-US' : 'en-GB'
  utterance.rate = 0.85
  const voice = getVoiceForAccent(speech.getVoices(), accent)
  if (voice) utterance.voice = voice
  speech.cancel()
  speech.speak(utterance)
  return true
}
