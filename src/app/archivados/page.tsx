'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
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

const ARCHIVED_KEY = 'habits-archived'

async function fetchArchivedHabits(): Promise<Habit[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .not('archived_at', 'is', null)
    .order('archived_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export default function ArchivadosPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const { data: habits, isLoading, mutate } = useSWR<Habit[]>(
    ARCHIVED_KEY,
    fetchArchivedHabits
  )

  async function handleDesarchivar(habit: Habit) {
    const supabase = createClient()
    const { error } = await supabase
      .from('habits')
      .update({ archived_at: null })
      .eq('id', habit.id)

    if (error) {
      setToastMessage('No se pudo guardar, intenta de nuevo')
      return
    }

    await mutate(
      (current) => current?.filter((h) => h.id !== habit.id) ?? [],
      { revalidate: false }
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Archivados</h1>

        {isLoading && (
          <p className="text-sm text-gray-500">Cargando hábitos archivados...</p>
        )}

        {!isLoading && habits && habits.length === 0 && (
          <p className="text-sm text-gray-500">No hay hábitos archivados.</p>
        )}

        {!isLoading && habits && habits.length > 0 && (
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
                  <span className="inline-block rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600 mt-1">
                    Archivado
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDesarchivar(habit)}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Desarchivar
                </button>
              </li>
            ))}
          </ul>
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
