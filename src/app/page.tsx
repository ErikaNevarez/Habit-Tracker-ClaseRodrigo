'use client'

import Link from 'next/link'
import { useState } from 'react'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import HabitForm from '@/components/HabitForm'
import ToggleCheck from '@/components/ToggleCheck'
import Toast from '@/components/Toast'

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
  habit_id: string
  date: string
  done: boolean
}

const HABITS_KEY = 'habits-active'
const CHECKINS_TODAY_KEY = 'checkins-today'

async function fetchActiveHabits(): Promise<Habit[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .is('archived_at', null)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

async function fetchCheckinsToday(): Promise<Checkin[]> {
  const supabase = createClient()
  const today = new Date().toLocaleDateString('sv')
  const { data, error } = await supabase
    .from('checkins')
    .select('habit_id, date, done')
    .eq('date', today)

  if (error) throw error
  return data ?? []
}

export default function HomePage() {
  const [showForm, setShowForm] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [confirmArchiveId, setConfirmArchiveId] = useState<string | null>(null)
  const [isArchiving, setIsArchiving] = useState(false)

  const { data: habits, isLoading, mutate: mutateHabits } = useSWR<Habit[]>(
    HABITS_KEY,
    fetchActiveHabits
  )

  const { data: checkins, mutate: mutateCheckins } = useSWR<Checkin[]>(
    CHECKINS_TODAY_KEY,
    fetchCheckinsToday
  )

  async function handleToggle(habit: Habit) {
    const today = new Date().toLocaleDateString('sv')
    const current = checkins?.find((c) => c.habit_id === habit.id)
    const newDone = current ? !current.done : true

    const optimisticCheckins: Checkin[] = [
      ...(checkins ?? []).filter((c) => c.habit_id !== habit.id),
      { habit_id: habit.id, date: today, done: newDone },
    ]

    await mutateCheckins(optimisticCheckins, { revalidate: false })

    const supabase = createClient()
    const { error } = await supabase
      .from('checkins')
      .upsert(
        { habit_id: habit.id, date: today, done: newDone },
        { onConflict: 'habit_id,date' }
      )

    if (error) {
      await mutateCheckins(checkins, { revalidate: false })
      setToastMessage('No se pudo guardar, intenta de nuevo')
    }
  }

  async function handleConfirmArchive() {
    if (!confirmArchiveId) return
    setIsArchiving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('habits')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', confirmArchiveId)

    if (!error) {
      await mutateHabits(
        (prev) => prev?.filter((h) => h.id !== confirmArchiveId) ?? [],
        { revalidate: false }
      )
    } else {
      setToastMessage('No se pudo archivar, intenta de nuevo')
    }
    setIsArchiving(false)
    setConfirmArchiveId(null)
  }

  if (isLoading || !habits) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-lg mx-auto px-4 py-8">
          <p className="text-sm text-gray-500">Cargando hábitos...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Hoy</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700"
          >
            Nuevo hábito
          </button>
        </div>

        {habits.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-gray-500 text-sm">No tienes hábitos activos.</p>
            <Link href="/archivados" className="text-sm text-violet-600 hover:text-violet-800 font-medium">
              Ver archivados
            </Link>
          </div>
        )}

        <ul className="flex flex-col gap-4">
          {habits.map((habit) => {
            const checkin = checkins?.find((c) => c.habit_id === habit.id)
            const isDone = checkin?.done ?? false
            return (
              <li
                key={habit.id}
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm gap-3"
              >
                <Link href={`/habito/${habit.id}`} className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-gray-900">{habit.name}</p>
                  {habit.description && (
                    <p className="text-sm text-gray-500">{habit.description}</p>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={() => setConfirmArchiveId(habit.id)}
                  className="text-xs text-gray-400 hover:text-gray-600 shrink-0"
                  aria-label={`Archivar ${habit.name}`}
                >
                  Archivar
                </button>
                <ToggleCheck
                  done={isDone}
                  onToggle={() => handleToggle(habit)}
                />
              </li>
            )
          })}
        </ul>

        {showForm && (
          <HabitForm
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              mutateHabits()
              setShowForm(false)
            }}
          />
        )}

        {confirmArchiveId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="rounded-2xl bg-white p-8 max-w-sm w-full mx-4 flex flex-col gap-4">
              <h2 className="text-base font-semibold text-gray-900">¿Archivar hábito?</h2>
              <p className="text-sm text-gray-600">
                El hábito se moverá a tus archivados y dejará de aparecer en tu lista diaria.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmArchiveId(null)}
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmArchive}
                  disabled={isArchiving}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50"
                >
                  {isArchiving ? 'Archivando...' : 'Sí, archivar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {toastMessage && (
          <Toast
            message={toastMessage}
            type="error"
            onClose={() => setToastMessage(null)}
          />
        )}
      </main>
    </div>
  )
}
