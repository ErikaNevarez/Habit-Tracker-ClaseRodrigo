'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Toast from '@/components/Toast'

export default function ResetPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'request' | 'update'>('request')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('update')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setToast(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset`,
    })

    setLoading(false)

    if (error) {
      setToast(error.message)
      return
    }

    setSubmitted(true)
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setToast(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setToast(error.message)
      return
    }

    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {mode === 'request' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Recuperar contraseña
            </h1>

            {submitted ? (
              <p className="text-sm text-gray-700">
                Revisa tu bandeja de entrada
              </p>
            ) : (
              <form onSubmit={handleRequest} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar instrucciones'}
                </button>
              </form>
            )}
          </>
        )}

        {mode === 'update' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Nueva contraseña
            </h1>

            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña nueva
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </form>
          </>
        )}

      </div>

      {toast && (
        <Toast
          message={toast}
          type="error"
          onClose={() => setToast(null)}
        />
      )}
    </main>
  )
}
