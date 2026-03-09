'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const stored = window.localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initial: Theme = stored || (systemPrefersDark ? 'dark' : 'light');
    root.classList.toggle('dark', initial === 'dark');
    setTheme(initial);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    root.classList.toggle('dark', next === 'dark');
    window.localStorage.setItem('theme', next);
    setTheme(next);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Chuyển giao diện sáng/tối"
        className="p-2 rounded-full border border-ink-200 bg-ink-50 text-ink-600 text-xs md:text-sm"
      >
        ...
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-ink-200 bg-white/80 text-xs md:text-sm text-ink-700 hover:bg-ink-100 dark:bg-ink-800/80 dark:border-ink-600 dark:text-ink-100 dark:hover:bg-ink-700 transition"
    >
      {isDark ? (
        <>
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-300" />
          <span>Light</span>
        </>
      ) : (
        <>
          <span className="inline-block w-3 h-3 rounded-full bg-ink-700" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
}

