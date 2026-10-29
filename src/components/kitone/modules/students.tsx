'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Search, UserPlus, Download, Lock, Phone } from 'lucide-react';
import { useInstitution, formatKES, pickColor, initials, cbcFor, type Student } from '../institution-store';
import { CbcBadge, StatusBadge } from '../ui/badges';
import { EmptyState } from '../empty-state';
import { useToast } from '@/hooks/use-toast';

export function StudentsModule() {
  const { data, addStudent } = useInstitution();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('all');
  const [status, setStatus] = useState('all');
  const [fee, setFee] = useState('all');
  const [selected, setSelected] = useState<Student | null>(null);
  const [admitOpen, setAdmitOpen] = useState(false);
  const grades = Array.from(new Set(data.classes.map((c) => c.grade)));

  const filtered = useMemo(() => data.students.filter((s) => {
    if (search && !`${s.name} ${s.admissionNo} ${s.guardian}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (grade !== 'all' && s.grade !== grade) return false;
    if (status !== 'all' && s.status !== status) return false;
    if (fee === 'paid' && s.feeBalance > 0) return false;
    if (fee === 'arrears' && s.feeBalance === 0) return false;
    return true;
  }), [data.students, search, grade, status, fee]);

  return (
    <div className="space-y-4">
      <Card><CardContent className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search by name, admission no, guardian…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
          <div className="flex flex-wrap gap-2">
            <Select value={grade} onValueChange={setGrade}><SelectTrigger className="w-[130px]"><SelectValue placeholder="Grade" /></SelectTrigger><SelectContent><SelectItem value="all">All grades</SelectItem>{grades.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>
            <Select value={fee} onValueChange={setFee}><SelectTrigger className="w-[130px]"><SelectValue placeholder="Fees" /></SelectTrigger><SelectContent><SelectItem value="all">All fees</SelectItem><SelectItem value="paid">Paid up</SelectItem><SelectItem value="arrears">In arrears</SelectItem></SelectContent></Select>
            <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="suspended">Suspended</SelectItem></SelectContent></Select>
            <Button variant="outline" onClick={() => toast({ title: 'Exporting…', description: 'students_export.csv' })}><Download className="mr-1.5 h-4 w-4" /> Export</Button>
            <Button onClick={() => setAdmitOpen(true)} disabled={data.classes.length === 0}><UserPlus className="mr-1.5 h-4 w-4" /> Admit</Button>
          </div>
        </div>
      </CardContent></Card>

      {data.classes.length === 0 ? (
        <EmptyState icon={UserPlus} title="Add classes first" description="You need at least one class before admitting students. Add classes in the setup wizard or Settings." />
      ) : data.students.length === 0 ? (
        <EmptyState icon={UserPlus} title="No students admitted yet" description="Admit your first student. An admission number will be auto-generated and the guardian can be notified via SMS." action={{ label: 'Admit first student', onClick: () => setAdmitOpen(true) }} />
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-base">Students</CardTitle><CardDescription>{filtered.length} of {data.students.length} shown · {data.info?.term}</CardDescription></CardHeader>
          <CardContent className="p-0">
            <div className="kitone-scroll overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/30"><tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Admission No.</th><th className="px-4 py-3 font-medium">Student</th><th className="px-4 py-3 font-medium">Class</th><th className="px-4 py-3 font-medium">Guardian</th><th className="px-4 py-3 text-right font-medium">Fee Balance</th><th className="px-4 py-3 text-right font-medium">Attend.</th><th className="px-4 py-3 text-center font-medium">CBC</th><th className="px-4 py-3 text-center font-medium">Status</th><th className="px-4 py-3"></th>
                </tr></thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-b last:border-0 transition-colors hover:bg-muted/40">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.admissionNo}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Avatar className="h-8 w-8"><AvatarFallback className={`text-xs font-bold text-white ${pickColor(s.name)}`}>{initials(s.name)}</AvatarFallback></Avatar><div><p className="font-medium">{s.name}</p><p className="text-[10px] text-muted-foreground">{s.gender === 'M' ? 'Male' : 'Female'}</p></div></div></td>
                      <td className="px-4 py-3"><p className="font-medium">{s.grade}</p><p className="text-[10px] text-muted-foreground">{s.stream}</p></td>
                      <td className="px-4 py-3"><p className="text-xs">{s.guardian}</p><p className="text-[10px] text-muted-foreground font-mono">{s.guardianPhone}</p></td>
                      <td className="px-4 py-3 text-right"><span className={s.feeBalance === 0 ? 'font-semibold text-emerald-600' : s.feeBalance > 20000 ? 'font-semibold text-rose-600' : 'font-semibold text-amber-600'}>{formatKES(s.feeBalance)}</span></td>
                      <td className="px-4 py-3 text-right"><span className={s.attendance < 80 ? 'text-rose-600 font-medium' : 'font-medium'}>{s.attendance}%</span></td>
                      <td className="px-4 py-3 text-center"><CbcBadge level={s.cbc} /></td>
                      <td className="px-4 py-3 text-center"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm" onClick={() => setSelected(s)}>View</Button></td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-muted-foreground">No students match your filters.</td></tr>}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}><SheetContent className="kitone-scroll w-full overflow-y-auto sm:max-w-lg">{selected && <StudentProfile student={selected} />}</SheetContent></Sheet>
      <AdmitDialog open={admitOpen} onOpenChange={setAdmitOpen} onAdmit={addStudent} />
    </div>
  );
}

function AdmitDialog({ open, onOpenChange, onAdmit }: { open: boolean; onOpenChange: (v: boolean) => void; onAdmit: (s: Omit<Student, 'id'>) => void }) {
  const { data } = useInstitution();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [grade, setGrade] = useState(data.classes[0]?.grade ?? '');
  const [stream, setStream] = useState(data.classes[0]?.stream ?? '');
  const [guardian, setGuardian] = useState('');
  const [phone, setPhone] = useState('');

  const admit = () => {
    if (!name.trim()) return;
    const num = `ADM-${Date.now().toString().slice(-6)}`;
    onAdmit({ admissionNo: num, name: name.trim(), gender, grade, stream, guardian: guardian.trim() || '—', guardianPhone: phone.trim() || '—', feeBalance: 0, attendance: 100, avgScore: 0, cbc: '—', status: 'active' });
    setName(''); setGuardian(''); setPhone('');
    onOpenChange(false);
    toast({ title: 'Student admitted', description: `Admission No. ${num} · guardian invited via SMS` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Admit New Student</DialogTitle><DialogDescription>An admission number will be auto-generated.</DialogDescription></DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5"><Label>Full name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Kamau" /></div>
            <div className="space-y-1.5"><Label>Gender</Label><Select value={gender} onValueChange={(v) => setGender(v as 'M' | 'F')}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="M">Male</SelectItem><SelectItem value="F">Female</SelectItem></SelectContent></Select></div>
            <div className="space-y-1.5"><Label>Grade</Label><Select value={grade} onValueChange={setGrade}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Array.from(new Set(data.classes.map((c) => c.grade))).map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1.5"><Label>Stream</Label><Select value={stream} onValueChange={setStream}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Array.from(new Set(data.classes.map((c) => c.stream).filter(Boolean))).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1.5"><Label>Guardian name</Label><Input value={guardian} onChange={(e) => setGuardian(e.target.value)} placeholder="e.g. Peter Kamau" /></div>
            <div className="col-span-2 space-y-1.5"><Label>Guardian phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 7xx xxx xxx" /></div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={admit} disabled={!name.trim()}>Admit & notify</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StudentProfile({ student }: { student: Student }) {
  const cbc = cbcFor(student.avgScore);
  return (
    <>
      <SheetHeader><SheetTitle className="sr-only">{student.name}</SheetTitle><SheetDescription className="sr-only">Student profile</SheetDescription></SheetHeader>
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16"><AvatarFallback className={`text-lg font-bold text-white ${pickColor(student.name)}`}>{initials(student.name)}</AvatarFallback></Avatar>
          <div className="min-w-0 flex-1"><h2 className="text-lg font-bold truncate">{student.name}</h2><p className="text-sm text-muted-foreground font-mono">{student.admissionNo}</p><div className="mt-1.5 flex flex-wrap items-center gap-1.5"><Badge variant="outline">{student.grade}</Badge>{student.stream && <Badge variant="outline">{student.stream}</Badge>}<StatusBadge status={student.status} /></div></div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border p-3 text-center"><p className="text-[10px] uppercase text-muted-foreground">Avg Score</p><p className="text-lg font-bold">{student.avgScore || '—'}{student.avgScore ? '%' : ''}</p>{student.avgScore > 0 && <CbcBadge level={cbc.code} className="mt-0.5" />}</div>
          <div className="rounded-lg border p-3 text-center"><p className="text-[10px] uppercase text-muted-foreground">Attendance</p><p className="text-lg font-bold">{student.attendance}%</p><Progress value={student.attendance} className="mt-1.5 h-1" /></div>
          <div className="rounded-lg border p-3 text-center"><p className="text-[10px] uppercase text-muted-foreground">Fee Balance</p><p className={`text-lg font-bold ${student.feeBalance === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>{formatKES(student.feeBalance)}</p></div>
        </div>
        <Card><CardContent className="space-y-2 p-4 text-sm">
          <div className="flex items-center gap-2"><UserPlus className="h-4 w-4 text-muted-foreground" /><span>{student.guardian}</span></div>
          <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span className="font-mono text-xs">{student.guardianPhone}</span></div>
        </CardContent></Card>
        <Card className="border-amber-500/30 bg-amber-500/5"><CardContent className="p-4"><p className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400"><Lock className="h-4 w-4" /> Restricted · DPO-approved access</p><p className="mt-1 text-xs text-muted-foreground">Medical notes, disability accommodations & disciplinary records are encrypted at rest. Access requires dual approval per Kenya DPA 2019.</p></CardContent></Card>
      </div>
    </>
  );
}