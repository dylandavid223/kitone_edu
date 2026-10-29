'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList, Plus, Clock, Users, Lock, Camera, MousePointerClick, ShieldAlert, CheckCircle2, XCircle, Play, ChevronLeft, ChevronRight, Flag, AlertTriangle } from 'lucide-react';
import { useInstitution, type Assessment } from '../institution-store';
import { StatusBadge } from '../ui/badges';
import { EmptyState } from '../empty-state';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const testQuestions = [
  { id: 'q1', stem: 'Solve for x: 3x + 7 = 22', options: ['x = 3', 'x = 5', 'x = 7', 'x = 15'], answer: 1 },
  { id: 'q2', stem: 'Simplify: 2(x + 3) − 4', options: ['2x − 1', '2x + 2', '2x + 6', '2x + 10'], answer: 1 },
  { id: 'q3', stem: 'What is the slope of y = 2x + 5?', options: ['2', '5', '−5', '−2'], answer: 0 },
  { id: 'q4', stem: 'Factor: x² − 9', options: ['(x−3)(x−3)', '(x+3)(x−3)', '(x+9)(x−1)', '(x−9)(x+1)'], answer: 1 },
  { id: 'q5', stem: 'If f(x) = 2x + 3, find f(4).', options: ['7', '11', '8', '12'], answer: 1 },
];

export function AssessmentsModule() {
  const { data, addAssessment } = useInstitution();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [player, setPlayer] = useState<{ id: string } | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{data.assessments.length} assessment{data.assessments.length === 1 ? '' : 's'} · {data.info?.curriculum}</p>
        <Button onClick={() => setCreateOpen(true)} disabled={data.classes.length === 0}><Plus className="mr-1.5 h-4 w-4" /> Create Test</Button>
      </div>
      {data.classes.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No classes yet" description="Add classes before creating assessments." />
      ) : data.assessments.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No assessments yet" description="Create your first online test. Add questions, set a timer, and enable anti-cheat features." action={{ label: 'Create first test', onClick: () => setCreateOpen(true) }} />
      ) : (
        <div className="space-y-3">
          {data.assessments.map((a) => (
            <Card key={a.id} className="hover:shadow-md transition-shadow"><CardContent className="p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', a.status === 'Live' ? 'bg-rose-500/10 text-rose-600' : a.status === 'Scheduled' ? 'bg-amber-500/10 text-amber-600' : 'bg-muted text-muted-foreground')}><ClipboardList className="h-5 w-5" /></div>
                  <div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{a.title}</p><StatusBadge status={a.status} /></div><p className="text-xs text-muted-foreground">{a.className} · {a.subject}</p><div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground"><span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.window}</span><span className="flex items-center gap-1"><Users className="h-3 w-3" /> {a.attempts} attempts</span><span className="flex items-center gap-1"><ClipboardList className="h-3 w-3" /> {a.duration} min</span>{a.avgScore > 0 && <span className="font-medium text-foreground">Avg {a.avgScore}%</span>}</div></div>
                </div>
                <div className="flex gap-2">
                  {a.status === 'Live' && <Button size="sm" onClick={() => setPlayer({ id: a.id })}><Play className="mr-1 h-3.5 w-3.5" /> Take test</Button>}
                  {a.status === 'Scheduled' && <Button size="sm" variant="outline" onClick={() => toast({ title: 'Preview', description: a.title })}>Preview</Button>}
                  {a.status === 'Closed' && <Button size="sm" variant="outline" onClick={() => toast({ title: 'Results', description: `${a.attempts} submissions` })}>View results</Button>}
                  {a.status === 'Draft' && <Button size="sm" variant="outline" onClick={() => toast({ title: 'Edit draft', description: a.title })}>Edit</Button>}
                </div>
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}
      <CreateTestDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={addAssessment} />
      <TestPlayer open={!!player} onOpenChange={(v) => !v && setPlayer(null)} />
    </div>
  );
}

function CreateTestDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (v: boolean) => void; onCreate: (a: Omit<Assessment, 'id'>) => void }) {
  const { data } = useInstitution();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState(data.classes[0]?.id ?? '');
  const [subject, setSubject] = useState(data.subjects[0]?.name ?? '');
  const [when, setWhen] = useState('');
  const [duration, setDuration] = useState('60');

  const create = () => { const cls = data.classes.find((c) => c.id === classId); if (!cls || !title.trim()) return; onCreate({ title: title.trim(), subject, className: cls.name, questions: 5, window: when || 'Now', duration: Number(duration) || 60, status: 'Draft', avgScore: 0, attempts: 0 }); setTitle(''); setWhen(''); onOpenChange(false); toast({ title: 'Test created', description: 'Draft saved — add questions then publish' }); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Create Online Test</DialogTitle><DialogDescription>Configure test details & anti-cheat</DialogDescription></DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5"><Label>Test title *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mathematics · Algebra CAT" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Class</Label><Select value={classId} onValueChange={setClassId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{data.classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1.5"><Label>Subject</Label><Select value={subject} onValueChange={setSubject}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{data.subjects.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div className="grid grid-cols-2 gap-3"><div className="space-y-1.5"><Label>Window</Label><Input value={when} onChange={(e) => setWhen(e.target.value)} placeholder="e.g. Today 09:00" /></div><div className="space-y-1.5"><Label>Duration (min)</Label><Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} /></div></div>
          <Separator />
          <div className="space-y-2"><p className="text-xs font-semibold uppercase text-muted-foreground">Anti-cheat</p><Toggle icon={MousePointerClick} label="Randomize question order" defaultChecked /><Toggle icon={Lock} label="Browser lockdown" defaultChecked /><Toggle icon={MousePointerClick} label="Copy-paste detection" defaultChecked /><Toggle icon={ShieldAlert} label="Tab-switch monitoring" defaultChecked /><Toggle icon={Camera} label="Webcam snapshots (consent)" /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={create} disabled={!title.trim()}>Create draft</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Toggle({ icon: Icon, label, desc, defaultChecked }: { icon: React.ComponentType<{ className?: string }>; label: string; desc?: string; defaultChecked?: boolean }) {
  return <div className="flex items-center justify-between gap-3"><div className="flex items-start gap-2.5"><Icon className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-sm font-medium">{label}</p>{desc && <p className="text-[11px] text-muted-foreground">{desc}</p>}</div></div><Switch defaultChecked={defaultChecked} /></div>;
}

function TestPlayer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0"><DialogHeader className="sr-only"><DialogTitle>Online test player</DialogTitle><DialogDescription>Take the assessment</DialogDescription></DialogHeader>{open && <TestPlayerInner onOpenChange={onOpenChange} />}</DialogContent></Dialog>;
}

function TestPlayerInner({ onOpenChange }: { onOpenChange: (v: boolean) => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 45);

  useEffect(() => { const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, []);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');
  const answered = Object.keys(answers).length;
  const score = testQuestions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className={cn('mb-4 flex h-16 w-16 items-center justify-center rounded-full', score >= testQuestions.length * 0.6 ? 'bg-emerald-500/15' : 'bg-amber-500/15')}>{score >= testQuestions.length * 0.6 ? <CheckCircle2 className="h-9 w-9 text-emerald-600" /> : <AlertTriangle className="h-9 w-9 text-amber-600" />}</div>
        <h3 className="text-lg font-bold">Test Submitted</h3>
        <p className="mt-1 text-sm text-muted-foreground">Auto-graded · objective questions</p>
        <div className="mt-4 rounded-lg border p-4"><p className="text-xs uppercase text-muted-foreground">Your score</p><p className="text-3xl font-bold">{score}/{testQuestions.length}</p><p className="text-sm font-medium text-emerald-600">{Math.round((score / testQuestions.length) * 100)}%</p></div>
        <div className="mt-4 w-full max-w-md space-y-1.5">{testQuestions.map((q, i) => (<div key={i} className="flex items-center justify-between rounded-md border px-3 py-1.5 text-xs"><span className="truncate">Q{i + 1}: {q.stem.slice(0, 40)}…</span>{answers[i] === q.answer ? <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Correct</span> : <span className="flex items-center gap-1 text-rose-600"><XCircle className="h-3.5 w-3.5" /> Wrong</span>}</div>))}</div>
        <Button className="mt-4" onClick={() => onOpenChange(false)}>Done</Button>
      </div>
    );
  }

  return (
    <div className="flex h-[80vh] flex-col">
      <div className="flex items-center justify-between border-b bg-rose-500/5 px-4 py-2"><div className="flex items-center gap-3 text-[11px] text-muted-foreground"><span className="flex items-center gap-1"><Lock className="h-3 w-3 text-emerald-600" /> Browser locked</span><span className="flex items-center gap-1"><MousePointerClick className="h-3 w-3 text-emerald-600" /> Copy-paste blocked</span><span className="flex items-center gap-1"><ShieldAlert className="h-3 w-3 text-emerald-600" /> Tab monitoring</span></div><div className={cn('flex items-center gap-1.5 font-mono font-bold', timeLeft < 300 && 'text-rose-600')}><Clock className="h-4 w-4" />{mm}:{ss}</div></div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-3 flex items-center gap-2"><Badge variant="outline" className="text-[10px]">Question {current + 1} of {testQuestions.length}</Badge></div>
          <p className="text-base font-medium leading-relaxed">{testQuestions[current].stem}</p>
          <div className="mt-4 space-y-2">{testQuestions[current].options.map((opt, i) => { const selected = answers[current] === i; return (<button key={i} onClick={() => setAnswers((a) => ({ ...a, [current]: i }))} className={cn('flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all hover:bg-muted/50', selected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border')}><span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold', selected ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground')}>{String.fromCharCode(65 + i)}</span><span>{opt}</span></button>); })}</div>
          <div className="mt-5 flex justify-between"><Button variant="outline" disabled={current === 0} onClick={() => setCurrent(current - 1)}><ChevronLeft className="mr-1 h-4 w-4" /> Previous</Button>{current < testQuestions.length - 1 ? <Button onClick={() => setCurrent(current + 1)}>Next <ChevronRight className="ml-1 h-4 w-4" /></Button> : <Button onClick={() => setSubmitted(true)} className="bg-emerald-600 hover:bg-emerald-700">Submit test</Button>}</div>
        </div>
        <div className="w-48 shrink-0 border-l p-4"><p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Navigator</p><div className="grid grid-cols-5 gap-1.5">{testQuestions.map((_, i) => (<button key={i} onClick={() => setCurrent(i)} className={cn('flex h-8 items-center justify-center rounded-md text-xs font-medium', i === current ? 'bg-primary text-primary-foreground' : answers[i] !== undefined ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-muted text-muted-foreground')}>{i + 1}</button>))}</div><Separator className="my-3" /><div className="space-y-1 text-[11px]"><div className="flex justify-between"><span className="text-muted-foreground">Answered</span><span className="font-medium">{answered}/{testQuestions.length}</span></div></div><Button variant="outline" size="sm" className="mt-3 w-full text-xs"><Flag className="mr-1 h-3 w-3" /> Flag</Button></div>
      </div>
    </div>
  );
}