'use client';

interface ToastProps {
  message: string;
  type: 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-gray-900 text-white text-sm px-4 py-2 shadow-lg flex items-center gap-2"
    >
      <span>{message}</span>
      <button
        type="button"
        aria-label="Cerrar notificación"
        onClick={onClose}
        className="ml-2 text-white opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
