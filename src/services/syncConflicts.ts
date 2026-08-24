export interface SyncLocation {
  bookId: string | null
  chapterId: string | null
}

export interface SyncConflict {
  id: 'reading-location'
  label: string
  local: SyncLocation
  cloud: SyncLocation
}

export function detectSyncConflicts(local: SyncLocation, cloud: SyncLocation): SyncConflict[] {
  if (!local.bookId || !local.chapterId || !cloud.bookId || !cloud.chapterId) return []
  if (local.bookId === cloud.bookId && local.chapterId === cloud.chapterId) return []
  return [{ id: 'reading-location', label: '最近阅读位置', local, cloud }]
}
