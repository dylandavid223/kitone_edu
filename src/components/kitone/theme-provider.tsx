'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ColorPreset {
  id: string;
  name: string;
  swatch: string;       // hex for the picker UI
  hue: number;          // oklch hue
  chroma: number;       // oklch chroma
  lightFg: 'white' | 'dark'; // foreground in light mode (amber/orange need dark text)
}

export const colorPresets: ColorPreset[] = [
  { id: 'emerald', name: 'Emerald', swatch: '#10b981', hue: 158, chroma: 0.16, lightFg: 'white' },
  { id: 'teal',    name: 'Teal',    swatch: '#14b8a6', hue: 200, chroma: 0.12, lightFg: 'white' },
  { id: 'green',   name: 'Forest',  swatch: '#22c55e', hue: 145, chroma: 0.15, lightFg: 'white' },
  { id: 'amber',   name: 'Amber',   swatch: '#f59e0b', hue: 70,  chroma: 0.16, lightFg: 'dark'  },
  { id: 'orange',  name: 'Orange',  swatch: '#f97316', hue: 55,  chroma: 0.17, lightFg: 'dark'  },
  { id: 'rose',    name: 'Rose',    swatch: '#f43f5e', hue: 15,  chroma: 0.20, lightFg: 'white' },
  { id: 'violet',  name: 'Violet',  swatch: '#a855f7', hue: 305, chroma: 0.18, lightFg: 'white' },
  { id: 'cyan',    name: 'Cyan',    swatch: '#06b6d4', hue: 220, chroma: 0.10, lightFg: 'white' },
];

export interface Appearance {
  mode: ThemeMode;
  colorId: string;
  radius: number;     // rem (0.3 – 1.0)
  fontScale: number;  // multiplier (0.9 – 1.1)
}

const DEFAULTS: Appearance = {
  mode: 'system',
  colorId: 'emerald',
  radius: 0.625,
  fontScale: 1,
};

const STORAGE_KEY = 'kitone-appearance';

interface ThemeContextValue {
  appearance: Appearance;
  resolvedDark: boolean;
  setMode: (m: ThemeMode) => void;
  setColor: (id: string) => void;
  setRadius: (r: number) => void;
  setFontScale: (s: number) => void;
  reset: () => void;
  cycleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStored(): Appearance {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function systemPrefersDarkInitial(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearance] = useState<Appearance>(readStored);
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(systemPrefersDarkInitial);

  // Listen for OS theme changes (only matters when mode === 'system').
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const resolvedDark =
    appearance.mode === 'system' ? systemPrefersDark : appearance.mode === 'dark';

  // Sync everything to the DOM (external system) whenever appearance/system changes.
  useEffect(() => {
    const root = document.documentElement;
    const isDark = resolvedDark;
    root.classList.toggle('dark', isDark);

    const preset = colorPresets.find((p) => p.id === appearance.colorId) ?? colorPresets[0];
    const h = preset.hue;
    const ch = preset.chroma;
    const L = isDark ? '0.70' : '0.60';

    root.style.setProperty('--primary', `oklch(${L} ${ch} ${h})`);
    root.style.setProperty('--primary-foreground',
      isDark
        ? `oklch(0.15 0.02 ${h})`
        : preset.lightFg === 'dark'
          ? `oklch(0.20 0.02 ${h})`
          : `oklch(0.99 0.005 ${h})`);
    root.style.setProperty('--ring', `oklch(${L} ${ch} ${h})`);
    root.style.setProperty('--sidebar-primary', `oklch(${L} ${ch} ${h})`);
    root.style.setProperty('--sidebar-ring', `oklch(${L} ${ch} ${h})`);

    root.style.setProperty('--radius', `${appearance.radius}rem`);
    root.style.fontSize = `${Math.round(appearance.fontScale * 100)}%`;
  }, [appearance, resolvedDark]);

  // Persist to localStorage.
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(appearance)); } catch {}
  }, [appearance]);

  const setMode      = useCallback((mode: ThemeMode) => setAppearance((a) => ({ ...a, mode })), []);
  const setColor     = useCallback((colorId: string) => setAppearance((a) => ({ ...a, colorId })), []);
  const setRadius    = useCallback((radius: number) => setAppearance((a) => ({ ...a, radius })), []);
  const setFontScale = useCallback((fontScale: number) => setAppearance((a) => ({ ...a, fontScale })), []);
  const reset        = useCallback(() => setAppearance(DEFAULTS), []);
  const cycleMode    = useCallback(() => {
    setAppearance((a) => {
      const order: ThemeMode[] = ['light', 'dark', 'system'];
      const idx = order.indexOf(a.mode);
      return { ...a, mode: order[(idx + 1) % order.length] };
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{ appearance, resolvedDark, setMode, setColor, setRadius, setFontScale, reset, cycleMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}