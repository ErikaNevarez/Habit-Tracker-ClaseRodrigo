'use client'

interface ToggleCheckProps {
  done: boolean
  disabled?: boolean
  onToggle: () => void
}

export default function ToggleCheck({ done, disabled = false, onToggle }: ToggleCheckProps) {
  const baseClasses = 'h-6 w-6 rounded-full border-2 transition-colors'

  const stateClasses = done
    ? 'border-emerald-500 bg-emerald-500'
    : 'border-gray-300 bg-white'

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  return (
    <button
      type="button"
      aria-label={done ? 'Marcar como no hecho' : 'Marcar como hecho'}
      aria-pressed={done}
      disabled={disabled}
      onClick={disabled ? undefined : onToggle}
      className={`${baseClasses} ${stateClasses} ${disabledClasses}`}
    />
  )
}
