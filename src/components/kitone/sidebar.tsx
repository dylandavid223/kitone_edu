'use client';

import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Table2,
  Wallet,
  ClipboardList,
  Video,
  BarChart3,
  MessageSquare,
  Settings,
  GraduationCap,
  ChevronLeft,
  X,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { institution } from './data';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export type ViewId =
  | 'dashboard'
  | 'students'
  | 'attendance'
  | 'gradebook'
  | 'fees'
  | 'assessments'
  | 'classrooms'
  | 'analytics'
  | 'communications'
  | 'settings';

const navGroups: { label: string; items: { id: ViewId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] }[] = [
  {
    label: 'Academic',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'students', label: 'Students', icon: Users, badge: '1.2K' },
      { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
      { id: 'gradebook', label: 'Gradebook', icon: Table2 },
      { id: 'assessments', label: 'Assessments', icon: ClipboardList, badge: 'Live' },
      { id: 'classrooms', label: 'Classrooms', icon: Video },
    ],
  },
  {
    label: 'Finance',
    items: [{ id: 'fees', label: 'Fees & Payments', icon: Wallet }],
  },
  {
    label: 'Engagement',
    items: [
      { id: 'communications', label: 'Communications', icon: MessageSquare },
      { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    ],
  },
  {
    label: 'System',
    items: [{ id: 'settings', label: 'Settings', icon: Settings }],
  },
];

interface Props {
  active: ViewId;
  onNavigate: (v: ViewId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({
  active,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: Props) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          'flex flex-col border-r bg-sidebar text-sidebar-foreground transition-[width,transform] duration-200',
          // Desktop width
          collapsed ? 'md:w-[72px]' : 'md:w-[260px]',
          // Mobile: fixed drawer translated off-screen when closed; Desktop: static
          'fixed inset-y-0 left-0 z-50 w-[280px] -translate-x-full md:static md:translate-x-0 md:w-auto',
          mobileOpen && 'translate-x-0'
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-2.5 border-b px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-tight">Kitone Edu</p>
              <p className="truncate text-[11px] text-muted-foreground leading-tight">Alliance High</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden md:inline-flex h-8 w-8"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8 md:hidden"
            onClick={onMobileClose}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tenant chip */}
        {!collapsed && (
          <div className="mx-3 mt-3 rounded-lg border bg-card p-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-emerald-500/15 text-emerald-600 text-xs font-bold">
                  AH
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{institution.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">{institution.term}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                {institution.plan}
              </span>
              <span className="text-[10px] text-muted-foreground">{institution.curriculum}</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="kitone-scroll flex-1 overflow-y-auto px-2 py-3">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-3">
              {!collapsed && (
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = active === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        onMobileClose();
                      }}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        collapsed && 'justify-center px-2',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <span
                          className={cn(
                            'rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                            item.badge === 'Live'
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 kitone-live-dot'
                              : isActive
                                ? 'bg-primary-foreground/20 text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer mini */}
        {!collapsed && (
          <div className="border-t p-3">
            <p className="text-[10px] text-muted-foreground leading-tight">
              v2.4.0 · EAT
              <br />
              DPA 2019 compliant
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
