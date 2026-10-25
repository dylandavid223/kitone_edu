'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
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
import { FileText, FileSpreadsheet, Layers, Download } from 'lucide-react';
import {
  enrollTrend,
  feeCollectionTrend,
  attendanceByGrade,
  performanceBySubject,
  cbcDistribution,
  institution,
} from '../data';
import { useToast } from '@/hooks/use-toast';

const enroll3y = [
  { year: '2023', students: 1180 },
  { year: '2024', students: 1228 },
  { year: '2025', students: 1247 },
];

const subjectConfig: ChartConfig = {
  avg: { label: 'Average %', color: 'var(--chart-1)' },
};
const feeConfig: ChartConfig = {
  billed: { label: 'Billed', color: 'var(--chart-2)' },
  collected: { label: 'Collected', color: 'var(--chart-1)' },
};
const enrollConfig: ChartConfig = {
  students: { label: 'Students', color: 'var(--chart-1)' },
};

// heatmap data: day x class
const heatmap = attendanceByGrade.flatMap((g, gi) =>
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, di) => ({
    grade: g.grade,
    day: d,
    value: Math.min(99, Math.max(82, g.rate + ((di + gi) % 3) - 1)),
  }))
);

const heatColor = (v: number) =>
  v >= 95 ? 'bg-emerald-500' : v >= 90 ? 'bg-emerald-400' : v >= 85 ? 'bg-amber-400' : 'bg-rose-400';

export function AnalyticsModule() {
  const [roleTab, setRoleTab] = useState('admin');
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      {/* Export bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Reports & Analytics</p>
              <p className="text-xs text-muted-foreground">Role-aware dashboards · {institution.term}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast({ title: 'Generating PDF…', description: 'report_term2_2025.pdf' })}>
                <FileText className="mr-1.5 h-4 w-4" /> PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast({ title: 'Exporting…', description: 'analytics_export.xlsx' })}>
                <FileSpreadsheet className="mr-1.5 h-4 w-4" /> Excel
              </Button>
              <Button size="sm" onClick={() => toast({ title: 'Custom report builder', description: 'Drag fields to compose' })}>
                <Layers className="mr-1.5 h-4 w-4" /> Custom report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role tabs */}
      <Tabs value={roleTab} onValueChange={setRoleTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="teacher">Teacher</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="parent">Parent</TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Enrollment · 3-Year Trend</CardTitle>
                <CardDescription>Annual headcount</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={enrollConfig} className="aspect-[16/9] w-full">
                  <LineChart data={enroll3y} margin={{ left: -12, right: 8 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={11} />
                    <YAxis domain={[1100, 1300]} tickLine={false} axisLine={false} fontSize={11} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line dataKey="students" stroke="var(--color-students)" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">CBC Performance Distribution</CardTitle>
                <CardDescription>All students · Term 2</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={enrollConfig} className="aspect-[16/9] w-full">
                  <PieChart>
                    <Pie data={cbcDistribution} dataKey="value" nameKey="level" innerRadius={50} outerRadius={80} strokeWidth={2}>
                      {cbcDistribution.map((d) => <Cell key={d.level} fill={d.color} />)}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent nameKey="level" />} />
                  </PieChart>
                </ChartContainer>
                <div className="mt-2 grid grid-cols-4 gap-1">
                  {cbcDistribution.map((d) => (
                    <div key={d.level} className="text-center">
                      <div className="flex items-center justify-center gap-1 text-xs">
                        <span className="h-2 w-2 rounded-sm" style={{ background: d.color }} />
                        <span className="font-medium">{d.level}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{d.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attendance Heatmap</CardTitle>
              <CardDescription>Grade × weekday · this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-6 gap-1 min-w-[480px]">
                  <div />
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => (
                    <div key={d} className="text-center text-[10px] font-medium text-muted-foreground pb-1">{d}</div>
                  ))}
                  {attendanceByGrade.map((g) => (
                    <>
                      <div key={g.grade} className="flex items-center text-[11px] font-medium pr-2">{g.grade}</div>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => {
                        const cell = heatmap.find((h) => h.grade === g.grade && h.day === d)!;
                        return (
                          <div key={`${g.grade}-${d}`} className={`relative aspect-square rounded ${heatColor(cell.value)} group flex items-center justify-center`}>
                            <span className="text-[10px] font-bold text-white">{cell.value}</span>
                          </div>
                        );
                      })}
                    </>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
                  <span>Low</span>
                  <div className="flex gap-0.5">
                    <div className="h-3 w-6 rounded bg-rose-400" />
                    <div className="h-3 w-6 rounded bg-amber-400" />
                    <div className="h-3 w-6 rounded bg-emerald-400" />
                    <div className="h-3 w-6 rounded bg-emerald-500" />
                  </div>
                  <span>High</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top / Bottom Classes</CardTitle>
                <CardDescription>By average score · this term</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {[
                  { c: 'Grade 9 East', avg: 84, trend: 'up' },
                  { c: 'Grade 9 North', avg: 81, trend: 'up' },
                  { c: 'Grade 9 West', avg: 77, trend: 'flat' },
                  { c: 'Grade 8 North', avg: 58, trend: 'down' },
                  { c: 'Grade 7 West', avg: 52, trend: 'down' },
                ].map((c, i) => (
                  <div key={c.c} className="flex items-center gap-3">
                    <span className="w-6 text-xs font-bold text-muted-foreground">#{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs"><span className="font-medium">{c.c}</span><span className="font-semibold">{c.avg}%</span></div>
                      <Progress value={c.avg} className="mt-1 h-1.5" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Subject Performance Radar</CardTitle>
                <CardDescription>Average score (%)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={subjectConfig} className="aspect-square max-h-[240px] w-full">
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
        </TabsContent>

        <TabsContent value="teacher" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Teacher Effectiveness</CardTitle>
              <CardDescription>By class · subject mastery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { t: 'Mrs. Grace Wambui · Maths', classes: 5, avg: 78, cbc: 'ME' },
                { t: 'Mr. Peter Maina · Science', classes: 4, avg: 81, cbc: 'ME' },
                { t: 'Ms. Susan Achieng · Kiswahili', classes: 4, avg: 85, cbc: 'EE' },
                { t: 'Mr. David Kiprop · English', classes: 5, avg: 76, cbc: 'ME' },
              ].map((x) => (
                <div key={x.t} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{x.t}</p>
                    <Badge variant="outline" className="text-[10px]">{x.cbc}</Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <Progress value={x.avg} className="h-2 flex-1" />
                    <span className="text-xs font-semibold">{x.avg}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fee Collection Funnel</CardTitle>
              <CardDescription>Billed → Paid → Reconciled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { stage: 'Billed', amt: 10800000, pct: 100, color: 'bg-amber-500' },
                  { stage: 'Paid', amt: 8400000, pct: 78, color: 'bg-emerald-500' },
                  { stage: 'Reconciled', amt: 8350000, pct: 77, color: 'bg-teal-500' },
                  { stage: 'Receipted', amt: 8300000, pct: 77, color: 'bg-primary' },
                ].map((s) => (
                  <div key={s.stage}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{s.stage}</span>
                      <span className="text-muted-foreground">KES {(s.amt / 1000000).toFixed(2)}M · {s.pct}%</span>
                    </div>
                    <div className="h-6 overflow-hidden rounded bg-muted">
                      <div className={`h-full ${s.color} flex items-center justify-end pr-2 text-[10px] font-medium text-white`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parent" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Child Progress</CardTitle>
              <CardDescription>Wanjiru Kamau · Grade 9 East</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={subjectConfig} className="aspect-[16/7] w-full">
                <AreaChart data={performanceBySubject} margin={{ left: -18, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="fillPerf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-avg)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-avg)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="subject" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area dataKey="avg" type="monotone" stroke="var(--color-avg)" fill="url(#fillPerf)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
