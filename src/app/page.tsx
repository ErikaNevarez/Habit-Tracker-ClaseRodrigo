'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
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

const HABITS_KEY = 'habits-active'

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

export default function HomePage() {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  const { data: habits, isLoading, mutate } = useSWR<Habit[]>(
    HABITS_KEY,
    fetchActiveHabits
  )

  useEffect(() => {
    if (!isLoading && habits && habits.length === 0) {
      router.replace('/onboarding')
    }
  }, [habits, isLoading, router])

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
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Nuevo hábito
          </button>
        </div>

        <ul className="flex flex-col gap-4">
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
            >
              <div>
                <p className="text-lg font-semibold text-gray-900">{habit.name}</p>
                {habit.description && (
                  <p className="text-sm text-gray-500">{habit.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {showForm && (
          <HabitForm
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              mutate()
              setShowForm(false)
            }}
          />
        )}
      </main>
    </div>
  )
}
