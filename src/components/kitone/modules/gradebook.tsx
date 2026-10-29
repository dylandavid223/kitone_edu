'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EmptyState } from '../empty-state';
import { CbcBadge } from '../ui/badges';
import { useInstitution, cbcFor, pickColor, initials } from '../institution-store';
import { FileText, Trophy, Info, Table2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const components = ['CAT 1', 'CAT 2', 'Assignment', 'Project', 'End Term'];
const defaultWeights: Record<string, number> = { 'CAT 1': 15, 'CAT 2': 15, Assignment: 10, Project: 20, 'End Term': 40 };

export function GradebookModule() {
  const { data } = useInstitution();
  const { toast } = useToast();
  const [subject, setSubject] = useState(data.subjects[0]?.name ?? '');
  const [grade, setGrade] = useState(Array.from(new Set(data.classes.map((c) => c.grade)))[0] ?? '');
  const [weights, setWeights] = useState<Record<string, number>>(defaultWeights);
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});

  const roster = data.students.filter((s) => s.grade === grade);
  function setScore(studentId: string, comp: string, val: number) { const v = Math.max(0, Math.min(100, isNaN(val) ? 0 : val)); setScores((s) => ({ ...s, [studentId]: { ...(s[studentId] ?? {}), [comp]: v } })); }
  const totalWeight = components.reduce((s, c) => s + (weights[c] ?? 0), 0);

  if (data.students.length === 0) return <EmptyState icon={Table2} title="No students to grade" description="Admit students first, then record their scores here." />;

  const ranked = roster.map((s) => { const ss = scores[s.id] ?? {}; const final = Math.round(components.reduce((sum, c) => sum + (ss[c] ?? 0) * ((weights[c] ?? 0) / 100), 0)); return { s, final }; }).sort((a, b) => b.final - a.final).map((x, i) => ({ ...x, rank: i + 1 }));

  return (
    <div className="space-y-4">
      <Card><CardContent className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={subject} onValueChange={setSubject}><SelectTrigger className="w-[170px]"><SelectValue placeholder="Subject" /></SelectTrigger><SelectContent>{data.subjects.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent></Select>
            <Select value={grade} onValueChange={setGrade}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Grade" /></SelectTrigger><SelectContent>{Array.from(new Set(data.classes.map((c) => c.grade))).map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>
            <Badge variant="outline" className="text-[11px]">{data.info?.term}</Badge>
            <Badge variant="outline" className="text-[11px]">{data.info?.curriculum}</Badge>
          </div>
          <Button onClick={() => toast({ title: 'Generating report cards…', description: `${roster.length} students` })}><FileText className="mr-1.5 h-4 w-4" /> Generate Report Cards</Button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-5">
          {components.map((c) => (<div key={c} className="space-y-1"><div className="flex items-center justify-between"><label className="text-[10px] font-medium uppercase text-muted-foreground">{c}</label><span className="text-[10px] font-semibold">{weights[c]}%</span></div><Input type="number" value={weights[c]} onChange={(e) => setWeights((w) => ({ ...w, [c]: parseInt(e.target.value) || 0 }))} className="h-7 text-xs" /></div>))}
        </div>
        <div className={cn('mt-2 flex items-center gap-1.5 text-xs', totalWeight === 100 ? 'text-emerald-600' : 'text-amber-600')}><Info className="h-3.5 w-3.5" /> Total weight: <strong>{totalWeight}%</strong> {totalWeight !== 100 && '· must sum to 100%'}</div>
      </CardContent></Card>

      <Card>
        <CardContent className="p-0">
          <div className="kitone-scroll overflow-x-auto">
            <Table>
              <TableHeader><TableRow className="bg-muted/40">
                <TableHead className="sticky left-0 z-10 min-w-[180px] bg-muted/40"># · Student</TableHead>
                {components.map((c) => <TableHead key={c} className="text-center min-w-[80px]">{c}<br /><span className="text-[10px] font-normal text-muted-foreground">{weights[c]}%</span></TableHead>)}
                <TableHead className="text-center bg-primary/5">Final</TableHead><TableHead className="text-center">CBC</TableHead><TableHead className="text-center">Rank</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {ranked.length === 0 ? <TableRow><TableCell colSpan={components.length + 4} className="py-8 text-center text-sm text-muted-foreground">No students in {grade}.</TableCell></TableRow> : ranked.map(({ s, final, rank }) => { const cbc = cbcFor(final); return (
                  <TableRow key={s.id} className="hover:bg-muted/30">
                    <TableCell className="sticky left-0 z-10 bg-card font-medium"><div className="flex items-center gap-2"><span className="text-xs text-muted-foreground w-4">{rank}</span><Avatar className="h-7 w-7"><AvatarFallback className={`text-[10px] font-bold text-white ${pickColor(s.name)}`}>{initials(s.name)}</AvatarFallback></Avatar><div className="min-w-0"><p className="truncate text-sm">{s.name}</p><p className="font-mono text-[10px] text-muted-foreground">{s.admissionNo}</p></div></div></TableCell>
                    {components.map((c) => { const v = scores[s.id]?.[c] ?? 0; return (<TableCell key={c} className="p-1 text-center"><input type="number" value={v} onChange={(e) => setScore(s.id, c, parseInt(e.target.value) || 0)} className={cn('h-8 w-14 rounded-md border bg-transparent text-center text-sm font-medium outline-none focus:border-primary', v < 45 && 'bg-rose-500/10 text-rose-700 dark:text-rose-400', v >= 45 && v < 60 && 'bg-amber-500/10 text-amber-700 dark:text-amber-400', v >= 60 && v < 80 && 'bg-teal-500/10 text-teal-700 dark:text-teal-400', v >= 80 && 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400')} /></TableCell>); })}
                    <TableCell className="text-center bg-primary/5"><span className="text-base font-bold">{final}%</span></TableCell>
                    <TableCell className="text-center"><CbcBadge level={cbc.code} /></TableCell>
                    <TableCell className="text-center">{rank <= 3 ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600"><Trophy className="h-3.5 w-3.5" /> {rank}</span> : <span className="text-xs text-muted-foreground">{rank}</span>}</TableCell>
                  </TableRow>
                ); })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}