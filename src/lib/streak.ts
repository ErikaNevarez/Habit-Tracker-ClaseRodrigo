export interface Checkin {
  date: string
  done: boolean
}

function isoWeek(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  const day = d.getDay() || 7
  d.setDate(d.getDate() + 4 - day)
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  )
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`
}

export function calcStreak(
  checkins: Checkin[],
  frequency: 'daily' | 'weekly',
  targetPerWeek: number
): number {
  if (frequency === 'daily') {
    const doneSet = new Set(
      checkins.filter((c) => c.done).map((c) => c.date)
    )
    const today = new Date().toLocaleDateString('sv')

    if (!doneSet.has(today)) return 0

    let streak = 0
    const cursor = new Date(today + 'T12:00:00')

    while (doneSet.has(cursor.toLocaleDateString('sv'))) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }

    return streak
  }

  // weekly
  const weekMap = new Map<string, number>()
  for (const c of checkins) {
    if (!c.done) continue
    const w = isoWeek(c.date)
    weekMap.set(w, (weekMap.get(w) ?? 0) + 1)
  }

  const currentWeek = isoWeek(new Date().toLocaleDateString('sv'))
  const currentWeekCount = weekMap.get(currentWeek) ?? 0

  let streak = 0
  const cursor = new Date(new Date().toLocaleDateString('sv') + 'T12:00:00')

  if (currentWeekCount < targetPerWeek) {
    cursor.setDate(cursor.getDate() - 7)
  }

  while (true) {
    const w = isoWeek(cursor.toLocaleDateString('sv'))
    const count = weekMap.get(w) ?? 0

    if (count >= targetPerWeek) {
      streak++
      cursor.setDate(cursor.getDate() - 7)
    } else {
      break
    }

    const fiveYearsAgo = new Date()
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5)
    if (cursor < fiveYearsAgo) break
  }

  return streak
}
