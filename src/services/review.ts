import type { ReviewRecord } from '../stores/learning'

export function getNextReviewAt(record: ReviewRecord) {
  if (record.lastResult === 'again') return record.lastReviewedAt
  const next = new Date(record.lastReviewedAt)
  next.setDate(next.getDate() + 3)
  return next.toISOString()
}

export function isReviewDue(record: ReviewRecord | undefined, now = new Date()) {
  if (!record) return true
  return new Date(getNextReviewAt(record)).getTime() <= now.getTime()
}
