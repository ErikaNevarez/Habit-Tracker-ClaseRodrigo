'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Toast from '@/components/Toast';

export default function Header() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push('/login');
  }

  return (
    <header className="w-full bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <span className="text-sm font-semibold text-gray-900">Habit Tracker</span>

      <button
        type="button"
        onClick={handleSignOut}
        className="text-sm text-gray-500 hover:text-gray-900"
      >
        Cerrar sesión
      </button>

      {errorMessage !== null && (
        <Toast
          message={errorMessage}
          type="error"
          onClose={() => setErrorMessage(null)}
        />
      )}
    </header>
  );
}
