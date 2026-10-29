'use client';

import { Menu, Search, Bell, ChevronDown, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { roles, currentUser, type Role } from './data';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  role: Role;
  onSetRole: (r: Role) => void;
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
}

export function Topbar({ title, subtitle, role, onSetRole, onOpenSearch, onOpenMobileNav }: Props) {
  const [notifOpen, setNotifOpen] = useState(false);
  const currentRole = roles.find((r) => r.id === role)!;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenMobileNav} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold leading-tight md:text-lg">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground md:text-sm">{subtitle}</p>}
      </div>

      <Button variant="outline" onClick={onOpenSearch} className="hidden h-9 gap-2 px-3 text-sm text-muted-foreground sm:flex">
        <Search className="h-4 w-4" />
        <span className="hidden lg:inline">Search…</span>
        <kbd className="ml-1 hidden items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium lg:inline-flex">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </Button>
      <Button variant="ghost" size="icon" className="sm:hidden" onClick={onOpenSearch} aria-label="Search">
        <Search className="h-4.5 w-4.5" />
      </Button>

      <ThemeToggle />

      <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            <Badge variant="secondary" className="text-[10px]">5 new</Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
            <span className="text-sm font-medium">No notifications yet</span>
            <span className="text-xs text-muted-foreground">Activity will appear here as you use the platform</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="hidden h-9 gap-2 px-2 md:flex">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
              {currentRole.label[0]}
            </span>
            <span className="text-xs font-medium">{currentRole.label}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Switch role (demo)</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {roles.map((r) => (
            <DropdownMenuItem key={r.id} onClick={() => onSetRole(r.id as Role)} className={cn('flex items-center justify-between', role === r.id && 'bg-accent')}>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{r.label}</span>
                <span className="text-[10px] text-muted-foreground">{r.swahili}</span>
              </div>
              {role === r.id && <span className="text-xs text-primary">●</span>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="h-9 w-9 border">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {currentUser.avatar}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{currentUser.name}</span>
              <span className="text-[11px] text-muted-foreground">{currentUser.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>My Profile</DropdownMenuItem>
          <DropdownMenuItem>Sessions & Devices</DropdownMenuItem>
          <DropdownMenuItem>Two-factor (TOTP)</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-rose-600 dark:text-rose-400">Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}