'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EmptyState } from '../empty-state';
import { useInstitution, formatKES } from '../institution-store';
import { Users, CalendarCheck, Wallet, Book, Megaphone, ClipboardList, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '../data';

interface Props { role: Role; onNavigate: (v: string) => void; }

export function Dashboard({ role, onNavigate }: Props) {
  const { data } = useInstitution();
  const info = data.info!;
  const totalStudents = data.students.length;
  const activeClasses = data.classes.length;
  const totalStaff = data.staff.length;
  const collected = data.payments.reduce((s, p) => s + p.amount, 0);
  const outstanding = data.invoices.reduce((s, i) => s + (i.amount - i.paid), 0);
  const avgAttendance = totalStudents > 0 ? Math.round(data.students.reduce((s, st) => s + st.attendance, 0) / totalStudents) : 0;

  const kpis = [
    { label: 'Total Students', value: totalStudents.toLocaleString(), sub: `${activeClasses} classes`, icon: Users, trend: 'Manage in SIS', tone: 'bg-emerald-500/10 text-emerald-600' },
    { label: 'Attendance Rate', value: `${avgAttendance}%`, sub: 'Average across all', icon: CalendarCheck, trend: 'Mark attendance daily', tone: 'bg-teal-500/10 text-teal-600' },
    { label: 'Fees Collected', value: formatKES(collected), sub: `${formatKES(outstanding)} outstanding`, icon: Wallet, trend: 'M-PESA auto-reconciled', tone: 'bg-amber-500/10 text-amber-600' },
    { label: 'Staff & Subjects', value: `${totalStaff} / ${data.subjects.length}`, sub: 'Teachers & subjects', icon: Book, trend: 'Configure in Settings', tone: 'bg-violet-500/10 text-violet-600' },
  ];

  const isEmpty = totalStudents === 0 && activeClasses === 0 && data.invoices.length === 0;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/20">
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2"><Badge className="bg-primary/15 text-primary hover:bg-primary/15 border-0">{info.term}</Badge><Badge variant="outline" className="text-[11px]">{info.curriculum}</Badge></div>
              <h2 className="mt-2 text-xl font-bold tracking-tight md:text-2xl">Karibu, {info.name} 👋</h2>
              <p className="mt-1 text-sm text-muted-foreground">{info.location} · {info.type} · {info.academicYear}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => onNavigate('attendance')}><CalendarCheck className="mr-1.5 h-4 w-4" /> Mark Attendance</Button>
              <Button size="sm" variant="outline" onClick={() => onNavigate('assessments')}><ClipboardList className="mr-1.5 h-4 w-4" /> New Test</Button>
              <Button size="sm" variant="outline" onClick={() => onNavigate('communications')}><Megaphone className="mr-1.5 h-4 w-4" /> Announce</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => { const Icon = k.icon; return (
          <Card key={k.label} className="relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{k.label}</p><p className="mt-1.5 text-2xl font-bold tracking-tight">{k.value}</p>{k.sub && <p className="mt-0.5 text-xs text-muted-foreground truncate">{k.sub}</p>}{k.trend && <p className="mt-2 text-xs font-medium text-foreground/70">{k.trend}</p>}</div>
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', k.tone)}><Icon className="h-5 w-5" /></div>
              </div>
            </CardContent>
          </Card>
        ); })}
      </div>

      {isEmpty ? (
        <EmptyState icon={Sparkles} title="Start populating your institution" description="Add students, schedule assessments, and record attendance to see live charts and analytics here." action={{ label: 'Go to Students', onClick: () => onNavigate('students') }} />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0"><div><CardTitle className="text-base">Overview</CardTitle><CardDescription>This term · live data</CardDescription></div><Button size="sm" variant="ghost" onClick={() => onNavigate('analytics')}>Full analytics <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button></CardHeader>
            <CardContent className="space-y-4">
              {[{ label: 'Students enrolled', value: totalStudents, max: Math.max(totalStudents, 100), tone: 'bg-emerald-500' }, { label: 'Active classes', value: activeClasses, max: Math.max(activeClasses, 20), tone: 'bg-teal-500' }, { label: 'Staff members', value: totalStaff, max: Math.max(totalStaff, 20), tone: 'bg-amber-500' }, { label: 'Subjects offered', value: data.subjects.length, max: Math.max(data.subjects.length, 10), tone: 'bg-violet-500' }, { label: 'Invoices issued', value: data.invoices.length, max: Math.max(data.invoices.length, 20), tone: 'bg-cyan-500' }].map((s) => (
                <div key={s.label}><div className="flex items-center justify-between text-xs mb-1"><span className="font-medium">{s.label}</span><span className="text-muted-foreground">{s.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={cn('h-full rounded-full', s.tone)} style={{ width: `${Math.min(100, (s.value / s.max) * 100)}%` }} /></div></div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle><CardDescription>Latest records</CardDescription></CardHeader>
            <CardContent className="space-y-2">
              {data.payments.slice(0, 3).map((p) => (<div key={p.id} className="flex items-center gap-2 rounded-lg border p-2"><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600"><Wallet className="h-3.5 w-3.5" /></div><div className="min-w-0 flex-1"><p className="truncate text-xs">{p.studentName} paid {formatKES(p.amount)}</p><p className="text-[10px] text-muted-foreground">{p.method} · {p.code}</p></div></div>))}
              {data.students.slice(0, 3).map((s) => (<div key={s.id} className="flex items-center gap-2 rounded-lg border p-2"><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary"><Users className="h-3.5 w-3.5" /></div><div className="min-w-0 flex-1"><p className="truncate text-xs">{s.name} enrolled</p><p className="text-[10px] text-muted-foreground">{s.admissionNo} · {s.grade}</p></div></div>))}
              {data.payments.length === 0 && data.students.length === 0 && <p className="py-4 text-center text-xs text-muted-foreground">No activity yet.</p>}
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button variant="outline" onClick={() => onNavigate('students')} className="justify-start"><Users className="mr-2 h-4 w-4" /> Add student</Button>
          <Button variant="outline" onClick={() => onNavigate('attendance')} className="justify-start"><CalendarCheck className="mr-2 h-4 w-4" /> Take attendance</Button>
          <Button variant="outline" onClick={() => onNavigate('assessments')} className="justify-start"><ClipboardList className="mr-2 h-4 w-4" /> Create test</Button>
          <Button variant="outline" onClick={() => onNavigate('classrooms')} className="justify-start"><Book className="mr-2 h-4 w-4" /> Schedule class</Button>
        </CardContent>
      </Card>
    </div>
  );
}