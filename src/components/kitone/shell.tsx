'use client';

import { useState, useEffect } from 'react';
import { Sidebar, type ViewId } from './sidebar';
import { Topbar } from './topbar';
import { ThemeToggle } from './theme-toggle';
import { CommandPalette } from './command-palette';
import { Dashboard } from './modules/dashboard';
import { StudentsModule } from './modules/students';
import { AttendanceModule } from './modules/attendance';
import { GradebookModule } from './modules/gradebook';
import { FeesModule } from './modules/fees';
import { AssessmentsModule } from './modules/assessments';
import { ClassroomsModule } from './modules/classrooms';
import { AnalyticsModule } from './modules/analytics';
import { CommunicationsModule } from './modules/communications';
import { SettingsModule } from './modules/settings';
import { type Role } from './data';

const viewMeta: Record<ViewId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Institution overview · Term 2 · 2025' },
  students: { title: 'Students', subtitle: 'Student Information System · 1,247 enrolled' },
  attendance: { title: 'Attendance', subtitle: 'Roll call · mobile-first · offline-ready' },
  gradebook: { title: 'Gradebook', subtitle: 'CBC performance · weight-based aggregation' },
  fees: { title: 'Fees & Payments', subtitle: 'M-PESA Daraja · auto-reconciliation' },
  assessments: { title: 'Assessments', subtitle: 'Online tests · question bank · anti-cheat' },
  classrooms: { title: 'Online Classrooms', subtitle: 'Live sessions · chat · recordings' },
  analytics: { title: 'Analytics & Reports', subtitle: 'Role-aware dashboards · exportable' },
  communications: { title: 'Communications', subtitle: 'Announcements · messaging · SMS via Africa\'s Talking' },
  settings: { title: 'Settings', subtitle: 'Institution · roles · curriculum · integrations' },
};

const roleSubtitle: Partial<Record<Role, string>> = {
  teacher: 'Teacher view · Mrs. Grace Wambui',
  finance: 'Finance Officer view · Mrs. Lucy Njoroge',
  parent: 'Parent view · Peter Kamau (2 children)',
  student: 'Student view · Wanjiru Kamau · Grade 9 East',
};

export function KitoneShell() {
  const [view, setView] = useState<ViewId>('dashboard');
  const [role, setRole] = useState<Role>('admin');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 350);
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', handler);
    };
  }, []);

  function toggleTheme() {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('kitone-theme', next ? 'dark' : 'light');
  }

  const meta = viewMeta[view];
  const subtitle = role === 'admin' ? meta.subtitle : (roleSubtitle[role] ?? meta.subtitle);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1">
        <Sidebar
          active={view}
          onNavigate={setView}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            title={meta.title}
            subtitle={subtitle}
            role={role}
            onSetRole={setRole}
            onOpenSearch={() => setCmdOpen(true)}
            onOpenMobileNav={() => setMobileOpen(true)}
          />
          <main className="flex-1 p-4 md:p-6">
            {!loaded ? (
              <ShellSkeleton />
            ) : (
              <div key={view} className="animate-in fade-in duration-300">
                {view === 'dashboard' && <Dashboard role={role} onNavigate={(v) => setView(v as ViewId)} />}
                {view === 'students' && <StudentsModule />}
                {view === 'attendance' && <AttendanceModule />}
                {view === 'gradebook' && <GradebookModule />}
                {view === 'fees' && <FeesModule />}
                {view === 'assessments' && <AssessmentsModule />}
                {view === 'classrooms' && <ClassroomsModule />}
                {view === 'analytics' && <AnalyticsModule />}
                {view === 'communications' && <CommunicationsModule />}
                {view === 'settings' && <SettingsModule />}
              </div>
            )}
          </main>
          <footer className="mt-auto border-t bg-card px-4 py-3 md:px-6">
            <div className="flex flex-col items-center justify-between gap-2 text-[11px] text-muted-foreground sm:flex-row">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>© 2025 Kitone Edu</span>
                <span className="hidden sm:inline">·</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Kenya DPA 2019 compliant</span>
                <span className="hidden md:inline">·</span>
                <span className="hidden md:inline">Region: Nairobi (EAT)</span>
              </div>
              <div className="flex items-center gap-3">
                <span>v2.4.0</span>
                <span className="hidden sm:inline">·</span>
                <a className="hover:text-foreground cursor-pointer">Privacy</a>
                <a className="hover:text-foreground cursor-pointer">Terms</a>
                <a className="hover:text-foreground cursor-pointer">Support</a>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <CommandPalette
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        onNavigate={(v) => setView(v as ViewId)}
        onSetRole={setRole}
        onToggleTheme={toggleTheme}
        onQuick={() => {}}
      />
    </div>
  );
}

function ShellSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-lg bg-muted" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="h-64 animate-pulse rounded-lg bg-muted lg:col-span-2" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}
