'use client';

import { useEffect, useState } from 'react';

export default function DevtoolsGuard() {
  const [show, setShow] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isDevtoolsShortcut =
        key === 'f12' ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(key)) ||
        (e.metaKey && e.altKey && key === 'i');

      if (!unlocked && isDevtoolsShortcut) {
        e.preventDefault();
        e.stopPropagation();
        setShow(true);
      }
    };

    const contextHandler = (e: MouseEvent) => {
      if (!unlocked) {
        e.preventDefault();
        e.stopPropagation();
        setShow(true);
      }
    };

    window.addEventListener('keydown', keyHandler, { capture: true });
    window.addEventListener('contextmenu', contextHandler, { capture: true });
    return () => {
      window.removeEventListener('keydown', keyHandler, { capture: true } as any);
      window.removeEventListener('contextmenu', contextHandler, { capture: true } as any);
    };
  }, [unlocked]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'budibudian17') {
      setUnlocked(true);
      setShow(false);
      setError('');
    } else {
      setError('Password salah, coba lagi.');
    }
  };

  if (!show || unlocked) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/90 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <h2 className="text-lg font-extrabold text-blue-950">Hayooo mau buka ya?</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          Jangan dulu pliss, mobile responsivenya masih berantakan, nanti aja yak :D
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Password (khusus admin)
            </label>
            <input
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setError('');
              }}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="Masukkan password"
            />
            {error ? <p className="mt-1 text-xs font-medium text-pink-600">{error}</p> : null}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShow(false)}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-pink-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-pink-700"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
