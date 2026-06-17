'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mutate } from 'swr'
import Header from '@/components/Header'
import HabitForm from '@/components/HabitForm'

export default function OnboardingPage() {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-lg mx-auto px-4 py-16 flex flex-col items-center gap-8">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenido a Habit Tracker
          </h1>
          <p className="text-lg text-gray-900">
            Construye hábitos duraderos registrando tu progreso día a día.
            Empieza con un solo hábito y crece desde ahí.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700"
        >
          Crear tu primer hábito
        </button>
      </main>

      {showForm && (
        <HabitForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            mutate('habits-active', undefined, { revalidate: false })
            router.push('/')
          }}
        />
      )}
    </div>
  )
}
