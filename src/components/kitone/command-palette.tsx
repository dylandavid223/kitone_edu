'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
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
  UserCog,
  SunMoon,
  Bell,
  FilePlus,
} from 'lucide-react';
import { roles, type Role } from './data';

export interface CommandAction {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  run: () => void;
  group: string;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onNavigate: (view: string) => void;
  onSetRole: (r: Role) => void;
  onCycleTheme: () => void;
  onQuick: (action: string) => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onNavigate,
  onSetRole,
  onCycleTheme,
  onQuick,
}: Props) {
  const nav: CommandAction[] = [
    { id: 'dashboard', label: 'Go to Dashboard', hint: 'Overview', icon: <LayoutDashboard className="h-4 w-4" />, run: () => onNavigate('dashboard'), group: 'Navigate' },
    { id: 'students', label: 'Go to Students', hint: 'SIS', icon: <Users className="h-4 w-4" />, run: () => onNavigate('students'), group: 'Navigate' },
    { id: 'attendance', label: 'Go to Attendance', hint: 'Roll call', icon: <CalendarCheck className="h-4 w-4" />, run: () => onNavigate('attendance'), group: 'Navigate' },
    { id: 'gradebook', label: 'Go to Gradebook', hint: 'Scores', icon: <Table2 className="h-4 w-4" />, run: () => onNavigate('gradebook'), group: 'Navigate' },
    { id: 'fees', label: 'Go to Fees & Payments', hint: 'M-PESA', icon: <Wallet className="h-4 w-4" />, run: () => onNavigate('fees'), group: 'Navigate' },
    { id: 'assessments', label: 'Go to Assessments', hint: 'Tests', icon: <ClipboardList className="h-4 w-4" />, run: () => onNavigate('assessments'), group: 'Navigate' },
    { id: 'classrooms', label: 'Go to Classrooms', hint: 'Live sessions', icon: <Video className="h-4 w-4" />, run: () => onNavigate('classrooms'), group: 'Navigate' },
    { id: 'analytics', label: 'Go to Analytics', hint: 'Reports', icon: <BarChart3 className="h-4 w-4" />, run: () => onNavigate('analytics'), group: 'Navigate' },
    { id: 'communications', label: 'Go to Communications', hint: 'SMS & messages', icon: <MessageSquare className="h-4 w-4" />, run: () => onNavigate('communications'), group: 'Navigate' },
    { id: 'settings', label: 'Go to Settings', hint: 'Tenant config', icon: <Settings className="h-4 w-4" />, run: () => onNavigate('settings'), group: 'Navigate' },
  ];

  const actions: CommandAction[] = [
    { id: 'new-invoice', label: 'New Invoice', hint: 'Fees', icon: <FilePlus className="h-4 w-4" />, run: () => onQuick('new-invoice'), group: 'Quick actions' },
    { id: 'mark-attendance', label: 'Mark Attendance', hint: 'Roll call', icon: <CalendarCheck className="h-4 w-4" />, run: () => onNavigate('attendance'), group: 'Quick actions' },
    { id: 'create-test', label: 'Create Test', hint: 'Assessments', icon: <ClipboardList className="h-4 w-4" />, run: () => onNavigate('assessments'), group: 'Quick actions' },
    { id: 'announce', label: 'Send Announcement', hint: 'Communications', icon: <Bell className="h-4 w-4" />, run: () => onNavigate('communications'), group: 'Quick actions' },
  ];

  const roleActions: CommandAction[] = roles.map((r) => ({
    id: `role-${r.id}`,
    label: `Switch to ${r.label}`,
    hint: r.swahili,
    icon: <UserCog className="h-4 w-4" />,
    run: () => onSetRole(r.id as Role),
    group: 'Switch role',
  }));

  const themeActions: CommandAction[] = [
    {
      id: 'theme-cycle',
      label: 'Cycle theme',
      hint: 'Light / Dark / System',
      icon: <SunMoon className="h-4 w-4" />,
      run: onCycleTheme,
      group: 'System',
    },
  ];

  const grouped: { group: string; items: CommandAction[] }[] = [
    { group: 'Quick actions', items: actions },
    { group: 'Navigate', items: nav },
    { group: 'Switch role', items: roleActions },
    { group: 'System', items: themeActions },
  ];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList className="kitone-scroll">
        <CommandEmpty>No results found.</CommandEmpty>
        {grouped.map((g) => (
          <div key={g.group}>
            <CommandGroup heading={g.group}>
              {g.items.map((it) => (
                <CommandItem
                  key={it.id}
                  value={`${it.label} ${it.hint}`}
                  onSelect={() => {
                    onOpenChange(false);
                    it.run();
                  }}
                  className="cursor-pointer"
                >
                  {it.icon}
                  <span className="flex-1">{it.label}</span>
                  <span className="text-xs text-muted-foreground">{it.hint}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}