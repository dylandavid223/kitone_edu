'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, SlidersHorizontal, Trophy, Info } from 'lucide-react';
import { gradebookConfig, gradebookRows, cbcFor } from '../data';
import { CbcBadge } from '../ui/badges';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const levelMeta: Record<string, string> = {
  EE: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  ME: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
  AE: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  BE: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
};

export function GradebookModule() {
  const [subject, setSubject] = useState('Mathematics');
  const [classSel, setClass] = useState('Grade 9 East');
  const [weights, setWeights] = useState(gradebookConfig);
  const [scores, setScores] = useState<Record<string, Record<string, number>>>(() => {
    const init: Record<string, Record<string, number>> = {};
    gradebookRows.forEach((r) => {
      init[r.student.id] = { ...r.scores };
    });
    return init;
  });
  const [reportOpen, setReportOpen] = useState(false);
  const { toast } = useToast();

  const components = weights.map((w) => w.component);

  const finalScore = (row: Record<string, number>) =>
    Math.round(
      components.reduce((sum, c) => sum + (row[c] ?? 0) * (weights.find((w) => w.component === c)!.weight / 100), 0)
    );

  const totalWeight = weights.reduce((s, w) => s + w.weight, 0);

  function setScore(studentId: string, component: string, val: number) {
    const v = Math.max(0, Math.min(100, isNaN(val) ? 0 : val));
    setScores((s) => ({
      ...s,
      [studentId]: { ...s[studentId], [component]: v },
    }));
  }

  const averages: Record<string, number> = {};
  components.forEach((c) => {
    averages[c] = Math.round(
      gradebookRows.reduce((sum, r) => sum + (scores[r.student.id]?.[c] ?? 0), 0) / gradebookRows.length
    );
  });

  // Rank rows by final desc
  const ranked = [...gradebookRows]
    .map((r) => ({ r, final: finalScore(scores[r.student.id] ?? r.scores) }))
    .sort((a, b) => b.final - a.final)
    .map((x, i) => ({ ...x, rank: i + 1 }));

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Social Studies'].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={classSel} onValueChange={setClass}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Grade 9 East', 'Grade 9 West', 'Grade 9 North', 'Form 3 North'].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline" className="text-[11px]">Term 2 · 2025</Badge>
              <Badge variant="outline" className="text-[11px]">CBC</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => toast({ title: 'Weight config saved', description: 'New weights applied to all grade 9 Mathematics classes' })}>
                <SlidersHorizontal className="mr-1.5 h-4 w-4" /> Weights
              </Button>
              <Button onClick={() => setReportOpen(true)}>
                <FileText className="mr-1.5 h-4 w-4" /> Generate Report Cards
              </Button>
            </div>
          </div>

          {/* Weights bar */}
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-5">
            {weights.map((w, i) => (
              <div key={w.component} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-medium uppercase text-muted-foreground">{w.component}</label>
                  <span className="text-[10px] font-semibold">{w.weight}%</span>
                </div>
                <Input
                  type="number"
                  value={w.weight}
                  onChange={(e) => {
                    const v = parseInt(e.target.value) || 0;
                    setWeights((ws) => ws.map((x, j) => (j === i ? { ...x, weight: v } : x)));
                  }}
                  className="h-7 text-xs"
                />
              </div>
            ))}
          </div>
          <div className={cn('mt-2 flex items-center gap-1.5 text-xs', totalWeight === 100 ? 'text-emerald-600' : 'text-amber-600')}>
            <Info className="h-3.5 w-3.5" />
            Total weight: <strong>{totalWeight}%</strong> {totalWeight !== 100 && '· must sum to 100%'}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground">CBC levels:</span>
        {[
          { c: 'EE', l: 'Exceeding Expectation · 80–100' },
          { c: 'ME', l: 'Meeting Expectation · 60–79' },
          { c: 'AE', l: 'Approaching · 45–59' },
          { c: 'BE', l: 'Below Expectation · 0–44' },
        ].map((x) => (
          <Badge key={x.c} variant="outline" className={cn('text-[10px]', levelMeta[x.c])}>
            <strong className="mr-1">{x.c}</strong> {x.l}
          </Badge>
        ))}
      </div>

      {/* Spreadsheet */}
      <Card>
        <CardContent className="p-0">
          <div className="kitone-scroll overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="sticky left-0 z-10 min-w-[180px] bg-muted/40"># · Student</TableHead>
                  {components.map((c) => (
                    <TableHead key={c} className="text-center min-w-[80px]">
                      <div className="flex flex-col items-center">
                        <span className="text-xs">{c}</span>
                        <span className="text-[10px] font-normal text-muted-foreground">{weights.find((w) => w.component === c)!.weight}%</span>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center bg-primary/5">Final</TableHead>
                  <TableHead className="text-center">CBC</TableHead>
                  <TableHead className="text-center">Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranked.map(({ r, final: f, rank }) => {
                  const cbc = cbcFor(f);
                  return (
                    <TableRow key={r.student.id} className="hover:bg-muted/30">
                      <TableCell className="sticky left-0 z-10 bg-card font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-4">{rank}</span>
                          <div className="min-w-0">
                            <p className="truncate text-sm">{r.student.name}</p>
                            <p className="font-mono text-[10px] text-muted-foreground">{r.student.admissionNo}</p>
                          </div>
                        </div>
                      </TableCell>
                      {components.map((c) => {
                        const v = scores[r.student.id]?.[c] ?? 0;
                        return (
                          <TableCell key={c} className="p-1 text-center">
                            <input
                              type="number"
                              value={v}
                              onChange={(e) => setScore(r.student.id, c, parseInt(e.target.value) || 0)}
                              className={cn(
                                'h-8 w-14 rounded-md border bg-transparent text-center text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-ring/30',
                                v < 45 && 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
                                v >= 45 && v < 60 && 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
                                v >= 60 && v < 80 && 'bg-teal-500/10 text-teal-700 dark:text-teal-400',
                                v >= 80 && 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                              )}
                            />
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center bg-primary/5">
                        <span className="text-base font-bold">{f}%</span>
                      </TableCell>
                      <TableCell className="text-center"><CbcBadge level={cbc.code} /></TableCell>
                      <TableCell className="text-center">
                        {rank <= 3 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                            <Trophy className="h-3.5 w-3.5" /> {rank}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">{rank}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Class average row */}
                <TableRow className="border-t-2 bg-muted/30 font-semibold">
                  <TableCell className="sticky left-0 z-10 bg-muted/30">Class Average</TableCell>
                  {components.map((c) => (
                    <TableCell key={c} className="text-center text-sm">{averages[c]}%</TableCell>
                  ))}
                  <TableCell className="text-center bg-primary/5">
                    {Math.round(Object.values(averages).reduce((s, v, i) => s + v * (weights[i].weight / 100), 0))}%
                  </TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Report card preview */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report Card Preview</DialogTitle>
            <DialogDescription>{classSel} · {subject} · Term 2 2025</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-bold">Alliance High School</p>
                <p className="text-xs text-muted-foreground">Strong to Serve · Kikuyu, Kiambu</p>
              </div>
              <div className="text-right text-xs">
                <p>Term 2 · 2025</p>
                <p className="text-muted-foreground">CBC</p>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Student:</span><span className="font-medium">{ranked[0].r.student.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Subject:</span><span className="font-medium">{subject}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Final Score:</span><span className="font-bold">{ranked[0].final}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Performance:</span><CbcBadge level={cbcFor(ranked[0].final).code} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Class Rank:</span><span className="font-medium">#{ranked[0].rank} of {gradebookRows.length}</span></div>
            </div>
            <p className="mt-3 rounded bg-muted/40 p-2 text-xs italic">
              &quot;Wanjiru shows strong mastery in Algebra. Encourage consistent practice in Statistics.&quot; — Mrs. Wambui
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => toast({ title: 'PDF generated', description: 'report_card_Wanjiru_T2.pdf' })}>Download PDF</Button>
            <Button className="flex-1" onClick={() => { setReportOpen(false); toast({ title: 'Report cards sent', description: `${gradebookRows.length} parents notified via SMS + email` }); }}>Send to all parents</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
