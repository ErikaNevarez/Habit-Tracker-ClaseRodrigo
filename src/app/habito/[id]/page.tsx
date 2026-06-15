'use client'

import { use, useEffect, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import useSWR, { mutate } from 'swr'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import StreakStrip from '@/components/StreakStrip'
import { calcStreak } from '@/lib/streak'
import HabitForm from '@/components/HabitForm'

interface Habit {
  id: string
  name: string
  description: string | null
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
  const router = useRouter()
  const [showEditForm, setShowEditForm] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)

  const { data: habit, isLoading, error } = useSWR<Habit | null>(
    `habit-${id}`,
    () => fetchHabit(id)
  )

  const { data: checkins } = useSWR<Checkin[]>(
    habit ? `checkins-14d-${id}` : null,
    () => fetchCheckins14d(id)
  )

  const streak = habit && checkins
    ? calcStreak(checkins, habit.frequency, habit.target_per_week ?? 1)
    : 0

  async function handleArchivar() {
    setIsArchiving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('habits')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', id)
    if (!error) {
      router.push('/')
    } else {
      setIsArchiving(false)
    }
  }

  useEffect(() => {
    if (!habit || !checkins) return
    if (streak <= habit.best_streak) return

    const supabase = createClient()
    supabase
      .from('habits')
      .update({ best_streak: streak })
      .eq('id', habit.id)
      .then(() => {})
  }, [streak, habit, checkins])

  if (!isLoading && (error || habit === null)) {
    notFound()
  }

  const frecuenciaLabel =
    habit?.frequency === 'daily' ? 'Diaria' : 'Semanal'

  const streakUnit =
    habit?.frequency === 'weekly' ? 'semanas consecutivas' : 'días consecutivos'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">
        {isLoading || !habit ? (
          <p className="text-sm text-gray-500">Cargando hábito...</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{habit.name}</h1>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditForm(true)}
                  className="text-sm text-violet-600 hover:text-violet-800 font-medium"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={handleArchivar}
                  disabled={isArchiving}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {isArchiving ? 'Archivando...' : 'Archivar'}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6">Frecuencia: {frecuenciaLabel}</p>

            <section aria-label="Racha actual" className="mb-6">
              {streak === 0 ? (
                <p className="text-sm text-gray-500">Empieza hoy</p>
              ) : (
                <p className="text-lg font-semibold text-gray-900">
                  {streak} {streakUnit}
                </p>
              )}
            </section>

            <section aria-label="Franja de 14 días">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Últimos 14 días</h2>
              <StreakStrip
                checkins={checkins ?? []}
                createdAt={habit.created_at}
              />
            </section>
          </>
        )}
        {showEditForm && habit && (
          <HabitForm
            initialValues={{
              id: habit.id,
              name: habit.name,
              description: habit.description,
              frequency: habit.frequency,
              target_per_week: habit.target_per_week,
            }}
            onClose={() => setShowEditForm(false)}
            onSuccess={() => {
              mutate(`habit-${id}`)
              setShowEditForm(false)
            }}
          />
        )}
      </main>
    </div>
  )
}
