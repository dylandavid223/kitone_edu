'use client';

import { SunMoon, Sun, Moon, Monitor, Check, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme, type ThemeMode } from './theme-provider';

const modes: { id: ThemeMode; label: string; icon: LucideIcon; desc: string }[] = [
  { id: 'light',  label: 'Light',  icon: Sun,     desc: 'Bright background' },
  { id: 'dark',   label: 'Dark',   icon: Moon,    desc: 'Low-light friendly' },
  { id: 'system', label: 'System', icon: Monitor, desc: 'Follow device' },
];

export function ThemeToggle() {
  const { appearance, setMode } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Appearance">
          <SunMoon className="h-4.5 w-4.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {modes.map((m) => {
          const Icon = m.icon;
          const active = appearance.mode === m.id;
          return (
            <DropdownMenuItem key={m.id} onClick={() => setMode(m.id)} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>
                  <span className="block text-sm font-medium leading-tight">{m.label}</span>
                  <span className="block text-[10px] text-muted-foreground leading-tight">{m.desc}</span>
                </span>
              </span>
              {active && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <p className="px-2 py-1 text-[10px] text-muted-foreground">
          Customize colors &amp; more in <span className="font-medium text-foreground">Settings → Appearance</span>
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}