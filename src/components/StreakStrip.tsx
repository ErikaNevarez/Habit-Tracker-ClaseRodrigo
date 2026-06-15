interface StreakStripProps {
  checkins: { date: string; done: boolean }[]
  createdAt: string
}

function getLast14Days(): string[] {
  const days: string[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toLocaleDateString('sv'))
  }
  return days
}

export default function StreakStrip({ checkins, createdAt }: StreakStripProps) {
  const days = getLast14Days()
  const checkinMap = new Map(checkins.map((c) => [c.date, c.done]))
  const createdDate = createdAt.slice(0, 10)

  return (
    <div className="grid grid-cols-[repeat(14,_1fr)] gap-1" aria-label="Franja de 14 días">
      {days.map((date) => {
        let colorClass: string
        if (date < createdDate) {
          colorClass = 'bg-gray-200'
        } else {
          const done = checkinMap.get(date)
          colorClass = done === true ? 'bg-emerald-500' : 'bg-red-400'
        }
        return (
          <span
            key={date}
            title={date}
            aria-label={date}
            className={`h-6 w-6 rounded-sm ${colorClass}`}
          />
        )
      })}
    </div>
  )
}
