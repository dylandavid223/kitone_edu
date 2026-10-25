'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { StatCard } from '../ui/stat-card';
import { SectionHeader, StatusBadge } from '../ui/badges';
import {
  kpisForRole,
  enrollTrend,
  feeCollectionTrend,
  attendanceByGrade,
  performanceBySubject,
  cbcDistribution,
  recentActivity,
  pendingApprovals,
  timetableSnapshot,
  institution,
  formatKES,
  avatarColor,
  initials,
  type Role,
} from '../data';
import {
  Plus,
  CalendarCheck,
  ClipboardList,
  Megaphone,
  FileText,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Wallet,
  UserPlus,
  AlertTriangle,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  role: Role;
  onNavigate: (v: string) => void;
}

const activityIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  payment: Wallet,
  admission: UserPlus,
  attendance: CalendarCheck,
  assessment: ClipboardList,
  alert: AlertTriangle,
  announcement: Megaphone,
};

const feeConfig: ChartConfig = {
  billed: { label: 'Billed', color: 'var(--chart-2)' },
  collected: { label: 'Collected', color: 'var(--chart-1)' },
};

const enrollConfig: ChartConfig = {
  students: { label: 'Students', color: 'var(--chart-1)' },
};

const radarConfig: ChartConfig = {
  avg: { label: 'Avg %', color: 'var(--chart-1)' },
};

const pieConfig: ChartConfig = {
  EE: { label: 'Exceeding', color: 'var(--chart-1)' },
  ME: { label: 'Meeting', color: 'var(--chart-2)' },
  AE: { label: 'Approaching', color: 'var(--chart-3)' },
  BE: { label: 'Below', color: 'var(--chart-5)' },
};

export function Dashboard({ role, onNavigate }: Props) {
  const kpis = kpisForRole(role);
  const { toast } = useToast();

  const roleLabel = role === 'admin' ? 'Institution' : role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/20">
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/15 text-primary hover:bg-primary/15 border-0">
                  {institution.term}
                </Badge>
                <Badge variant="outline" className="text-[11px]">{institution.curriculum}</Badge>
                <Badge variant="outline" className="text-[11px]">{institution.plan} plan</Badge>
              </div>
              <h2 className="mt-2 text-xl font-bold tracking-tight md:text-2xl">
                Karibu, {role === 'admin' ? 'Dr. Margaret' : role === 'teacher' ? 'Mrs. Wambui' : role === 'finance' ? 'Mrs. Njoroge' : role === 'parent' ? 'Peter Kamau' : 'Wanjiru Kamau'} 👋
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {role === 'admin' && `${institution.name} · ${institution.totalStudents} students · ${institution.location}`}
                {role === 'teacher' && 'You have 4 lessons today. Next: Mathematics · Grade 9 East · 14:00'}
                {role === 'finance' && 'KES 890K overdue across 84 students. 2 refund approvals pending.'}
                {role === 'parent' && '2 children enrolled. Brian has a KES 12,500 balance due 15 June.'}
                {role === 'student' && 'Maths Algebra CAT starts at 09:00 today. 20 questions · 60 min.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => onNavigate('attendance')}>
                <CalendarCheck className="mr-1.5 h-4 w-4" /> Mark Attendance
              </Button>
              <Button size="sm" variant="outline" onClick={() => onNavigate('assessments')}>
                <ClipboardList className="mr-1.5 h-4 w-4" /> New Test
              </Button>
              <Button size="sm" variant="outline" onClick={() => onNavigate('communications')}>
                <Megaphone className="mr-1.5 h-4 w-4" /> Announce
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <StatCard key={k.label} {...k} />
        ))}
      </div>

      {/* Role-aware middle section */}
      {role === 'admin' && <AdminMid onNavigate={onNavigate} />}
      {role === 'teacher' && <TeacherMid onNavigate={onNavigate} />}
      {role === 'finance' && <FinanceMid onNavigate={onNavigate} />}
      {role === 'parent' && <ParentMid onNavigate={onNavigate} />}
      {role === 'student' && <StudentMid onNavigate={onNavigate} />}

      {/* Footer actions / pending approvals */}
      {role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Approvals</CardTitle>
            <CardDescription>Dual-control workflows awaiting your action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingApprovals.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{p.type}</Badge>
                      {p.amount > 0 && <span className="text-xs text-muted-foreground">{formatKES(p.amount)}</span>}
                    </div>
                    <p className="mt-0.5 text-sm font-medium">{p.text}</p>
                    <p className="text-xs text-muted-foreground">Requested by {p.requester}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-rose-600 hover:bg-rose-500/10 hover:text-rose-600"
                    onClick={() => toast({ title: 'Request rejected', description: p.text, variant: 'destructive' })}
                  >
                    <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => toast({ title: 'Approved', description: p.text })}
                  >
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AdminMid({ onNavigate }: { onNavigate: (v: string) => void }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Enrollment trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Enrollment Trend</CardTitle>
              <CardDescription>Last 12 months · {institution.totalStudents} active</CardDescription>
            </div>
            <Button size="sm" variant="ghost" onClick={() => onNavigate('analytics')}>
              View report <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <ChartContainer config={enrollConfig} className="aspect-[16/7] w-full">
              <AreaChart data={enrollTrend} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="fillEnroll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-students)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-students)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <YAxis domain={[1100, 1300]} tickLine={false} axisLine={false} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="students" type="monotone" stroke="var(--color-students)" fill="url(#fillEnroll)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* CBC distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">CBC Performance Spread</CardTitle>
            <CardDescription>{institution.totalStudents} students · all grades</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieConfig} className="aspect-square max-h-[180px] w-full">
              <PieChart>
                <Pie data={cbcDistribution} dataKey="value" nameKey="level" innerRadius={42} outerRadius={70} strokeWidth={2}>
                  {cbcDistribution.map((d) => (
                    <Cell key={d.level} fill={d.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent nameKey="level" />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {cbcDistribution.map((d) => (
                <div key={d.level} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                  <span className="font-medium">{d.level}</span>
                  <span className="text-muted-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Fee collection */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Fee Collection</CardTitle>
              <CardDescription>Billed vs collected (KES millions) · 2025</CardDescription>
            </div>
            <Button size="sm" variant="ghost" onClick={() => onNavigate('fees')}>
              Fees <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <ChartContainer config={feeConfig} className="aspect-[16/7] w-full">
              <BarChart data={feeCollectionTrend} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="billed" fill="var(--color-billed)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" fill="var(--color-collected)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Live feed</CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="kitone-scroll max-h-[280px] overflow-y-auto px-4 pb-4">
              <div className="space-y-3">
                {recentActivity.map((a) => {
                  const Icon = activityIcon[a.type] ?? Bell;
                  return (
                    <div key={a.id} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs leading-snug">{a.text}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {a.time}
                          {a.code && <span className="ml-1 font-mono">· {a.code}</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Attendance by grade */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attendance by Grade</CardTitle>
            <CardDescription>Today · all classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {attendanceByGrade.map((g) => (
              <div key={g.grade} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-xs font-medium">{g.grade}</span>
                <Progress value={g.rate} className="h-2.5 flex-1" />
                <span className="w-10 shrink-0 text-right text-xs font-semibold">{g.rate}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance radar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subject Performance</CardTitle>
            <CardDescription>Average score (%) · this term</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={radarConfig} className="aspect-square max-h-[220px] w-full">
              <RadarChart data={performanceBySubject}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <Radar dataKey="avg" stroke="var(--color-avg)" fill="var(--color-avg)" fillOpacity={0.3} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Timetable snapshot */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Today's Timetable · Grade 9 East</CardTitle>
            <CardDescription>Mrs. Grace Wambui · Block C · Room 5</CardDescription>
          </div>
          <Button size="sm" variant="ghost">Full schedule</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
            {timetableSnapshot.map((t, i) => (
              <div
                key={i}
                className={`rounded-lg border p-3 ${t.subject === 'Break' ? 'bg-muted/40' : 'bg-card'}`}
              >
                <p className="text-[10px] font-medium text-muted-foreground">{t.period}</p>
                <p className="mt-0.5 text-sm font-semibold truncate">{t.subject}</p>
                <p className="text-[10px] text-muted-foreground truncate">{t.room}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function TeacherMid({ onNavigate }: { onNavigate: (v: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">My Classes Today</CardTitle>
          <CardDescription>5 classes · 32 students total</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { time: '08:00', cls: 'Grade 7 East', subj: 'Mathematics', room: 'A12', students: 38 },
            { time: '09:20', cls: 'Grade 8 West', subj: 'Mathematics', room: 'B10', students: 37 },
            { time: '11:00', cls: 'Form 3 North', subj: 'Mathematics', room: 'D3', students: 42 },
            { time: '14:00', cls: 'Grade 9 East', subj: 'Mathematics', room: 'C5', students: 41, live: true },
            { time: '15:30', cls: 'Form 4 South', subj: 'Mathematics', room: 'D6', students: 41 },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="text-[10px] font-medium leading-none">{c.time.split(':')[0]}:{c.time.split(':')[1]}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{c.cls} · {c.subj}</p>
                <p className="text-xs text-muted-foreground">Room {c.room} · {c.students} students</p>
              </div>
              {c.live ? (
                <Button size="sm" onClick={() => onNavigate('classrooms')}>
                  <span className="mr-1 h-1.5 w-1.5 rounded-full bg-rose-500" /> Join live
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => onNavigate('attendance')}>Roll call</Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending Grading</CardTitle>
          <CardDescription>18 submissions awaiting review</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { t: 'Maths CAT · Algebra', c: 'Grade 9 East', n: 38, d: 'Due tomorrow' },
            { t: 'Assignment · Geometry', c: 'Grade 7 East', n: 36, d: 'Due 12 Jun' },
            { t: 'Project · Statistics', c: 'Form 3 North', n: 42, d: 'Due 18 Jun' },
          ].map((g, i) => (
            <div key={i} className="rounded-lg border p-3">
              <p className="text-sm font-medium">{g.t}</p>
              <p className="text-xs text-muted-foreground">{g.c} · {g.n} students</p>
              <div className="mt-2 flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30 bg-amber-500/10">{g.d}</Badge>
                <Button size="sm" variant="ghost" className="h-7" onClick={() => onNavigate('gradebook')}>Grade</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function FinanceMid({ onNavigate }: { onNavigate: (v: string) => void }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Fee Collection Trend</CardTitle>
            <CardDescription>KES millions · billed vs collected</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={feeConfig} className="aspect-[16/7] w-full">
              <BarChart data={feeCollectionTrend} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="billed" fill="var(--color-billed)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" fill="var(--color-collected)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aging Report</CardTitle>
            <CardDescription>Outstanding balances by age</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { bucket: '0–30 days', amt: 980000, pct: 41 },
              { bucket: '31–60 days', amt: 620000, pct: 26 },
              { bucket: '61–90 days', amt: 410000, pct: 17 },
              { bucket: '90+ days', amt: 390000, pct: 16 },
            ].map((a) => (
              <div key={a.bucket}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{a.bucket}</span>
                  <span className="text-muted-foreground">{formatKES(a.amt)}</span>
                </div>
                <Progress value={a.pct} className="mt-1 h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Recent Payments</CardTitle>
            <CardDescription>Auto-reconciled via M-PESA Daraja</CardDescription>
          </div>
          <Button size="sm" variant="ghost" onClick={() => onNavigate('fees')}>All payments</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="kitone-scroll max-h-[280px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Student</th>
                  <th className="px-4 py-2 font-medium">Method</th>
                  <th className="px-4 py-2 font-medium">Code</th>
                  <th className="px-4 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { n: 'Wanjiru Kamau', m: 'M-PESA', c: 'SI7K2P9XHM', a: 45000, t: '2m ago' },
                  { n: 'Gloria Akinyi', m: 'M-PESA', c: 'SH3M8N2KPL', a: 48000, t: '2h ago' },
                  { n: 'Felix Otieno', m: 'Bank', c: 'BNK-44782', a: 30000, t: '3h ago' },
                  { n: 'Collins Kibe', m: 'M-PESA', c: 'PL2K8M3NQZ', a: 30000, t: '6h ago' },
                  { n: 'Emmanuel Asamba', m: 'M-PESA', c: 'RT6Y2H7VB', a: 24000, t: '8h ago' },
                  { n: 'Dennis Mwangi', m: 'M-PESA', c: 'QW9R4T1YU', a: 11000, t: '1d ago' },
                ].map((p, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className={`text-[10px] font-bold text-white ${avatarColor(p.n)}`}>
                            {initials(p.n)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{p.n}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant="outline" className="text-[10px]">{p.m}</Badge>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{p.c}</td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="font-semibold">{formatKES(p.a)}</div>
                      <div className="text-[10px] text-muted-foreground">{p.t}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function ParentMid({ onNavigate }: { onNavigate: (v: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Wanjiru Kamau · Grade 9 East</CardTitle>
          <CardDescription>Admission No. AHS-2025-0142</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="text-xl font-bold">88%</p>
              <p className="text-[10px] text-emerald-600">EE · Exceeding</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Attendance</p>
              <p className="text-xl font-bold">96%</p>
              <p className="text-[10px] text-muted-foreground">2 absences</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Class Rank</p>
              <p className="text-xl font-bold">#3</p>
              <p className="text-[10px] text-muted-foreground">of 41 students</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Fee Balance</p>
              <p className="text-xl font-bold text-emerald-600">KES 0</p>
              <p className="text-[10px] text-muted-foreground">Cleared</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => onNavigate('students')}>
            View full profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brian Otieno · Grade 9 East</CardTitle>
          <CardDescription>Admission No. AHS-2025-0143</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="text-xl font-bold">74%</p>
              <p className="text-[10px] text-teal-600">ME · Meeting</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Attendance</p>
              <p className="text-xl font-bold">91%</p>
              <p className="text-[10px] text-muted-foreground">4 absences</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Class Rank</p>
              <p className="text-xl font-bold">#14</p>
              <p className="text-[10px] text-muted-foreground">of 41 students</p>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              <p className="text-xs text-muted-foreground">Fee Balance</p>
              <p className="text-xl font-bold text-amber-600">KES 12,500</p>
              <p className="text-[10px] text-amber-600">Due 15 Jun</p>
            </div>
          </div>
          <Button className="w-full" onClick={() => onNavigate('fees')}>
            <Wallet className="mr-1.5 h-4 w-4" /> Pay via M-PESA
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentMid({ onNavigate }: { onNavigate: (v: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">My Performance</CardTitle>
          <CardDescription>Term 2 · 2025 · CBC levels</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={radarConfig} className="aspect-[16/9] w-full">
            <RadarChart data={performanceBySubject}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <Radar dataKey="avg" stroke="var(--color-avg)" fill="var(--color-avg)" fillOpacity={0.3} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upcoming</CardTitle>
          <CardDescription>This week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { t: 'Maths · Algebra CAT', d: 'Today 09:00', tone: 'rose' },
            { t: 'Science Quiz', d: 'Tomorrow 08:00', tone: 'amber' },
            { t: 'Kiswahili End Term', d: '12 Jun 14:00', tone: 'amber' },
            { t: 'PTA Meeting', d: '14 Jun 10:00', tone: 'emerald' },
          ].map((e, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
              <div className={`h-2 w-2 shrink-0 rounded-full ${e.tone === 'rose' ? 'bg-rose-500' : e.tone === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{e.t}</p>
                <p className="text-xs text-muted-foreground">{e.d}</p>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full" onClick={() => onNavigate('assessments')}>
            View all tests
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
