'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface InitialValues {
  id: string
  name: string
  description: string | null
  frequency: 'daily' | 'weekly'
  target_per_week: number | null
}

interface HabitFormProps {
  onClose: () => void
  onSuccess: () => void
  initialValues?: InitialValues
}

type Frequency = 'daily' | 'weekly'

export default function HabitForm({ onClose, onSuccess, initialValues }: HabitFormProps) {
  const isEditing = !!initialValues
  const [nombre, setNombre] = useState(initialValues?.name ?? '')
  const [descripcion, setDescripcion] = useState(initialValues?.description ?? '')
  const [frecuencia, setFrecuencia] = useState<Frequency>(initialValues?.frequency ?? 'daily')
  const [targetPerWeek, setTargetPerWeek] = useState<number>(initialValues?.target_per_week ?? 1)
  const [fieldError, setFieldError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): boolean {
    if (nombre.trim().length === 0) {
      setFieldError('El nombre es obligatorio')
      return false
    }
    if (nombre.trim().length > 60) {
      setFieldError('Máximo 60 caracteres')
      return false
    }
    if (descripcion.length > 280) {
      setFieldError('Máximo 280 caracteres para la descripción')
      return false
    }
    if (frecuencia === 'weekly' && (targetPerWeek < 1 || targetPerWeek > 7)) {
      setFieldError('El objetivo semanal debe ser entre 1 y 7')
      return false
    }
    setFieldError('')
    return true
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setFieldError('Error inesperado, intenta de nuevo')
      setIsSubmitting(false)
      return
    }

    const payload = {
      user_id: user.id,
      name: nombre.trim(),
      description: descripcion.trim() || null,
      frequency: frecuencia,
      target_per_week: frecuencia === 'weekly' ? targetPerWeek : null,
    }

    const { error } = isEditing
      ? await supabase.from('habits').update(payload).eq('id', initialValues.id)
      : await supabase.from('habits').insert(payload)

    setIsSubmitting(false)

    if (error) {
      if (error.code === '23505') {
        setFieldError('Ya tienes un hábito activo con ese nombre')
      } else {
        setFieldError('Error inesperado, intenta de nuevo')
      }
      return
    }

    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="rounded-2xl bg-white p-8 max-w-sm w-full">
        <h2 className="text-base font-semibold text-gray-900 mb-6">
          {isEditing ? 'Editar hábito' : 'Nuevo hábito'}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              maxLength={60}
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value)
                if (fieldError) setFieldError('')
              }}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Ej. Leer 20 minutos"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
              Descripción <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              id="descripcion"
              maxLength={280}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="¿Por qué quieres mantener este hábito?"
            />
          </div>

          <fieldset className="flex flex-col gap-1">
            <legend className="text-sm font-medium text-gray-700 mb-1">Frecuencia</legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="frecuencia"
                  value="daily"
                  checked={frecuencia === 'daily'}
                  onChange={() => setFrecuencia('daily')}
                  className="accent-violet-600"
                />
                Diaria
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="frecuencia"
                  value="weekly"
                  checked={frecuencia === 'weekly'}
                  onChange={() => setFrecuencia('weekly')}
                  className="accent-violet-600"
                />
                Semanal
              </label>
            </div>
          </fieldset>

          {frecuencia === 'weekly' && (
            <div className="flex flex-col gap-1">
              <label htmlFor="targetPerWeek" className="text-sm font-medium text-gray-700">
                Objetivo semanal (días)
              </label>
              <input
                id="targetPerWeek"
                type="number"
                min={1}
                max={7}
                value={targetPerWeek}
                onChange={(e) => setTargetPerWeek(Number(e.target.value))}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          )}

          {fieldError && (
            <p role="alert" className="text-sm text-red-500">
              {fieldError}
            </p>
          )}

          <div className="flex items-center justify-end gap-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear hábito'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
