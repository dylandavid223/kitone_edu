'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  UserPlus,
  Download,
  Lock,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  CalendarClock,
  TrendingUp,
  AlertCircle,
  Activity,
} from 'lucide-react';
import {
  students,
  classes,
  subjects,
  formatKES,
  avatarColor,
  initials,
  cbcFor,
  type Student,
} from '../data';
import { CbcBadge, StatusBadge } from '../ui/badges';
import { useToast } from '@/hooks/use-toast';

const gradeFilters = ['all', 'Grade 7', 'Grade 8', 'Grade 9', 'Form 3', 'Form 4'];
const statusFilters = ['all', 'active', 'suspended'];
const feeFilters = ['all', 'paid', 'arrears'];

export function StudentsModule() {
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('all');
  const [status, setStatus] = useState('all');
  const [fee, setFee] = useState('all');
  const [selected, setSelected] = useState<Student | null>(null);
  const [admitOpen, setAdmitOpen] = useState(false);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (search && !`${s.name} ${s.admissionNo} ${s.guardian}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (grade !== 'all' && s.grade !== grade) return false;
      if (status !== 'all' && s.status !== status) return false;
      if (fee === 'paid' && s.feeBalance > 0) return false;
      if (fee === 'arrears' && s.feeBalance === 0) return false;
      return true;
    });
  }, [search, grade, status, fee]);

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, admission no, guardian…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="Grade" /></SelectTrigger>
                <SelectContent>
                  {gradeFilters.map((g) => (
                    <SelectItem key={g} value={g}>{g === 'all' ? 'All grades' : g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={fee} onValueChange={setFee}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="Fees" /></SelectTrigger>
                <SelectContent>
                  {feeFilters.map((f) => (
                    <SelectItem key={f} value={f}>{f === 'all' ? 'All fees' : f === 'paid' ? 'Paid up' : 'In arrears'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  {statusFilters.map((s) => (
                    <SelectItem key={s} value={s}>{s === 'all' ? 'All status' : s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => toast({ title: 'Exporting…', description: 'students_export.csv will download shortly' })}>
                <Download className="mr-1.5 h-4 w-4" /> Export
              </Button>
              <Button onClick={() => setAdmitOpen(true)}>
                <UserPlus className="mr-1.5 h-4 w-4" /> Admit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Students</CardTitle>
            <CardDescription>{filtered.length} of {students.length} shown · Term 2 2025</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="kitone-scroll overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Admission No.</th>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Guardian</th>
                  <th className="px-4 py-3 text-right font-medium">Fee Balance</th>
                  <th className="px-4 py-3 text-right font-medium">Attend.</th>
                  <th className="px-4 py-3 text-center font-medium">CBC</th>
                  <th className="px-4 py-3 text-center font-medium">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b last:border-0 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.admissionNo}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`text-xs font-bold text-white ${avatarColor(s.name)}`}>
                            {initials(s.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className="text-[10px] text-muted-foreground">{s.gender === 'M' ? 'Male' : 'Female'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{s.grade}</p>
                      <p className="text-[10px] text-muted-foreground">{s.stream}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs">{s.guardian}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{s.guardianPhone}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={s.feeBalance === 0 ? 'font-semibold text-emerald-600' : s.feeBalance > 20000 ? 'font-semibold text-rose-600' : 'font-semibold text-amber-600'}>
                        {formatKES(s.feeBalance)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={s.attendance < 80 ? 'text-rose-600 font-medium' : 'font-medium'}>{s.attendance}%</span>
                    </td>
                    <td className="px-4 py-3 text-center"><CbcBadge level={s.cbc} /></td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(s)}>View</Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-muted-foreground">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <Search className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-medium">No students match your filters</p>
                        <p className="text-xs">Try clearing the search or changing the filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Profile drawer */}
      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="kitone-scroll w-full overflow-y-auto sm:max-w-lg">
          {selected && <StudentProfile student={selected} />}
        </SheetContent>
      </Sheet>

      {/* Admit dialog */}
      <Dialog open={admitOpen} onOpenChange={setAdmitOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Admit New Student</DialogTitle>
            <DialogDescription>Onboarding wizard · Step 1 of 1 (demo)</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="e.g. John Kamau" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="grade">Grade</Label>
                <Select defaultValue="Grade 7">
                  <SelectTrigger id="grade"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Grade 7', 'Grade 8', 'Grade 9', 'Form 3', 'Form 4'].map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stream">Stream</Label>
                <Select defaultValue="East">
                  <SelectTrigger id="stream"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['East', 'West', 'North', 'South'].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="guardian">Guardian name</Label>
                <Input id="guardian" placeholder="e.g. Peter Kamau" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Guardian phone</Label>
                <Input id="phone" placeholder="+254 7xx xxx xxx" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdmitOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setAdmitOpen(false);
              toast({ title: 'Student admitted', description: 'Admission No. AHS-2025-0166 auto-generated · Guardian invited via SMS.' });
            }}>
              Admit & notify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StudentProfile({ student }: { student: Student }) {
  const cbc = cbcFor(student.avgScore);
  return (
    <>
      <SheetHeader>
        <SheetTitle className="sr-only">{student.name}</SheetTitle>
        <SheetDescription className="sr-only">Student profile</SheetDescription>
      </SheetHeader>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className={`text-lg font-bold text-white ${avatarColor(student.name)}`}>
              {initials(student.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold truncate">{student.name}</h2>
            <p className="text-sm text-muted-foreground font-mono">{student.admissionNo}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline">{student.grade}</Badge>
              <Badge variant="outline">{student.stream} stream</Badge>
              <StatusBadge status={student.status} />
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border p-3 text-center">
            <p className="text-[10px] uppercase text-muted-foreground">Avg Score</p>
            <p className="text-lg font-bold">{student.avgScore}%</p>
            <CbcBadge level={cbc.code} className="mt-0.5" />
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-[10px] uppercase text-muted-foreground">Attendance</p>
            <p className="text-lg font-bold">{student.attendance}%</p>
            <Progress value={student.attendance} className="mt-1.5 h-1" />
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-[10px] uppercase text-muted-foreground">Fee Balance</p>
            <p className={`text-lg font-bold ${student.feeBalance === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>{formatKES(student.feeBalance)}</p>
            <p className="text-[10px] text-muted-foreground">{student.feeBalance === 0 ? 'Cleared' : 'Outstanding'}</p>
          </div>
        </div>

        {/* Guardian */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Guardian</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><UserPlus className="h-4 w-4 text-muted-foreground" /><span>{student.guardian}</span></div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span className="font-mono text-xs">{student.guardianPhone}</span></div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">via SMS preferred</span></div>
          </CardContent>
        </Card>

        {/* Enrolled subjects */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Enrolled Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {subjects.slice(0, 6).map((s) => (
                <Badge key={s.id} variant="secondary" className="text-[11px]">{s.name}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CBC progress by strand */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4" /> CBC Progress · Mathematics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { strand: 'Algebra', score: 92, level: 'EE' },
              { strand: 'Geometry', score: 84, level: 'ME' },
              { strand: 'Statistics', score: 78, level: 'ME' },
              { strand: 'Number Operations', score: 88, level: 'EE' },
              { strand: 'Measurement', score: 71, level: 'ME' },
            ].map((s) => (
              <div key={s.strand}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{s.strand}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{s.score}%</span>
                    <CbcBadge level={s.level} />
                  </div>
                </div>
                <Progress value={s.score} className="mt-1 h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Activity className="h-4 w-4" /> Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-xs">
            {[
              { i: CalendarClock, t: 'Present today · 08:02', tone: 'text-emerald-600' },
              { i: TrendingUp, t: 'Scored 92% in Algebra CAT', tone: 'text-emerald-600' },
              { i: AlertCircle, t: 'Absent 3 Jun (excused)', tone: 'text-amber-600' },
              { i: UserPlus, t: 'Library book returned · on time', tone: 'text-muted-foreground' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <a.i className={`h-3.5 w-3.5 ${a.tone}`} />
                <span>{a.t}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Restricted */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <Lock className="h-4 w-4" /> Restricted · DPO-approved access
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Medical notes, disability accommodations & disciplinary records are encrypted at rest. Access requires dual approval per Kenya DPA 2019. <Button variant="link" className="h-auto p-0 text-xs">Request access</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
