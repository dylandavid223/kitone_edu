'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Check,
  Clock,
  X,
  Save,
  WifiOff,
  CloudUpload,
  Download,
  AlertTriangle,
  CalendarDays,
  TrendingDown,
} from 'lucide-react';
import { students, classes, avatarColor, initials, fmtDate } from '../data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Mark = 'present' | 'late' | 'absent';

const markMeta: Record<Mark, { label: string; icon: React.ComponentType<{ className?: string }>; classes: string }> = {
  present: { label: 'Present', icon: Check, classes: 'bg-emerald-500 text-white' },
  late: { label: 'Late', icon: Clock, classes: 'bg-amber-500 text-white' },
  absent: { label: 'Absent', icon: X, classes: 'bg-rose-500 text-white' },
};

const cycle: Mark[] = ['present', 'late', 'absent'];

export function AttendanceModule() {
  const [classId, setClassId] = useState('c6'); // Grade 9 East
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  const [synced, setSynced] = useState(false);
  const { toast } = useToast();

  const roster = students.filter((s) => {
    const cls = classes.find((c) => c.id === classId)!;
    return s.grade === cls.grade && s.stream === cls.stream;
  }).slice(0, 14); // cap for demo

  // Seed default present
  const current = roster.reduce<Record<string, Mark>>((acc, s) => {
    acc[s.id] = marks[s.id] ?? 'present';
    return acc;
  }, {});

  const counts = roster.reduce(
    (acc, s) => {
      const m = current[s.id];
      acc[m] = (acc[m] ?? 0) + 1;
      return acc;
    },
    { present: 0, late: 0, absent: 0 } as Record<Mark, number>
  );
  const rate = roster.length ? Math.round(((counts.present + counts.late * 0.5) / roster.length) * 100) : 0;

  function toggle(id: string) {
    const cur = current[id];
    const next = cycle[(cycle.indexOf(cur) + 1) % cycle.length];
    setMarks((m) => ({ ...m, [id]: next }));
    setSynced(false);
  }

  function save() {
    setSynced(true);
    const absentCount = Object.values(current).filter((m) => m === 'absent').length;
    toast({
      title: 'Attendance saved',
      description: `Synced to cloud. ${absentCount} parent${absentCount === 1 ? '' : 's'} notified via SMS.`,
    });
  }

  const chronic = students.filter((s) => s.attendance < 80).slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Header / controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Select value={classId} onValueChange={(v) => { setClassId(v); setMarks({}); setSynced(false); }}>
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => { setDate(e.target.value); setSynced(false); }}
                  className="flex h-9 w-[150px] rounded-md border border-input bg-transparent pl-9 pr-2 text-sm"
                />
              </div>
              <Badge variant="outline" className="gap-1 text-[11px]">
                <WifiOff className="h-3 w-3" /> Offline-ready · changes queued
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => toast({ title: 'Exporting', description: 'attendance.csv' })}>
                <Download className="mr-1.5 h-4 w-4" /> Export
              </Button>
              <Button onClick={save} disabled={synced}>
                {synced ? <><CloudUpload className="mr-1.5 h-4 w-4" /> Synced</> : <><Save className="mr-1.5 h-4 w-4" /> Save & Sync</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary chips */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600"><Check className="h-4 w-4" /></span>
              <div><p className="text-[10px] uppercase text-muted-foreground">Present</p><p className="text-lg font-bold">{counts.present}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600"><Clock className="h-4 w-4" /></span>
              <div><p className="text-[10px] uppercase text-muted-foreground">Late</p><p className="text-lg font-bold">{counts.late}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600"><X className="h-4 w-4" /></span>
              <div><p className="text-[10px] uppercase text-muted-foreground">Absent</p><p className="text-lg font-bold">{counts.absent}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-[10px] uppercase text-muted-foreground">Rate</p><p className="text-lg font-bold">{rate}%</p></div>
              <Progress value={rate} className="w-14 h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Roll call grid */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Roll Call</CardTitle>
              <CardDescription>Tap a student to cycle: Present → Late → Absent</CardDescription>
            </div>
            <div className="hidden gap-1.5 sm:flex">
              {(['present', 'late', 'absent'] as Mark[]).map((m) => (
                <Badge key={m} variant="outline" className="gap-1 text-[10px] capitalize">
                  <span className={cn('flex h-4 w-4 items-center justify-center rounded', markMeta[m].classes)}>
                    {(() => { const I = markMeta[m].icon; return <I className="h-2.5 w-2.5" />; })()}
                  </span>
                  {markMeta[m].label}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {roster.map((s) => {
                const m = current[s.id];
                const meta = markMeta[m];
                const Icon = meta.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => toggle(s.id)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border p-2.5 text-left transition-all hover:shadow-sm active:scale-[0.99]',
                      m === 'absent' && 'border-rose-500/40 bg-rose-500/5',
                      m === 'late' && 'border-amber-500/40 bg-amber-500/5',
                      m === 'present' && 'border-emerald-500/40 bg-emerald-500/5'
                    )}
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={`text-xs font-bold text-white ${avatarColor(s.name)}`}>
                        {initials(s.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{s.admissionNo}</p>
                    </div>
                    <span className={cn('flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold', meta.classes)}>
                      <Icon className="h-4 w-4" />
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-4">
          {/* Weekly trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Trend</CardTitle>
              <CardDescription>{classes.find((c) => c.id === classId)!.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2 h-32">
                {[
                  { d: 'Mon', r: 96 }, { d: 'Tue', r: 94 }, { d: 'Wed', r: 92 },
                  { d: 'Thu', r: 95 }, { d: 'Fri', r: 91 }, { d: 'Today', r: rate },
                ].map((b, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className={cn('w-full rounded-t', b.r >= 95 ? 'bg-emerald-500' : b.r >= 90 ? 'bg-amber-500' : 'bg-rose-500')}
                        style={{ height: `${b.r}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{b.d}</span>
                    <span className="text-[10px] font-semibold">{b.r}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chronic absenteeism */}
          <Card className="border-rose-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-rose-700 dark:text-rose-400">
                <TrendingDown className="h-4 w-4" /> Chronic Absenteeism
              </CardTitle>
              <CardDescription>Below 80% attendance · intervention needed</CardDescription>
            </CardHeader>
            <CardContent className="kitone-scroll max-h-[260px] space-y-2 overflow-y-auto">
              {chronic.map((s) => (
                <div key={s.id} className="flex items-center gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5 p-2.5">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`text-[10px] font-bold text-white ${avatarColor(s.name)}`}>
                      {initials(s.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.grade} {s.stream}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-rose-600 border-rose-500/30 bg-rose-500/10">{s.attendance}%</Badge>
                </div>
              ))}
              <Separator className="my-2" />
              <Button variant="outline" size="sm" className="w-full text-xs">
                <AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> Notify class teachers
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
