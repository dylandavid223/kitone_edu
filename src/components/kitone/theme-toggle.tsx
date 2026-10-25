'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

function getInitialDark(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('kitone-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return stored ? stored === 'dark' : prefersDark;
}

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(getInitialDark);

  // Sync the DOM class whenever `dark` changes (external system sync).
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem('kitone-theme', next ? 'dark' : 'light');
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {dark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
    </Button>
  );
}
