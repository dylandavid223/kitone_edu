'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { EmptyState } from '../empty-state';
import { useInstitution, formatKES } from '../institution-store';
import { FileText, FileSpreadsheet, Layers, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const cbcLevels = [
  { code: 'EE', label: 'Exceeding', tone: 'bg-emerald-500' },
  { code: 'ME', label: 'Meeting', tone: 'bg-teal-500' },
  { code: 'AE', label: 'Approaching', tone: 'bg-amber-500' },
  { code: 'BE', label: 'Below', tone: 'bg-rose-500' },
];

export function AnalyticsModule() {
  const { data } = useInstitution();
  const { toast } = useToast();
  const totalStudents = data.students.length;
  const collected = data.payments.reduce((s, p) => s + p.amount, 0);
  const outstanding = data.invoices.reduce((s, i) => s + (i.amount - i.paid), 0);
  const totalBilled = collected + outstanding;
  const avgAttendance = totalStudents > 0 ? Math.round(data.students.reduce((s, st) => s + st.attendance, 0) / totalStudents) : 0;
  const avgScore = totalStudents > 0 ? Math.round(data.students.reduce((s, st) => s + st.avgScore, 0) / totalStudents) : 0;
  const cbcDist = cbcLevels.map((l) => ({ ...l, count: data.students.filter((s) => s.cbc === l.code).length }));
  const gradeDist = Array.from(new Set(data.classes.map((c) => c.grade))).map((g) => ({ grade: g, count: data.students.filter((s) => s.grade === g).length }));
  const isEmpty = totalStudents === 0 && data.invoices.length === 0;

  if (isEmpty) return <EmptyState icon={BarChart3} title="No data to analyze yet" description="Once you admit students and record payments, attendance, and grades, analytics will appear here." />;

  return (
    <div className="space-y-4">
      <Card><CardContent className="p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold">Reports & Analytics</p><p className="text-xs text-muted-foreground">{data.info?.term} · {data.info?.curriculum}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => toast({ title: 'Generating PDF…' })}><FileText className="mr-1.5 h-4 w-4" /> PDF</Button><Button variant="outline" size="sm" onClick={() => toast({ title: 'Exporting…' })}><FileSpreadsheet className="mr-1.5 h-4 w-4" /> Excel</Button><Button size="sm" onClick={() => toast({ title: 'Custom report builder' })}><Layers className="mr-1.5 h-4 w-4" /> Custom</Button></div></div></CardContent></Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Students</p><p className="text-2xl font-bold">{totalStudents}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Avg Attendance</p><p className="text-2xl font-bold">{avgAttendance}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Avg Score</p><p className="text-2xl font-bold">{avgScore}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Collection Rate</p><p className="text-2xl font-bold">{totalBilled > 0 ? Math.round((collected / totalBilled) * 100) : 0}%</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-base">Students by Grade</CardTitle><CardDescription>Distribution across classes</CardDescription></CardHeader><CardContent className="space-y-3">{gradeDist.length === 0 ? <p className="text-sm text-muted-foreground">No students yet.</p> : gradeDist.map((g) => { const max = Math.max(...gradeDist.map((x) => x.count), 1); return (<div key={g.grade}><div className="flex justify-between text-xs mb-1"><span className="font-medium">{g.grade}</span><span className="text-muted-foreground">{g.count}</span></div><Progress value={(g.count / max) * 100} className="h-2" /></div>); })}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">CBC Performance Spread</CardTitle><CardDescription>Across all students</CardDescription></CardHeader><CardContent className="space-y-3">{cbcDist.map((d) => { const max = Math.max(...cbcDist.map((x) => x.count), 1); return (<div key={d.code}><div className="flex justify-between text-xs mb-1"><span className="font-medium">{d.code} · {d.label}</span><span className="text-muted-foreground">{d.count}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={cn('h-full rounded-full', d.tone)} style={{ width: `${(d.count / max) * 100}%` }} /></div></div>); })}</CardContent></Card>
      </div>

      <Card><CardHeader><CardTitle className="text-base">Finance Summary</CardTitle><CardDescription>Term collection</CardDescription></CardHeader><CardContent className="space-y-3"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Total billed</span><span className="font-semibold">{formatKES(totalBilled)}</span></div><div className="flex justify-between text-sm"><span className="text-muted-foreground">Collected</span><span className="font-semibold text-emerald-600">{formatKES(collected)}</span></div><div className="flex justify-between text-sm"><span className="text-muted-foreground">Outstanding</span><span className="font-semibold text-amber-600">{formatKES(outstanding)}</span></div><Progress value={totalBilled > 0 ? (collected / totalBilled) * 100 : 0} className="h-2" /></CardContent></Card>
    </div>
  );
}