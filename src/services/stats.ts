import type { ReviewRecord, StudySessionRecord } from '../stores/learning'

export interface DailyStudyStat {
  date: string
  label: string
  seconds: number
}

function shiftDate(date: string, offset: number) {
  const value = new Date(`${date}T00:00:00Z`)
  value.setUTCDate(value.getUTCDate() + offset)
  return value.toISOString().slice(0, 10)
}

export function buildStudyTrend(sessions: StudySessionRecord[], endDate: string, days = 7): DailyStudyStat[] {
  const totals = new Map<string, number>()
  for (const session of sessions) totals.set(session.date, (totals.get(session.date) ?? 0) + session.durationSeconds)
  return Array.from({ length: days }, (_, index) => {
    const date = shiftDate(endDate, index - days + 1)
    const [, month, day] = date.split('-')
    return { date, label: `${month}/${day}`, seconds: totals.get(date) ?? 0 }
  })
}

export function getReviewSummary(records: Record<string, ReviewRecord>) {
  const values = Object.values(records)
  return {
    reviewedWords: values.length,
    totalReviews: values.reduce((total, record) => total + record.reviewCount, 0),
    masteredResults: values.filter((record) => record.lastResult === 'mastered').length,
    retryResults: values.filter((record) => record.lastResult === 'again').length,
  }
}
