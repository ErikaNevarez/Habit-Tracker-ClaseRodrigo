'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import StreakStrip from '@/components/StreakStrip'

interface Habit {
  id: string
  name: string
  frequency: 'daily' | 'weekly'
  target_per_week: number | null
  best_streak: number
  archived_at: string | null
  created_at: string
}

interface Checkin {
  date: string
  done: boolean
}

async function fetchHabit(habitId: string): Promise<Habit | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('id', habitId)
    .single()

  if (error) return null
  return data
}

async function fetchCheckins14d(habitId: string): Promise<Checkin[]> {
  const supabase = createClient()
  const fourteenDaysAgo = new Date()
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13)
  const from = fourteenDaysAgo.toLocaleDateString('sv')

  const { data, error } = await supabase
    .from('checkins')
    .select('date, done')
    .eq('habit_id', habitId)
    .gte('date', from)

  if (error) return []
  return data ?? []
}

interface HabitDetailPageProps {
  params: Promise<{ id: string }>
}

export default function HabitDetailPage({ params }: HabitDetailPageProps) {
  const { id } = use(params)

  const { data: habit, isLoading, error } = useSWR<Habit | null>(
    `habit-${id}`,
    () => fetchHabit(id)
  )

  const { data: checkins } = useSWR<Checkin[]>(
    habit ? `checkins-14d-${id}` : null,
    () => fetchCheckins14d(id)
  )

  if (!isLoading && (error || habit === null)) {
    notFound()
  }

  const frecuenciaLabel =
    habit?.frequency === 'daily' ? 'Diaria' : 'Semanal'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">
        {isLoading || !habit ? (
          <p className="text-sm text-gray-500">Cargando hábito...</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{habit.name}</h1>
            <p className="text-sm text-gray-500 mb-6">Frecuencia: {frecuenciaLabel}</p>

            <section aria-label="Franja de 14 días">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Últimos 14 días</h2>
              <StreakStrip
                checkins={checkins ?? []}
                createdAt={habit.created_at}
              />
            </section>
          </>
        )}
      </main>
    </div>
  )
}
