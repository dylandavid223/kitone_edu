'use client';

import { useState, useEffect } from 'react';
import { Sidebar, type ViewId } from './sidebar';
import { Topbar } from './topbar';
import { CommandPalette } from './command-palette';
import { useTheme } from './theme-provider';
import { useInstitution } from './institution-store';
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
  dashboard: { title: 'Dashboard', subtitle: 'Institution overview' },
  students: { title: 'Students', subtitle: 'Student Information System' },
  attendance: { title: 'Attendance', subtitle: 'Roll call · mobile-first · offline-ready' },
  gradebook: { title: 'Gradebook', subtitle: 'CBC performance · weight-based aggregation' },
  fees: { title: 'Fees & Payments', subtitle: 'M-PESA Daraja · auto-reconciliation' },
  assessments: { title: 'Assessments', subtitle: 'Online tests · question bank · anti-cheat' },
  classrooms: { title: 'Online Classrooms', subtitle: 'Live sessions · real-time chat & presence' },
  analytics: { title: 'Analytics & Reports', subtitle: 'Role-aware dashboards · exportable' },
  communications: { title: 'Communications', subtitle: 'Announcements · messaging · SMS' },
  settings: { title: 'Settings', subtitle: 'Institution · roles · curriculum · integrations' },
};

export function KitoneShell() {
  const { data } = useInstitution();
  const [view, setView] = useState<ViewId>('dashboard');
  const [role, setRole] = useState<Role>('admin');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { cycleMode } = useTheme();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 350);
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => { clearTimeout(t); window.removeEventListener('keydown', handler); };
  }, []);

  const meta = viewMeta[view];
  const subtitle = `${meta.subtitle} · ${data.info?.term ?? ''}`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1">
        <Sidebar active={view} onNavigate={setView} collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar title={meta.title} subtitle={subtitle} role={role} onSetRole={setRole} onOpenSearch={() => setCmdOpen(true)} onOpenMobileNav={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 md:p-6">
            {!loaded ? (
              <div className="space-y-4">
                <div className="h-24 animate-pulse rounded-lg bg-muted" />
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />)}</div>
              </div>
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
                <span>© 2026 Kitone Edu</span>
                <span className="hidden sm:inline">·</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Kenya DPA 2019 compliant</span>
              </div>
              <div className="flex items-center gap-3">
                <span>v2.5.0</span>
                <span className="hidden sm:inline">·</span>
                <a className="hover:text-foreground cursor-pointer">Privacy</a>
                <a className="hover:text-foreground cursor-pointer">Terms</a>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} onNavigate={(v) => setView(v as ViewId)} onSetRole={setRole} onCycleTheme={cycleMode} onQuick={() => {}} />
    </div>
  );
}